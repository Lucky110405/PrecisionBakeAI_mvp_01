import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Stack, 
  Divider,
  LinearProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const getGuidanceText = (ingredient) => {
  if (!ingredient) return '';
  
  const { name, unit } = ingredient;
  const nameLower = name.toLowerCase();
  

  if (nameLower.includes('flour')) {
    return `Measure the flour by spooning it into your measuring ${unit} and leveling it with a knife. For best results, use a kitchen scale.`;
  }
  if (nameLower.includes('butter')) {
    return `If using cold butter, cut into small cubes for easier incorporation. For room temperature butter, it should be soft enough to leave a slight indent when pressed.`;
  }
  if (nameLower.includes('egg')) {
    return `Room temperature eggs incorporate better. If you need to warm cold eggs quickly, place them in a bowl of warm water for 5 minutes.`;
  }
  if (nameLower.includes('sugar')) {
    return `When measuring sugar, make sure to pack brown sugar firmly in the cup. Granulated sugar should be leveled off.`;
  }
  if (nameLower.includes('salt')) {
    return `Use precise measurements for salt as it significantly impacts flavor. Different types of salt (table, kosher, sea) have different densities.`;
  }
  if (nameLower.includes('yeast')) {
    return `Ensure your yeast is fresh and active. For dry yeast, store in a cool, dry place. For best results, proof your yeast before adding to the recipe.`;
  }
  if (nameLower.includes('baking powder') || nameLower.includes('baking soda')) {
    return `Use level measurements and ensure your leavening agent is fresh - it loses potency over time. Test by adding to vinegar - it should fizz vigorously.`;
  }
  

  return `Add ${ingredient.amount} ${ingredient.unit} of ${ingredient.name} as directed in your recipe.`;
};

const RealTimeGuidance = ({ currentStep, ingredients, onNextStep, onPreviousStep, currentStepIndex }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const totalSteps = ingredients ? ingredients.length : 0;
  

  if (!currentStep) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Real-Time Guidance</Typography>
        <Typography color="text.secondary">
          No step selected. Please add ingredients first.
        </Typography>
      </Box>
    );
  }

  const progress = ((currentStepIndex + 1) / totalSteps * 100);

  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography variant="h6" gutterBottom>Real-Time Guidance</Typography>
      <Box sx={{ mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 2,
            '& .MuiLinearProgress-bar': {
              transition: 'transform 0.5s ease-out'
            }
          }} 
        />
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1
        }}>
          <Typography variant="caption">
            Step {currentStepIndex + 1} of {totalSteps}
          </Typography>
          <Typography variant="caption">
            {Math.round(progress)}% Complete
          </Typography>
        </Box>
      </Box>

      <Card 
        variant="outlined" 
        sx={{ 
          mb: 3, 
          borderColor: 'primary.main',
          borderWidth: 2,
          bgcolor: 'rgba(74, 144, 226, 0.03)',
          position: 'relative',
          overflow: 'visible',
          zIndex: 1
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -12, 
            left: 16, 
            bgcolor: 'primary.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            zIndex: 2
          }}
        >
          Current Ingredient
        </Box>
        <CardContent sx={{ pt: 3 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {currentStep.name}
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: 'grey.100', 
                px: 2, 
                py: 1, 
                borderRadius: 2 
              }}
            >
              <Typography variant="body1">
                {currentStep.amount} {currentStep.unit}
              </Typography>
            </Box>
          </Stack>

          <Typography 
            variant="body1" 
            sx={{ 
              bgcolor: 'background.paper', 
              p: 2, 
              borderRadius: 1, 
              border: '1px solid rgba(0,0,0,0.08)',
              lineHeight: 1.7,
              minHeight: { xs: '100px', sm: '120px' },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {getGuidanceText(currentStep)}
          </Typography>
        </CardContent>
      </Card>

      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 10, 
          mt: 4, 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'space-between',
          width: '100%', 
          pointerEvents: 'auto', 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button 
          variant="outlined"
          color="primary" 
          fullWidth={isMobile}
          onClick={(e) => {
            e.stopPropagation(); 
            onPreviousStep();
          }}
          disabled={currentStepIndex <= 0}
          startIcon={<ArrowBackIcon />}
          size="large"
          aria-label="Go to previous step"
          sx={{ 
            py: 1.5,
            minWidth: '120px',
            borderWidth: '2px',
            pointerEvents: 'auto', 
            position: 'relative', 
            zIndex: 12 
          }}
        >
          Previous Step
        </Button>
        <Button 
          variant="contained"
          color="primary" 
          fullWidth={isMobile}
          onClick={(e) => {
            e.stopPropagation(); 
            onNextStep();
          }}
          disabled={currentStepIndex >= totalSteps - 1}
          endIcon={<ArrowForwardIcon />}
          size="large"
          aria-label="Go to next step"
          sx={{ 
            py: 1.5, 
            minWidth: '120px',
            pointerEvents: 'auto', 
            position: 'relative', 
            zIndex: 12 
          }}
        >
          Next Step
        </Button>
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Current step: {currentStepIndex + 1} of {totalSteps} | 
          {currentStep ? ` ${currentStep.name} (${currentStep.amount} ${currentStep.unit})` : ' No step selected'}
        </Typography>
      </Box>
    </Box>
  );
};

export default RealTimeGuidance;