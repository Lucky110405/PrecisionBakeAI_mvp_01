import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import RecipeInput from '../components/RecipeInput';
import MeasurementDisplay from '../components/MeasurementDisplay';
import NutritionalInfo from '../components/NutritionalInfo';
import RealTimeGuidance from '../components/RealTimeGuidance';
import { db } from '../services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

function RecipePage() {
  const [ingredients, setIngredients] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      const userId = 'default_user';
      const docRef = doc(db, 'settings', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setSettings(docSnap.data());
    };
    fetchSettings();
  }, []);

  const handleRecipeSubmit = async (recipe) => {
    let parsedIngredients = [];
    if (recipe.type === 'text') {
      const lines = recipe.data.split('\n');
      parsedIngredients = lines.map((line) => {
        const [amount, unit, ...name] = line.split(' ');
        return { amount: parseFloat(amount), unit, name: name.join(' ') };
      });
    } else if (recipe.type === 'image') {
      parsedIngredients = recipe.data.ingredients;
    }

    const querySnapshot = await getDocs(collection(db, 'ingredients'));
    const densityMap = {};
    querySnapshot.forEach((doc) => {
      densityMap[doc.data().name.toLowerCase()] = doc.data();
    });

    const enrichedIngredients = parsedIngredients.map((item) => ({
      ...item,
      densityData: densityMap[item.name.toLowerCase()] || { density: 1, nutritional_info: {} },
    }));

    if (settings.dietaryPreference === 'diabetic') {
      enrichedIngredients.forEach((item) => {
        if (item.name.toLowerCase().includes('sugar')) item.amount *= 0.5;
      });
    }

    setIngredients(enrichedIngredients);
    setCurrentStep(enrichedIngredients[0]);
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', my: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <RecipeInput onRecipeSubmit={handleRecipeSubmit} />
            </CardContent>
          </Card>
        </Grid>
        {ingredients.length > 0 && (
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <MeasurementDisplay ingredients={ingredients} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <NutritionalInfo ingredients={ingredients} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <RealTimeGuidance currentStep={currentStep} />
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