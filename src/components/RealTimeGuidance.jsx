import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const GuidanceBox = styled(Box)(({ theme }) => ({
  p: 2,
  bgcolor: theme.palette.primary.light,
  color: '#fff',
  borderRadius: 8,
  transition: 'opacity 0.3s ease',
  '&:hover': { opacity: 0.9 },
}));

function RealTimeGuidance({ currentStep }) {
  return (
    <GuidanceBox>
      <Typography variant="h6" gutterBottom>
        Real-Time Guidance
      </Typography>
      <Typography>
        {currentStep
          ? `Step: Add ${currentStep.amount} ${currentStep.unit} of ${currentStep.name}`
          : 'Start measuring your ingredients!'}
      </Typography>
    </GuidanceBox>
  );
}

export default RealTimeGuidance;