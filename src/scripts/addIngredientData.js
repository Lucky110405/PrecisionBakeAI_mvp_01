// only for loading data into Firestore, not for use in the app

import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// density is in gram/ml

async function seedDatabase() {
  const ingredients = [
    {
      "id": "flour_bread",
      "name": "Bread Flour",
      "category": "Flour",
      "density": 0.59,
      "density_variations": [
        { "condition": "sifted", "adjusted_density": 0.52 },
        { "condition": "packed", "adjusted_density": 0.65 }
      ],
      "volume_conversions": {
        "cup": 139.7,
        "tablespoon": 8.7,
        "teaspoon": 2.9
      },
      "nutritional_info": {
        "calories": 361,
        "protein": 12,
        "fat": 1,
        "carbs": 73
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "flour_whole_wheat",
      "name": "Whole Wheat Flour",
      "category": "Flour",
      "density": 0.60,
      "density_variations": [
        { "condition": "sifted", "adjusted_density": 0.53 },
        { "condition": "packed", "adjusted_density": 0.66 }
      ],
      "volume_conversions": {
        "cup": 142,
        "tablespoon": 8.9,
        "teaspoon": 2.9
      },
      "nutritional_info": {
        "calories": 340,
        "protein": 13,
        "fat": 2.5,
        "carbs": 72
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "sugar_brown",
      "name": "Brown Sugar",
      "category": "Sugar",
      "density": 0.90,
      "density_variations": [
        { "condition": "packed", "adjusted_density": 0.95 }
      ],
      "volume_conversions": {
        "cup": 213,
        "tablespoon": 13.3,
        "teaspoon": 4.4
      },
      "nutritional_info": {
        "calories": 380,
        "protein": 0,
        "fat": 0,
        "carbs": 98
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "sugar_powdered",
      "name": "Powdered Sugar",
      "category": "Sugar",
      "density": 0.48,
      "density_variations": [
        { "condition": "sifted", "adjusted_density": 0.40 }
      ],
      "volume_conversions": {
        "cup": 113.6,
        "tablespoon": 7.1,
        "teaspoon": 2.4
      },
      "nutritional_info": {
        "calories": 389,
        "protein": 0,
        "fat": 0,
        "carbs": 100
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "butter",
      "name": "Butter",
      "category": "Fat",
      "density": 0.91,
      "density_variations": [
        { "condition": "melted", "adjusted_density": 0.87 }
      ],
      "volume_conversions": {
        "cup": 215.3,
        "tablespoon": 13.5,
        "teaspoon": 4.5
      },
      "nutritional_info": {
        "calories": 717,
        "protein": 0.9,
        "fat": 81,
        "carbs": 0.1
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "vegetable_oil",
      "name": "Vegetable Oil",
      "category": "Fat",
      "density": 0.92,
      "density_variations": [],
      "volume_conversions": {
        "cup": 217.7,
        "tablespoon": 13.6,
        "teaspoon": 4.5
      },
      "nutritional_info": {
        "calories": 884,
        "protein": 0,
        "fat": 100,
        "carbs": 0
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "water",
      "name": "Water",
      "category": "Liquid",
      "density": 1.00,
      "density_variations": [],
      "volume_conversions": {
        "cup": 236.6,
        "tablespoon": 14.8,
        "teaspoon": 4.9
      },
      "nutritional_info": {
        "calories": 0,
        "protein": 0,
        "fat": 0,
        "carbs": 0
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "milk_whole",
      "name": "Whole Milk",
      "category": "Liquid",
      "density": 1.03,
      "density_variations": [],
      "volume_conversions": {
        "cup": 243.6,
        "tablespoon": 15.2,
        "teaspoon": 5.0
      },
      "nutritional_info": {
        "calories": 61,
        "protein": 3.2,
        "fat": 3.3,
        "carbs": 4.8
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "baking_powder",
      "name": "Baking Powder",
      "category": "Leavening",
      "density": 0.90,
      "density_variations": [],
      "volume_conversions": {
        "cup": 213,
        "tablespoon": 13.3,
        "teaspoon": 4.4
      },
      "nutritional_info": {
        "calories": 2,
        "protein": 0,
        "fat": 0,
        "carbs": 1
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "baking_soda",
      "name": "Baking Soda",
      "category": "Leavening",
      "density": 1.10,
      "density_variations": [],
      "volume_conversions": {
        "cup": 260.3,
        "tablespoon": 16.3,
        "teaspoon": 5.4
      },
      "nutritional_info": {
        "calories": 0,
        "protein": 0,
        "fat": 0,
        "carbs": 0
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "cocoa_powder",
      "name": "Cocoa Powder",
      "category": "Other",
      "density": 0.50,
      "density_variations": [
        { "condition": "sifted", "adjusted_density": 0.45 }
      ],
      "volume_conversions": {
        "cup": 118.3,
        "tablespoon": 7.4,
        "teaspoon": 2.5
      },
      "nutritional_info": {
        "calories": 228,
        "protein": 19.6,
        "fat": 13.7,
        "carbs": 57.9
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "salt_table",
      "name": "Table Salt",
      "category": "Seasoning",
      "density": 1.20,
      "density_variations": [],
      "volume_conversions": {
        "cup": 283.9,
        "tablespoon": 17.8,
        "teaspoon": 5.9
      },
      "nutritional_info": {
        "calories": 0,
        "protein": 0,
        "fat": 0,
        "carbs": 0
      },
      "last_updated": "2025-04-05T12:00:00Z"
    },
    {
      "id": "vanilla_extract",
      "name": "Vanilla Extract",
      "category": "Flavoring",
      "density": 0.88,
      "density_variations": [],
      "volume_conversions": {
        "cup": 208.2,
        "tablespoon": 13.0,
        "teaspoon": 4.3
      },
      "nutritional_info": {
        "calories": 288,
        "protein": 0.1,
        "fat": 0.1,
        "carbs": 12.7
      },
      "last_updated": "2025-04-05T12:00:00Z"
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