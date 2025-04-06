import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Divider, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { analyzeImage } from '../services/visionApi';

const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    transition: 'border-color 0.3s ease',
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
  },
}));

function RecipeInput({ onRecipeSubmit }) {
  const [recipeText, setRecipeText] = useState('');
  const [image, setImage] = useState(null);
  const [submittedRecipe, setSubmittedRecipe] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleTextSubmit = () => {
    if (!recipeText.trim()) return;
    
    const recipeData = { type: 'text', data: recipeText };
    onRecipeSubmit(recipeData);
    setSubmittedRecipe(recipeData);

  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImage(file);
    try {
      const result = await analyzeImage(file);
      const recipeData = { type: 'image', data: result, fileName: file.name };
      onRecipeSubmit(recipeData);
      setSubmittedRecipe(recipeData);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const renderSubmittedRecipe = () => {
    if (!submittedRecipe) return null;
    
    return (
      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'rgba(74, 144, 226, 0.05)', borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          {submittedRecipe.type === 'text' ? 'Submitted Recipe:' : 'Uploaded Recipe:'}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {submittedRecipe.type === 'text' ? (
          <Typography 
            variant="body2" 
            sx={{ 
              whiteSpace: 'pre-line',
              maxHeight: '200px',
              overflow: 'auto',
              fontFamily: 'monospace'
            }}
          >
            {submittedRecipe.data}
          </Typography>
        ) : (
          <Box>
            <Typography variant="body2" gutterBottom>
              File: {submittedRecipe.fileName}
            </Typography>
            {submittedRecipe.data.ingredients && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 1 }}>
                  Detected ingredients:
                </Typography>
                <ul style={{ marginTop: 4 }}>
                  {submittedRecipe.data.ingredients.map((ing, idx) => (
                    <li key={idx}>
                      <Typography variant="body2">
                        {ing.amount} {ing.unit} {ing.name}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>Enter Your Recipe</Typography>
      <ModernTextField
        label="Paste Recipe Here"
        multiline
        rows={isMobile ? 8 : 12}
        fullWidth
        value={recipeText}
        onChange={(e) => setRecipeText(e.target.value)}
        variant="outlined"
        placeholder="Paste your recipe including ingredients and instructions..."
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 2
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTextSubmit}
          size={isMobile ? "large" : "medium"}
          sx={{ 
            py: 1.5,
            flex: { xs: '1', sm: '1' },
          }}
        >
          Submit Recipe
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          component="label"
          size={isMobile ? "large" : "medium"}
          sx={{ 
            py: 1.5,
            flex: { xs: '1', sm: '1' },
          }}
        >
          Upload Recipe Photo
          <input 
            type="file" 
            hidden 
            onChange={handleImageUpload}
            accept="image/*"
          />
        </Button>
      </Box>
      
      {renderSubmittedRecipe()}
    </Box>
  );
}

export default RecipeInput;