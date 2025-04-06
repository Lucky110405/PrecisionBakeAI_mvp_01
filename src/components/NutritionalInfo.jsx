import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

// The nutritional info values in firestore are in per 100g of the ingredient
const NutritionalInfo = ({ ingredients }) => {

  const convertToGrams = (ingredient) => {
    if (!ingredient) return 0;
    
    const { amount, unit, densityData, name } = ingredient;
    const density = densityData?.density || 1;
    const conversions = densityData?.volume_conversions || {};
    
    try {
      const unitLower = (unit || '').toLowerCase();
      const nameLower = (name || '').toLowerCase();
      
      if (nameLower.includes('egg')) {
        if (unitLower === 'large' || unitLower === 'whole') {
          return amount * (conversions.whole || 50);
        }
        if (unitLower === 'medium') {
          return amount * 44;
        }
        if (unitLower === 'small') {
          return amount * 38;
        }
      }
  
      if (nameLower.includes('butter') && unitLower === 'stick') {
        return amount * 113.4;
      }
  
      if (unitLower === 'packet' || unitLower === 'packets') {
        if (nameLower.includes('yeast')) {
          return amount * (conversions.packet || 7);
        }
        if (nameLower.includes('gelatin')) {
          return amount * 7.5;
        }
      }
      
      if (unitLower === 'cup' || unitLower === 'cups') {
        return conversions.cup ? (amount * conversions.cup) : (amount * 236.6 * density);
      }
      if (unitLower === 'tablespoon' || unitLower === 'tablespoons') {
        return conversions.tablespoon ? (amount * conversions.tablespoon) : (amount * 14.8 * density);
      }
      if (unitLower === 'teaspoon' || unitLower === 'teaspoons') {
        return conversions.teaspoon ? (amount * conversions.teaspoon) : (amount * 4.9 * density);
      }
      if (unitLower === 'ml' || unitLower === 'milliliter' || unitLower === 'milliliters') {
        return (amount * density);
      }
      if (unitLower === 'g' || unitLower === 'gram' || unitLower === 'grams') {
        return amount;
      }
      if (unitLower === 'oz' || unitLower === 'ounce' || unitLower === 'ounces') {
        return (amount * 28.35);
      }
      if (unitLower === 'lb' || unitLower === 'pound' || unitLower === 'pounds') {
        return (amount * 453.6);
      }
      
      console.log(`NutritionalInfo: No direct conversion for unit "${unitLower}" for ingredient: "${nameLower}"`);
      return amount;
    } catch (error) {
      console.error("Error converting measurement:", error);
      return amount || 0;
    }
  };

  const calculateNutrition = () => {
    if (!ingredients || ingredients.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    return ingredients.reduce((acc, ingredient) => {
      if (!ingredient) return acc;
      
      const nutritionalInfo = ingredient?.densityData?.nutritional_info || {};
      
      const caloriesPerGram = (nutritionalInfo.calories || 0) / 100;
      const proteinPerGram = (nutritionalInfo.protein || 0) / 100;
      const carbsPerGram = (nutritionalInfo.carbs || 0) / 100;
      const fatPerGram = (nutritionalInfo.fat || 0) / 100;
      
      const weightInGrams = convertToGrams(ingredient);
      
      console.log(`Ingredient: ${ingredient.name}, Weight: ${weightInGrams}g`);
      console.log(`  - Calories: ${caloriesPerGram * weightInGrams} (${caloriesPerGram} per gram)`);
      

      return {
        calories: acc.calories + (caloriesPerGram * weightInGrams),
        protein: acc.protein + (proteinPerGram * weightInGrams),
        carbs: acc.carbs + (carbsPerGram * weightInGrams),
        fat: acc.fat + (fatPerGram * weightInGrams)
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