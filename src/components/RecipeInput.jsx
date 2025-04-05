import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
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

  const handleTextSubmit = () => {
    onRecipeSubmit({ type: 'text', data: recipeText });
    setRecipeText('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    const result = await analyzeImage(file);
    onRecipeSubmit({ type: 'image', data: result });
  };

  return (
    <Box sx={{ my: 2 }}>
      <ModernTextField
        label="Paste Recipe Here"
        multiline
        rows={4}
        fullWidth
        value={recipeText}
        onChange={(e) => setRecipeText(e.target.value)}
        variant="outlined"
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTextSubmit}
          sx={{ flex: 1, py: 1.5 }}
        >
          Submit Text
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          component="label"
          sx={{ flex: 1, py: 1.5 }}
        >
          Upload Photo
          <input type="file" hidden onChange={handleImageUpload} />
        </Button>
      </Box>
    </Box>
  );
}

export default RecipeInput;