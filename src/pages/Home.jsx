import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  CardMedia,
  Chip,
} from '@mui/material';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import { styled } from '@mui/material/styles';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

const HeroBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4a90e2 30%, #f5a623 90%)',
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  textAlign: 'center',
  color: '#fff',
  transition: 'transform 0.3s ease',
  '&:hover': { transform: 'scale(1.02)' },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  '&:hover': { boxShadow: theme.shadows[6], transform: 'translateY(-4px)' },
}));

function Home() {
  const navigate = useNavigate();
  const [featuredIngredient, setFeaturedIngredient] = useState(null);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);

  useEffect(() => {
    const fetchFeaturedIngredient = async () => {
      const querySnapshot = await getDocs(collection(db, 'ingredients'));
      const ingredients = querySnapshot.docs.map(doc => doc.data());
      setFeaturedIngredient(ingredients[0]);
    };
    fetchFeaturedIngredient();
  }, []);

  useEffect(() => {
    const fetchFeaturedRecipe = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (recipes.length > 0) {
        setFeaturedRecipe(recipes[Math.floor(Math.random() * recipes.length)]);
      }
    };
    fetchFeaturedRecipe();
  }, []);

  return (
    <Container maxWidth="lg">
      <HeroBox sx={{ my: 4 }}>
        <BakeryDiningIcon sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          PrecisionBake AI
        </Typography>
        <Typography variant="body1" paragraph>
          Elevate your baking with AI precision, real-time guidance, and tailored health insights.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate('/recipes')}
          sx={{ mt: 2, px: 4 }}
        >
          Browse Recipes
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/assistant')}
          sx={{ mt: 2, mx: 2 }}
        >
          Ask AI Baking wizard
        </Button>
      </HeroBox>

      {featuredIngredient && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Featured Ingredient
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FeatureCard sx={{ maxWidth: { xs: '100%', sm: 350 }, width: '100%' }}>
              <CardContent>
                <Typography variant="h6">{featuredIngredient.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Density: {featuredIngredient.density} g/mL 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cup: {featuredIngredient.volume_conversions.cup}g
                </Typography>
              </CardContent>
            </FeatureCard>
          </Box>
        </Box>
      )}

      {featuredRecipe && (
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography variant="h5" gutterBottom align="center">
            Featured Recipe
          </Typography>
          <Card 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6
              }
            }}
            onClick={() => navigate(`/recipe/${featuredRecipe.id}`, { state: { recipe: featuredRecipe, type: 'built-in' } })}
          >
            <CardMedia
              component="img"
              height={220}
              image={featuredRecipe.image || `https://source.unsplash.com/random/600x400?${featuredRecipe.name}`}
              alt={featuredRecipe.name}
            />
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {featuredRecipe.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {featuredRecipe.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip label={featuredRecipe.metadata?.difficulty || 'Medium'} size="small" />
                <Button size="small" color="primary">
                  View Recipe
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      <Typography variant="h5" align="center" gutterBottom sx={{ mt: 5, mb: 3 }}>
        Why PrecisionBake?
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Accurate Measurements</Typography>
              <Typography variant="body2" color="text.secondary">
                Convert vague units to precise grams with AI and a dynamic database.
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard>
            <CardContent>
              <Typography variant="h6">Real-Time Feedback</Typography>
              <Typography variant="body2" color="text.secondary">
                Step-by-step guidance for perfect results every time.
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard>
            <CardContent>
              <Typography variant="h6">Health Personalization</Typography>
              <Typography variant="body2" color="text.secondary">
                Tailor recipes to your dietary needs effortlessly.
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Button variant="outlined" color="primary" onClick={() => navigate('/settings')}>
          Customize Settings
        </Button>
      </Box>
    </Container>
  );
}

export default Home;