import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const NutritionPaper = styled(Paper)(({ theme }) => ({
  p: 3,
  bgcolor: theme.palette.grey[50],
  borderRadius: 12,
}));

function NutritionalInfo({ ingredients }) {
  const convertToGrams = (ingredient) => {
    const { amount, unit, densityData } = ingredient;
    const density = densityData.density || 1;
    if (unit === 'cups') return (amount * 236.6 * density).toFixed(1);
    if (unit === 'tablespoons') return (amount * 14.8 * density).toFixed(1);
    if (unit === 'teaspoons') return (amount * 4.9 * density).toFixed(1);
    return amount;
  };

  const calculateNutrition = () => {
    return ingredients.reduce((acc, item) => {
      const grams = unit === 'grams' ? item.amount : parseFloat(convertToGrams(item));
      const data = item.densityData.nutritional_info || {};
      return {
        calories: acc.calories + (data.calories || 0) * (grams / 100),
        protein: acc.protein + (data.protein || 0) * (grams / 100),
        fat: acc.fat + (data.fat || 0) * (grams / 100),
        carbs: acc.carbs + (data.carbs || 0) * (grams / 100),
      };
    }, { calories: 0, protein: 0, fat: 0, carbs: 0 });
  };

  const nutrition = calculateNutrition();

  return (
    <NutritionPaper>
      <Typography variant="h6" gutterBottom>
        Nutritional Info (Total)
      </Typography>
      <Box sx={{ display: 'grid', gap: 1 }}>
        <Typography>Calories: {nutrition.calories.toFixed(1)} kcal</Typography>
        <Typography>Protein: {nutrition.protein.toFixed(1)}g</Typography>
        <Typography>Fat: {nutrition.fat.toFixed(1)}g</Typography>
        <Typography>Carbs: {nutrition.carbs.toFixed(1)}g</Typography>
      </Box>
    </NutritionPaper>
  );
}

export default NutritionalInfo;