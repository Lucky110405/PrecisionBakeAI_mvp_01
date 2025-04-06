import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  TextField, 
  InputAdornment, 
  Button,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate, useLocation } from 'react-router-dom';

const RecipeBrowser = ({ onRecipeSelect, onCustomRecipe }) => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();
  const location = useLocation();
  const { recipe, type } = location.state || { type: 'custom' };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipeData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching recipes:", error);

        setRecipes(sampleRecipes);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { 
      state: { recipe, type: 'built-in' } 
    });
  };

  const handleCustomRecipeClick = () => {
    navigate('/recipe/new');
  };

  const getFilteredRecipes = () => {
    return recipes
      .filter(recipe => 

        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) &&

        (difficulty === 'all' || recipe.metadata?.difficulty === difficulty)
      )
      .sort((a, b) => {

        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'time') {
          return (a.metadata?.total_time_minutes || 0) - (b.metadata?.total_time_minutes || 0);
        } else if (sortBy === 'difficulty') {
          const difficultyOrder = {Easy: 1, Medium: 2, Hard: 3};
          return difficultyOrder[a.metadata?.difficulty] - difficultyOrder[b.metadata?.difficulty];
        }
        return 0;
      });
  };

  const filteredRecipes = getFilteredRecipes();

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Recipe Collection
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Browse Recipes" />
        <Tab label="Enter Your Own" />
      </Tabs>
      
      {tabValue === 0 ? (
        <>
          <TextField
            fullWidth
            placeholder="Search recipes..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="time">Prep Time</MenuItem>
                <MenuItem value="difficulty">Difficulty</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 3, lg: 4 }}>
            {loading ? (
              <Grid item xs={12} sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading recipes...</Typography>
              </Grid>
            ) : filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={recipe.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    <CardMedia
                      component="img"
                      height={{ xs: 120, sm: 140, md: 180 }}
                      image={recipe.image || `https://source.unsplash.com/random/300x200?${recipe.name}`}
                      alt={recipe.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {recipe.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 2, 
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {recipe.description || `A delicious ${recipe.name.toLowerCase()} recipe`}
                      </Typography>
                      <Box sx={{ display: 'flex', mt: 'auto', justifyContent: 'space-between' }}>
                        <Chip 
                          label={recipe.metadata?.difficulty || 'Medium'} 
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {recipe.metadata?.total_time_minutes ? 
                            `${Math.floor(recipe.metadata.total_time_minutes / 60)}h ${recipe.metadata.total_time_minutes % 60}m` : 
                            '30m'
                          }
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sx={{ py: 4, textAlign: 'center' }}>
                <Typography>No recipes found. Try another search term.</Typography>
              </Grid>
            )}
          </Grid>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Enter Your Own Recipe
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Have a special recipe you'd like to optimize? Enter your own ingredients and instructions.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            size="large"
            onClick={handleCustomRecipeClick}
          >
            Create Custom Recipe
          </Button>
        </Box>
      )}
    </Box>
  );
};


const sampleRecipes = [
  {
    id: 'recipe_001',
    name: 'Chocolate Chip Cookies',
    description: 'Classic chewy cookies with chocolate chips',
    metadata: {
      difficulty: 'Easy',
      total_time_minutes: 30,
      servings: 24
    },
    ingredients: [
      { amount: 2.25, unit: 'cups', name: 'All-Purpose Flour' },
      { amount: 1, unit: 'teaspoons', name: 'Baking Soda' },
      { amount: 0.75, unit: 'cups', name: 'Butter' },
      { amount: 0.75, unit: 'cups', name: 'Granulated Sugar' },
      { amount: 0.75, unit: 'cups', name: 'Brown Sugar' },
      { amount: 2, unit: 'teaspoons', name: 'Vanilla Extract' },
      { amount: 2, unit: 'cups', name: 'Chocolate Chips' }
    ]
  },
  {
    id: 'recipe_002',
    name: 'Sourdough Bread',
    description: 'Artisanal sourdough with crispy crust',
    metadata: {
      difficulty: 'Hard',
      total_time_minutes: 400,
      servings: 12
    },
    ingredients: [
      { amount: 3.5, unit: 'cups', name: 'Bread Flour' },
      { amount: 1.5, unit: 'cups', name: 'Water' },
      { amount: 0.5, unit: 'cups', name: 'Sourdough Starter' },
      { amount: 2, unit: 'teaspoons', name: 'Salt' }
    ]
  },
  {
    id: 'recipe_003',
    name: 'Vanilla Cake',
    description: 'Fluffy vanilla cake for any occasion',
    metadata: {
      difficulty: 'Medium',
      total_time_minutes: 52,
      servings: 10
    },
    ingredients: [
      { amount: 2, unit: 'cups', name: 'All-Purpose Flour' },
      { amount: 1.5, unit: 'cups', name: 'Granulated Sugar' },
      { amount: 0.5, unit: 'cups', name: 'Butter' },
      { amount: 1, unit: 'cups', name: 'Milk' },
      { amount: 2, unit: 'tablespoons', name: 'Vanilla Extract' },
      { amount: 2, unit: 'teaspoons', name: 'Baking Powder' }
    ]
  }
];

export default RecipeBrowser;

