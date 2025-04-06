import React from 'react';
import { Typography, List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ModernListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 8,
  mb: 1,
  bgcolor: theme.palette.grey[100],
  transition: 'background-color 0.3s ease',
  '&:hover': { bgcolor: theme.palette.grey[200] },
}));

function MeasurementDisplay({ ingredients }) {
  const convertToGrams = (ingredient) => {
    if (!ingredient) return "0.0";
    
    const { amount, unit, densityData, name } = ingredient;
    const density = densityData?.density || 1;
    const conversions = densityData?.volume_conversions || {};
    
    try {
      const unitLower = (unit || '').toLowerCase();
      const nameLower = (name || '').toLowerCase();
      
      if (nameLower.includes('egg')) {
        if (unitLower === 'large' || unitLower === 'whole') {
          return (amount * (conversions.whole || 50)).toFixed(1);
        }
        if (unitLower === 'medium') {
          return (amount * 44).toFixed(1);
        }
        if (unitLower === 'small') {
          return (amount * 38).toFixed(1);
        }
      }

      if (nameLower.includes('butter') && unitLower === 'stick') {
        return (amount * 113.4).toFixed(1);
      }

      if (unitLower === 'packet' || unitLower === 'packets') {
        if (nameLower.includes('yeast')) {
          return (amount * (conversions.packet || 7)).toFixed(1);
        }
        if (nameLower.includes('gelatin')) {
          return (amount * 7.5).toFixed(1);
        }
      }
      
      if (unitLower === 'cup' || unitLower === 'cups') {
        return conversions.cup ? (amount * conversions.cup).toFixed(1) : (amount * 236.6 * density).toFixed(1);
      }
      if (unitLower === 'tablespoon' || unitLower === 'tablespoons') {
        return conversions.tablespoon ? (amount * conversions.tablespoon).toFixed(1) : (amount * 14.8 * density).toFixed(1);
      }
      if (unitLower === 'teaspoon' || unitLower === 'teaspoons') {
        return conversions.teaspoon ? (amount * conversions.teaspoon).toFixed(1) : (amount * 4.9 * density).toFixed(1);
      }
      if (unitLower === 'ml' || unitLower === 'milliliter' || unitLower === 'milliliters') {
        return (amount * density).toFixed(1);
      }
      if (unitLower === 'g' || unitLower === 'gram' || unitLower === 'grams') {
        return amount.toFixed(1);
      }
      if (unitLower === 'oz' || unitLower === 'ounce' || unitLower === 'ounces') {
        return (amount * 28.35).toFixed(1);
      }
      if (unitLower === 'lb' || unitLower === 'pound' || unitLower === 'pounds') {
        return (amount * 453.6).toFixed(1);
      }
      
      console.log(`No direct conversion for unit: "${unitLower}" for ingredient: "${nameLower}"`);
      console.log(`Density data:`, densityData);
      
      return amount.toFixed(1);
    } catch (error) {
      console.error("Error converting measurement:", error);
      return amount ? amount.toFixed(1) : "0.0";
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: { xs: '300px', md: '350px' } 
    }}>
      <Typography variant="h6" gutterBottom>
        Measurements
      </Typography>
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        maxHeight: { xs: '300px', md: '400px', lg: '500px' },
        pr: 1
      }}>
        <List>
          {ingredients.map((item, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                borderRadius: 2, 
                mb: 1, 
                bgcolor: index % 2 === 0 ? 'grey.100' : 'grey.50',
                '&:hover': { bgcolor: 'grey.200' },
                transition: 'background-color 0.2s',
                py: 1.5
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '100%', 
                alignItems: 'center' 
              }}>
                <Box>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Original: {item.amount} {item.unit}
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'primary.light', 
                    color: 'primary.contrastText', 
                    px: 1.5,
                    py: 0.5, 
                    borderRadius: 1
                  }}
                >
                  {convertToGrams(item)}g
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default MeasurementDisplay;