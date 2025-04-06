import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const NutritionalInfo = ({ ingredients }) => {
  const calculateNutrition = () => {
    if (!ingredients || ingredients.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    return ingredients.reduce((acc, ingredient) => {

      const nutritionalInfo = ingredient?.densityData?.nutritional_info || {};
      

      const calories = nutritionalInfo.calories || 0;
      const protein = nutritionalInfo.protein || 0;
      const carbs = nutritionalInfo.carbs || 0;
      const fat = nutritionalInfo.fat || 0;
      

      const amount = ingredient?.amount || 0;
      
      return {
        calories: acc.calories + (calories * amount),
        protein: acc.protein + (protein * amount),
        carbs: acc.carbs + (carbs * amount),
        fat: acc.fat + (fat * amount)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const nutrition = calculateNutrition();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Nutritional Information</Typography>
      <Divider sx={{ mb: 1 }} />
      <List dense sx={{ flexGrow: 1 }}>
        <ListItem>
          <ListItemText primary="Calories" secondary={`${Math.round(nutrition.calories)} kcal`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Protein" secondary={`${Math.round(nutrition.protein)} g`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Carbohydrates" secondary={`${Math.round(nutrition.carbs)} g`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Fat" secondary={`${Math.round(nutrition.fat)} g`} />
        </ListItem>
      </List>
    </Box>
  );
};

export default NutritionalInfo;