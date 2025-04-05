import React from 'react';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
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
    const { amount, unit, densityData } = ingredient;
    const density = densityData.density || 1;
    if (unit === 'cups') return (amount * 236.6 * density).toFixed(1);
    if (unit === 'tablespoons') return (amount * 14.8 * density).toFixed(1);
    if (unit === 'teaspoons') return (amount * 4.9 * density).toFixed(1);
    return amount;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Measurements
      </Typography>
      <List>
        {ingredients.map((item, index) => (
          <ModernListItem key={index}>
            <ListItemText
              primary={`${item.name}: ${convertToGrams(item)}g`}
              secondary={`Original: ${item.amount} ${item.unit}`}
            />
          </ModernListItem>
        ))}
      </List>
    </Paper>
  );
}

export default MeasurementDisplay;