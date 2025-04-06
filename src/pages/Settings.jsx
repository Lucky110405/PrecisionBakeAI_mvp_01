import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
} from '@mui/material';
import { db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Settings() {
  const navigate = useNavigate();
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [healthGoal, setHealthGoal] = useState('');
  const [calorieLimit, setCalorieLimit] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const userId = 'default_user'; 
      const docRef = doc(db, 'settings', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDietaryPreference(data.dietaryPreference || '');
        setHealthGoal(data.healthGoal || '');
        setCalorieLimit(data.calorieLimit || '');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const userId = 'default_user';
    const settings = { dietaryPreference, healthGoal, calorieLimit };
    await setDoc(doc(db, 'settings', userId), settings);
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Settings
        </Typography>
        <Card sx={{ maxWidth: 600, mx: 'auto', p: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary" paragraph>
              Customize your baking experience.
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Dietary Preference</InputLabel>
              <Select
                value={dietaryPreference}
                label="Dietary Preference"
                onChange={(e) => setDietaryPreference(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="low-carb">Low-Carb</MenuItem>
                <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
                <MenuItem value="diabetic">Diabetic-Friendly</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Health Goal</InputLabel>
              <Select
                value={healthGoal}
                label="Health Goal"
                onChange={(e) => setHealthGoal(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="weight-loss">Weight Loss</MenuItem>
                <MenuItem value="muscle-gain">Muscle Gain</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Daily Calorie Limit (kcal)"
              type="number"
              value={calorieLimit}
              onChange={(e) => setCalorieLimit(e.target.value)}
              sx={{ mb: 3, borderRadius: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSave}
              sx={{ py: 1.5 }}
            >
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Settings;