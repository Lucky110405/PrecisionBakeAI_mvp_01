import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RecipeInput from '../components/RecipeInput';
import MeasurementDisplay from '../components/MeasurementDisplay';
import NutritionalInfo from '../components/NutritionalInfo';
import RealTimeGuidance from '../components/RealTimeGuidance';
import { db } from '../services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

function RecipePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const recipeFromNav = location.state?.recipe;
  
  const [ingredients, setIngredients] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const currentStep = ingredients.length > 0 ? ingredients[currentStepIndex] : null;


  useEffect(() => {
    if (recipeFromNav && recipeFromNav.ingredients) {
      processRecipe(recipeFromNav);
    }
  }, [recipeFromNav]);


  const processRecipe = async (recipe) => {
    try {
      setLoading(true);
      
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
          console.log(`Loaded from Firestore: ${data.name} with density ${data.density}`);
          densityMap[data.name.toLowerCase()] = data;
        }
      });


      console.log("Ingredient database loaded:", Object.keys(densityMap));
  

      const enrichedIngredients = parsedIngredients.map((item) => {
        if (!item || !item.name) return { 
          ...item, 
          densityData: { density: 1, nutritional_info: {} }
        };
        
        const itemNameLower = item.name.toLowerCase();
        let densityData;
        let matchSource = 'not found';
        

        if (densityMap[itemNameLower]) {
          densityData = densityMap[itemNameLower];
          matchSource = 'direct match';
        } 

        else if (ingredientAliases[itemNameLower] && densityMap[ingredientAliases[itemNameLower]]) {
          densityData = densityMap[ingredientAliases[itemNameLower]];
          matchSource = 'alias match';
        }

        else {
          const matchingKey = Object.keys(densityMap).find(key => 
            itemNameLower.includes(key) || key.includes(itemNameLower)
          );
          densityData = matchingKey ? densityMap[matchingKey] : { density: 1, nutritional_info: {} };
          matchSource = matchingKey ? 'partial match' : 'default fallback';
        }
        
        console.log(`Ingredient: "${item.name}" → Matched with: "${densityData.name || 'default'}" (${matchSource})`); 
        console.log(`  - Density: ${densityData.density || 1}`);
        console.log(`  - Volume conversions:`, densityData.volume_conversions || {});
        
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
    } finally {
      setLoading(false);
    }
  };


  const handleNextStep = () => {
    if (currentStepIndex < ingredients.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  useEffect(() => {

    setCurrentStepIndex(0);
  }, [ingredients]);

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
  }, []);

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
          console.log(`Loaded from Firestore: ${data.name} with density ${data.density}`);
          densityMap[data.name.toLowerCase()] = data;
        }
      });


      console.log("Ingredient database loaded:", Object.keys(densityMap));
  

      const enrichedIngredients = parsedIngredients.map((item) => {
        if (!item || !item.name) return { 
          ...item, 
          densityData: { density: 1, nutritional_info: {} }
        };
        
        const itemNameLower = item.name.toLowerCase();
        let densityData;
        let matchSource = 'not found';
        

        if (densityMap[itemNameLower]) {
          densityData = densityMap[itemNameLower];
          matchSource = 'direct match';
        } 

        else if (ingredientAliases[itemNameLower] && densityMap[ingredientAliases[itemNameLower]]) {
          densityData = densityMap[ingredientAliases[itemNameLower]];
          matchSource = 'alias match';
        }

        else {
          const matchingKey = Object.keys(densityMap).find(key => 
            itemNameLower.includes(key) || key.includes(itemNameLower)
          );
          densityData = matchingKey ? densityMap[matchingKey] : { density: 1, nutritional_info: {} };
          matchSource = matchingKey ? 'partial match' : 'default fallback';
        }
        
        console.log(`Ingredient: "${item.name}" → Matched with: "${densityData.name || 'default'}" (${matchSource})`); 
        console.log(`  - Density: ${densityData.density || 1}`);
        console.log(`  - Volume conversions:`, densityData.volume_conversions || {});
        
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


  if (error) {
    return <Box sx={{ p: 3 }}>Error: {error}</Box>;
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', my: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={goBack} 
        sx={{ mb: 3 }}
      >
        Back to Recipes
      </Button>
      
      {recipeFromNav && (
        <Typography variant="h4" gutterBottom>{recipeFromNav.name}</Typography>
      )}
      
      <Grid container spacing={3}>

        <Grid item xs={12} md={ingredients.length > 0 ? 5 : 12} lg={ingredients.length > 0 ? 4 : 12}>
          <Card sx={{ boxShadow: 3, height: '100%' }}>
            <CardContent>
              <RecipeInput onRecipeSubmit={handleRecipeSubmit} />
            </CardContent>
          </Card>
        </Grid>
        
        {ingredients.length > 0 && (
          <Grid item xs={12} md={7} lg={8}>
            <Grid container spacing={3}>
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
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
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
      </Grid>
    </Box>
  );
}

export default RecipePage;