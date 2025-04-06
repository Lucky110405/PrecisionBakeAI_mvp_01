// only for loading data into Firestore, not for use in the app

import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// density is in gram/ml
// nutritional info is in per 100g of the ingredient

async function seedDatabase() {
  const ingredients = [
{
  "id": "eggs_large",
  "name": "Eggs (Large)",
  "category": "Eggs",
  "density": 1.03,
  "density_variations": [],
  "volume_conversions": {
    "whole": 50, 
    "cup": 243.1,
    "tablespoon": 15.2,
    "teaspoon": 5.1
  },
  "nutritional_info": {
    "calories": 143,
    "protein": 12.6,
    "fat": 9.5,
    "carbs": 0.7
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "egg_whites",
  "name": "Egg Whites",
  "category": "Eggs",
  "density": 1.04,
  "density_variations": [],
  "volume_conversions": {
    "whole": 33, 
    "cup": 246.1,
    "tablespoon": 15.4,
    "teaspoon": 5.1
  },
  "nutritional_info": {
    "calories": 52,
    "protein": 10.9,
    "fat": 0.2,
    "carbs": 0.7
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "egg_yolks",
  "name": "Egg Yolks",
  "category": "Eggs",
  "density": 1.01,
  "density_variations": [],
  "volume_conversions": {
    "whole": 17, 
    "cup": 238.9,
    "tablespoon": 14.9,
    "teaspoon": 5.0
  },
  "nutritional_info": {
    "calories": 322,
    "protein": 16.1,
    "fat": 26.5,
    "carbs": 3.6
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "cream_cheese",
  "name": "Cream Cheese",
  "category": "Dairy",
  "density": 1.02,
  "density_variations": [],
  "volume_conversions": {
    "cup": 241.3,
    "tablespoon": 15.1,
    "teaspoon": 5.0
  },
  "nutritional_info": {
    "calories": 342,
    "protein": 6.2,
    "fat": 34.4,
    "carbs": 3.7
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "yogurt_plain",
  "name": "Plain Yogurt",
  "category": "Dairy",
  "density": 1.04,
  "density_variations": [],
  "volume_conversions": {
    "cup": 246.1,
    "tablespoon": 15.4,
    "teaspoon": 5.1
  },
  "nutritional_info": {
    "calories": 59,
    "protein": 3.5,
    "fat": 3.3,
    "carbs": 4.7
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "sour_cream",
  "name": "Sour Cream",
  "category": "Dairy",
  "density": 1.03,
  "density_variations": [],
  "volume_conversions": {
    "cup": 243.7,
    "tablespoon": 15.2,
    "teaspoon": 5.1
  },
  "nutritional_info": {
    "calories": 198,
    "protein": 2.9,
    "fat": 19.4,
    "carbs": 4.3
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "heavy_cream",
  "name": "Heavy Cream",
  "category": "Dairy",
  "density": 0.99,
  "density_variations": [],
  "volume_conversions": {
    "cup": 234.2,
    "tablespoon": 14.6,
    "teaspoon": 4.9
  },
  "nutritional_info": {
    "calories": 340,
    "protein": 2.1,
    "fat": 36.1,
    "carbs": 2.8
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "sugar",
  "name": "Sugar",
  "category": "Sugar",
  "density": 0.85,
  "density_variations": [
    { "condition": "packed", "adjusted_density": 0.90 }
  ],
  "volume_conversions": {
    "cup": 201.1,
    "tablespoon": 12.6,
    "teaspoon": 4.2
  },
  "nutritional_info": {
    "calories": 387,
    "protein": 0,
    "fat": 0,
    "carbs": 100
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "honey",
  "name": "Honey",
  "category": "Sweetener",
  "density": 1.42,
  "density_variations": [],
  "volume_conversions": {
    "cup": 336.0,
    "tablespoon": 21.0,
    "teaspoon": 7.0
  },
  "nutritional_info": {
    "calories": 304,
    "protein": 0.3,
    "fat": 0,
    "carbs": 82.4
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "maple_syrup",
  "name": "Maple Syrup",
  "category": "Sweetener",
  "density": 1.32,
  "density_variations": [],
  "volume_conversions": {
    "cup": 312.3,
    "tablespoon": 19.5,
    "teaspoon": 6.5
  },
  "nutritional_info": {
    "calories": 260,
    "protein": 0,
    "fat": 0.1,
    "carbs": 67.2
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "almond_flour",
  "name": "Almond Flour",
  "category": "Flour",
  "density": 0.48,
  "density_variations": [
    { "condition": "packed", "adjusted_density": 0.54 }
  ],
  "volume_conversions": {
    "cup": 113.6,
    "tablespoon": 7.1,
    "teaspoon": 2.4
  },
  "nutritional_info": {
    "calories": 579,
    "protein": 21.0,
    "fat": 50.0,
    "carbs": 21.6
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "coconut_flour",
  "name": "Coconut Flour",
  "category": "Flour",
  "density": 0.56,
  "density_variations": [],
  "volume_conversions": {
    "cup": 132.5,
    "tablespoon": 8.3,
    "teaspoon": 2.8
  },
  "nutritional_info": {
    "calories": 400,
    "protein": 18.3,
    "fat": 13.3,
    "carbs": 60.0
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "rice_flour",
  "name": "Rice Flour",
  "category": "Flour",
  "density": 0.65,
  "density_variations": [],
  "volume_conversions": {
    "cup": 153.8,
    "tablespoon": 9.6,
    "teaspoon": 3.2
  },
  "nutritional_info": {
    "calories": 366,
    "protein": 5.9,
    "fat": 1.4,
    "carbs": 80.1
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "oat_flour",
  "name": "Oat Flour",
  "category": "Flour",
  "density": 0.41,
  "density_variations": [],
  "volume_conversions": {
    "cup": 97.0,
    "tablespoon": 6.1,
    "teaspoon": 2.0
  },
  "nutritional_info": {
    "calories": 404,
    "protein": 14.7,
    "fat": 9.1,
    "carbs": 65.7
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "chocolate_chips",
  "name": "Chocolate Chips",
  "category": "Mix-in",
  "density": 0.68,
  "density_variations": [],
  "volume_conversions": {
    "cup": 160.9,
    "tablespoon": 10.1,
    "teaspoon": 3.3
  },
  "nutritional_info": {
    "calories": 553,
    "protein": 6.1,
    "fat": 32.8,
    "carbs": 59.4
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "almonds_chopped",
  "name": "Almonds (Chopped)",
  "category": "Nuts",
  "density": 0.51,
  "density_variations": [],
  "volume_conversions": {
    "cup": 120.7,
    "tablespoon": 7.5,
    "teaspoon": 2.5
  },
  "nutritional_info": {
    "calories": 576,
    "protein": 21.2,
    "fat": 49.4,
    "carbs": 21.7
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "walnuts_chopped",
  "name": "Walnuts (Chopped)",
  "category": "Nuts",
  "density": 0.44,
  "density_variations": [],
  "volume_conversions": {
    "cup": 104.1,
    "tablespoon": 6.5,
    "teaspoon": 2.2
  },
  "nutritional_info": {
    "calories": 654,
    "protein": 15.2,
    "fat": 65.2,
    "carbs": 13.7
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "rolled_oats",
  "name": "Rolled Oats",
  "category": "Grain",
  "density": 0.35,
  "density_variations": [],
  "volume_conversions": {
    "cup": 82.8,
    "tablespoon": 5.2,
    "teaspoon": 1.7
  },
  "nutritional_info": {
    "calories": 389,
    "protein": 16.9,
    "fat": 6.9,
    "carbs": 66.3
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "cinnamon",
  "name": "Cinnamon",
  "category": "Spice",
  "density": 0.56,
  "density_variations": [],
  "volume_conversions": {
    "cup": 132.5,
    "tablespoon": 8.3,
    "teaspoon": 2.8
  },
  "nutritional_info": {
    "calories": 247,
    "protein": 4.0,
    "fat": 1.2,
    "carbs": 80.6
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "lemon_juice",
  "name": "Lemon Juice",
  "category": "Liquid",
  "density": 1.03,
  "density_variations": [],
  "volume_conversions": {
    "cup": 243.7,
    "tablespoon": 15.2,
    "teaspoon": 5.1
  },
  "nutritional_info": {
    "calories": 22,
    "protein": 0.4,
    "fat": 0.2,
    "carbs": 6.9
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "cream_of_tartar",
  "name": "Cream of Tartar",
  "category": "Leavening",
  "density": 0.95,
  "density_variations": [],
  "volume_conversions": {
    "cup": 224.8,
    "tablespoon": 14.1,
    "teaspoon": 4.7
  },
  "nutritional_info": {
    "calories": 258,
    "protein": 0,
    "fat": 0,
    "carbs": 62
  },
  "last_updated": "2025-04-06T12:00:00Z"
},
{
  "id": "yeast_active_dry",
  "name": "Active Dry Yeast",
  "category": "Leavening",
  "density": 0.77,
  "density_variations": [],
  "volume_conversions": {
    "cup": 182.2,
    "tablespoon": 11.4,
    "teaspoon": 3.8,
    "packet": 7 
  },
  "nutritional_info": {
    "calories": 321,
    "protein": 40.4,
    "fat": 7.6,
    "carbs": 41.2
  },
  "last_updated": "2025-04-06T12:00:00Z"
}
    
    // Density Values: Approximate values based on common baking references (e.g., King Arthur Baking, USDA). Densities vary slightly by brand or humidity, so density_variations accounts for this.
    // Volume Conversions: Calculated as density * volume (e.g., 1 cup = 236.6 mL). Rounded for simplicity.
    // Nutritional Info: Per 100g, sourced from typical nutritional databases.
    // you can add more ingredients... But in the same format
  ];

  for (const ingredient of ingredients) {
    await setDoc(doc(db, 'ingredients', ingredient.id), ingredient);
    console.log(`Added ${ingredient.name}`);
  }
}

seedDatabase().catch(console.error);