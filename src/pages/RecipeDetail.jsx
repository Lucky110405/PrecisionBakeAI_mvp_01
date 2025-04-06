import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RecipeInput from '../components/RecipeInput';
import MeasurementDisplay from '../components/MeasurementDisplay';
import NutritionalInfo from '../components/NutritionalInfo';
import RealTimeGuidance from '../components/RealTimeGuidance';
import { db } from '../services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe, type } = location.state || { type: 'custom' };
  
  const [ingredients, setIngredients] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const currentStep = ingredients.length > 0 ? ingredients[currentStepIndex] : null;

  useEffect(() => {

    const fetchSettings = async () => {
      try {
        const userId = 'default_user';
        const docRef = doc(db, 'settings', userId);
        const docSnap = await getDoc(docRef);
        setSettings(docSnap.exists() ? docSnap.data() : {});
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err.message);
      }
    };
    
    fetchSettings();
    

    if (type === 'built-in' && recipe) {
      processBuiltInRecipe(recipe);
    }
  }, [recipe, type]);


  const processBuiltInRecipe = async (recipe) => {
    try {
      setLoading(true);
      

      const parsedIngredients = recipe.ingredients || [];
      

      const querySnapshot = await getDocs(collection(db, 'ingredients'));
      const densityMap = {};
      const ingredientAliases = {
        'all-purpose flour': 'bread flour',
        'all purpose flour': 'bread flour',
        'flour': 'bread flour',
        'white sugar': 'sugar',
        'granulated sugar': 'sugar',
        'brown sugar': 'brown sugar',
        'powdered sugar': 'powdered sugar',
        'salt': 'table salt',
        'baking powder': 'baking powder',
        'vanilla extract': 'vanilla extract',
        'vanilla': 'vanilla extract',
        'milk': 'whole milk',
        'water': 'water',
        'vegetable oil': 'vegetable oil',
        'oil': 'vegetable oil',
        'butter': 'butter'
      };
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name) {
          densityMap[data.name.toLowerCase()] = data;
        }
      });


      const enrichedIngredients = parsedIngredients.map((item) => {
        if (!item || !item.name) return { 
          ...item, 
          densityData: { density: 1, nutritional_info: {} }
        };
        
        const itemNameLower = item.name.toLowerCase();
        let densityData;
        

        if (densityMap[itemNameLower]) {
          densityData = densityMap[itemNameLower];
        } 

        else if (ingredientAliases[itemNameLower] && densityMap[ingredientAliases[itemNameLower]]) {
          densityData = densityMap[ingredientAliases[itemNameLower]];
        }

        else {
          const matchingKey = Object.keys(densityMap).find(key => 
            itemNameLower.includes(key) || key.includes(itemNameLower)
          );
          densityData = matchingKey ? densityMap[matchingKey] : { density: 1, nutritional_info: {} };
        }
        
        return {
          ...item,
          densityData
        };
      });
      

      if (settings.dietaryPreference === 'diabetic') {
        enrichedIngredients.forEach((item) => {
          if (item?.name && item.name.toLowerCase().includes('sugar')) {
            item.amount *= 0.5;
          }
        });
      }
      
      setIngredients(enrichedIngredients);
      setCurrentStepIndex(0);
    } catch (err) {
      console.error("Error processing built-in recipe:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleNextStep = () => {
    if (currentStepIndex < ingredients.length - 1) {
      console.log(`Moving to step ${currentStepIndex + 2} of ${ingredients.length}`);
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    } else {
      console.log('Already at last step');
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      console.log(`Moving to step ${currentStepIndex} of ${ingredients.length}`);
      setCurrentStepIndex(prevIndex => prevIndex - 1);
    } else {
      console.log('Already at first step');
    }
  };


  const handleRecipeSubmit = async (recipe) => {
    try {
      let parsedIngredients = [];
      if (recipe.type === 'text') {
        const lines = recipe.data.split('\n').filter(line => line.trim());
        

        parsedIngredients = lines.map((line) => {

          if (line.startsWith('Step') || line.startsWith('Direction') || !line.match(/\d/)) {
            return null;
          }
          

          const amountUnitMatch = line.match(/^([\d\s\/\.⅛⅙⅕¼⅓⅜⅖½⅗⅝⅔¾⅘⅚⅞]+)\s+([a-zA-Z\s]+?)\s+(.+)$/);
          
          if (amountUnitMatch) {
            const [_, amountStr, unitStr, nameStr] = amountUnitMatch;
            

            let amount = amountStr.trim();
            if (amount.includes('⅛')) amount = amount.replace('⅛', '.125');
            if (amount.includes('¼')) amount = amount.replace('¼', '.25');
            if (amount.includes('⅓')) amount = amount.replace('⅓', '.333');
            if (amount.includes('½')) amount = amount.replace('½', '.5');
            if (amount.includes('⅔')) amount = amount.replace('⅔', '.667');
            if (amount.includes('¾')) amount = amount.replace('¾', '.75');
            
            return {
              amount: parseFloat(amount) || 1,
              unit: unitStr.trim().toLowerCase(),
              name: nameStr.trim()
            };
          }
          

          const parts = line.split(' ');
          if (parts.length >= 3) {
            return {
              amount: parseFloat(parts[0]) || 1,
              unit: parts[1].toLowerCase(),
              name: parts.slice(2).join(' ')
            };
          }
          
          return null;
        }).filter(Boolean);
      } else if (recipe.type === 'image') {
        parsedIngredients = recipe.data?.ingredients || [];
      }
  

      const querySnapshot = await getDocs(collection(db, 'ingredients'));
      const densityMap = {};
      const ingredientAliases = {
        'all-purpose flour': 'bread flour',
        'all purpose flour': 'bread flour',
        'flour': 'bread flour',
        'white sugar': 'sugar',
        'granulated sugar': 'sugar',
        'brown sugar': 'brown sugar',
        'powdered sugar': 'powdered sugar',
        'salt': 'table salt',
        'baking powder': 'baking powder',
        'vanilla extract': 'vanilla extract',
        'vanilla': 'vanilla extract',
        'milk': 'whole milk',
        'water': 'water',
        'vegetable oil': 'vegetable oil',
        'oil': 'vegetable oil',
        'butter': 'butter'
      };
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name) {
          densityMap[data.name.toLowerCase()] = data;
        }
      });
  

      const enrichedIngredients = parsedIngredients.map((item) => {
        if (!item || !item.name) return { 
          ...item, 
          densityData: { density: 1, nutritional_info: {} }
        };
        
        const itemNameLower = item.name.toLowerCase();
        let densityData;
        

        if (densityMap[itemNameLower]) {
          densityData = densityMap[itemNameLower];
        } 

        else if (ingredientAliases[itemNameLower] && densityMap[ingredientAliases[itemNameLower]]) {
          densityData = densityMap[ingredientAliases[itemNameLower]];
        }

        else {
          const matchingKey = Object.keys(densityMap).find(key => 
            itemNameLower.includes(key) || key.includes(itemNameLower)
          );
          densityData = matchingKey ? densityMap[matchingKey] : { density: 1, nutritional_info: {} };
        }
        
        return {
          ...item,
          densityData
        };
      });
  

      if (settings.dietaryPreference === 'diabetic') {
        enrichedIngredients.forEach((item) => {
          if (item?.name && item.name.toLowerCase().includes('sugar')) {
            item.amount *= 0.5;
          }
        });
      }
  
      setIngredients(enrichedIngredients);
      setCurrentStepIndex(0);
    } catch (err) {
      console.error("Error processing recipe:", err);
      setError(err.message);
    }
  };


  const goBack = () => {
    navigate('/recipes');  
  };

  useEffect(() => {
    console.log(`Current step index changed to: ${currentStepIndex}`);
    console.log('Current ingredient:', ingredients[currentStepIndex]);
  }, [currentStepIndex, ingredients]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Box sx={{ p: 3 }}>Error: {error}</Box>;
  }


  return (
    <Box sx={{ 
      maxWidth: '100%',
      mx: 'auto', 
      my: { xs: 2, md: 4 } 
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        mb: 3 
      }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={goBack}
          sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
        >
          Back to Recipes
        </Button>
        
        {type === 'built-in' && recipe && (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            flexGrow: 1,
            justifyContent: { xs: 'flex-start', sm: 'flex-end' } 
          }}>
            <Chip 
              label={`Difficulty: ${recipe.metadata?.difficulty || 'Medium'}`} 
              variant="outlined" 
            />
            <Chip 
              label={`Servings: ${recipe.metadata?.servings || 4}`}
              variant="outlined" 
            />
            <Chip 
              label={`Time: ${recipe.metadata?.total_time_minutes ? `${Math.floor(recipe.metadata.total_time_minutes / 60)}h ${recipe.metadata.total_time_minutes % 60}m` : '30m'}`}
              variant="outlined" 
            />
          </Box>
        )}
      </Box>
      
      {type === 'built-in' && recipe && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>{recipe.name}</Typography>
          <Typography variant="body1" paragraph>{recipe.description}</Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>
      )}
      
      <Grid container spacing={{ xs: 3, sm: 4 }}>

        <Grid item xs={12} lg={type === 'custom' && ingredients.length > 0 ? 4 : 12}>
          {type === 'custom' ? (
            <Card sx={{ boxShadow: 3, height: '100%' }}>
              <CardContent>
                <RecipeInput onRecipeSubmit={handleRecipeSubmit} />
              </CardContent>
            </Card>
          ) : (
            type === 'built-in' && recipe && recipe.instructions && (
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Instructions</Typography>
                  <List>
                    {recipe.instructions.map((instruction, index) => (
                      <ListItem key={index} sx={{ 
                        borderRadius: 1, 
                        mb: 1.5, 
                        bgcolor: index % 2 === 0 ? 'rgba(74, 144, 226, 0.05)' : 'transparent',
                        px: 2,
                        py: 1
                      }}>
                        <ListItemText 
                          primary={`Step ${index + 1}`} 
                          secondary={instruction} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )
          )}
        </Grid>
        
        {ingredients.length > 0 && (
          <Grid item xs={12} lg={type === 'custom' ? 8 : 12}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <MeasurementDisplay ingredients={ingredients} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <NutritionalInfo ingredients={ingredients} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ 
                  boxShadow: 3,
                  position: 'relative',
                  overflow: 'visible', 
                  zIndex: 1
                }}>
                  <CardContent sx={{ 
                    overflow: 'visible', 
                    paddingBottom: '80px !important' 
                  }}>
                    <RealTimeGuidance 
                      currentStep={currentStep}
                      ingredients={ingredients}
                      currentStepIndex={currentStepIndex}
                      onNextStep={handleNextStep}
                      onPreviousStep={handlePreviousStep}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
        
        {type === 'custom' && ingredients.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ 
              p: 4, 
              textAlign: 'center', 
              border: '2px dashed #ccc', 
              borderRadius: 2,
              bgcolor: 'rgba(0,0,0,0.02)'
            }}>
              <Typography variant="h6" color="text.secondary">
                Enter your recipe above to see measurements and guidance
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default RecipeDetail;