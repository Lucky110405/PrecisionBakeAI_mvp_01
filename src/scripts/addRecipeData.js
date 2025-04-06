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

async function addRecipes() {
  const recipes = [
    {
      id: "recipe_001",
      name: "Chocolate Chip Cookies",
      description: "Classic chewy cookies with chocolate chips",
      image: "https://source.unsplash.com/random/300x200?chocolate+chip+cookies",
      metadata: {
        difficulty: "Easy",
        total_time_minutes: 30,
        servings: 24
      },
      ingredients: [
        { amount: 2.25, unit: "cups", name: "All-Purpose Flour" },
        { amount: 1, unit: "teaspoon", name: "Baking Soda" },
        { amount: 1, unit: "teaspoon", name: "Salt" },
        { amount: 0.75, unit: "cups", name: "Butter" },
        { amount: 0.75, unit: "cups", name: "Granulated Sugar" },
        { amount: 0.75, unit: "cups", name: "Brown Sugar" },
        { amount: 2, unit: "teaspoons", name: "Vanilla Extract" },
        { amount: 2, unit: "large", name: "Eggs" },
        { amount: 2, unit: "cups", name: "Chocolate Chips" }
      ],
      instructions: [
        "Preheat oven to 375°F (190°C).",
        "Combine flour, baking soda, and salt in a small bowl.",
        "Beat butter, granulated sugar, brown sugar and vanilla in large mixer bowl.",
        "Add eggs one at a time, beating well after each addition.",
        "Gradually beat in flour mixture.",
        "Stir in chocolate chips.",
        "Drop by rounded tablespoon onto ungreased baking sheets.",
        "Bake for 9 to 11 minutes or until golden brown.",
        "Cool on baking sheets for 2 minutes; remove to wire racks to cool completely."
      ]
    },
    {
      id: "recipe_002",
      name: "Sourdough Bread",
      description: "Artisanal sourdough with crispy crust and chewy interior",
      image: "https://source.unsplash.com/random/300x200?sourdough+bread",
      metadata: {
        difficulty: "Hard",
        total_time_minutes: 720, 
        servings: 12
      },
      ingredients: [
        { amount: 3.5, unit: "cups", name: "Bread Flour" },
        { amount: 1.5, unit: "cups", name: "Water" },
        { amount: 0.5, unit: "cups", name: "Sourdough Starter" },
        { amount: 2, unit: "teaspoons", name: "Salt" }
      ],
      instructions: [
        "Mix flour and water, let rest for 30 minutes (autolyse).",
        "Add starter and salt, mix until combined.",
        "Perform stretch and folds every 30 minutes for 2.5 hours.",
        "Shape the dough and place in a floured banneton basket.",
        "Refrigerate overnight (8-12 hours) for cold fermentation.",
        "Preheat oven to 500°F (260°C) with Dutch oven inside.",
        "Score the dough and carefully place in the hot Dutch oven.",
        "Bake covered for 20 minutes, then uncovered for 20-25 more minutes.",
        "Allow to cool completely before slicing."
      ]
    },
    {
      id: "recipe_003",
      name: "Vanilla Cake",
      description: "Fluffy vanilla cake for any occasion",
      image: "https://source.unsplash.com/random/300x200?vanilla+cake",
      metadata: {
        difficulty: "Medium",
        total_time_minutes: 60,
        servings: 10
      },
      ingredients: [
        { amount: 2, unit: "cups", name: "All-Purpose Flour" },
        { amount: 1.5, unit: "cups", name: "Granulated Sugar" },
        { amount: 0.5, unit: "cups", name: "Butter" },
        { amount: 1, unit: "cups", name: "Milk" },
        { amount: 2, unit: "tablespoons", name: "Vanilla Extract" },
        { amount: 2, unit: "teaspoons", name: "Baking Powder" },
        { amount: 0.5, unit: "teaspoon", name: "Salt" },
        { amount: 4, unit: "large", name: "Eggs" }
      ],
      instructions: [
        "Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.",
        "In a medium bowl, whisk together flour, baking powder and salt.",
        "In a large bowl, cream together butter and sugar until light and fluffy.",
        "Beat in eggs one at a time, then stir in vanilla.",
        "Gradually beat in the flour mixture alternating with milk.",
        "Divide batter evenly between the prepared pans.",
        "Bake for 30 to 35 minutes, or until a toothpick inserted into the center comes out clean.",
        "Cool in pans for 10 minutes, then remove to wire racks to cool completely."
      ]
    },
    {
      id: "recipe_004",
      name: "Banana Bread",
      description: "Moist and delicious banana bread with cinnamon and nuts",
      image: "https://source.unsplash.com/random/300x200?banana+bread",
      metadata: {
        difficulty: "Easy",
        total_time_minutes: 75,
        servings: 10
      },
      ingredients: [
        { amount: 2, unit: "cups", name: "All-Purpose Flour" },
        { amount: 1, unit: "teaspoon", name: "Baking Soda" },
        { amount: 0.25, unit: "teaspoon", name: "Salt" },
        { amount: 0.5, unit: "cup", name: "Butter" },
        { amount: 0.75, unit: "cup", name: "Brown Sugar" },
        { amount: 2, unit: "large", name: "Eggs" },
        { amount: 4, unit: "medium", name: "Overripe Bananas" },
        { amount: 1, unit: "teaspoon", name: "Vanilla Extract" },
        { amount: 1, unit: "teaspoon", name: "Cinnamon" },
        { amount: 0.5, unit: "cup", name: "Chopped Nuts" }
      ],
      instructions: [
        "Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.",
        "In a large bowl, combine flour, baking soda, and salt.",
        "In a separate bowl, cream together butter and brown sugar.",
        "Stir in eggs and mashed bananas until well blended.",
        "Add vanilla extract and cinnamon, mixing well.",
        "Stir banana mixture into flour mixture just until moistened.",
        "Fold in chopped nuts.",
        "Pour batter into prepared loaf pan.",
        "Bake for 60 to 65 minutes, until a toothpick inserted into center comes out clean.",
        "Let bread cool in pan for 10 minutes, then turn out onto a wire rack."
      ]
    },
    {
      id: "recipe_005",
      name: "Cinnamon Rolls",
      description: "Soft, fluffy cinnamon rolls with cream cheese frosting",
      image: "https://source.unsplash.com/random/300x200?cinnamon+rolls",
      metadata: {
        difficulty: "Medium",
        total_time_minutes: 180,
        servings: 12
      },
      ingredients: [
        { amount: 4, unit: "cups", name: "All-Purpose Flour" },
        { amount: 0.33, unit: "cup", name: "Granulated Sugar" },
        { amount: 1, unit: "tablespoon", name: "Instant Yeast" },
        { amount: 1, unit: "teaspoon", name: "Salt" },
        { amount: 0.67, unit: "cup", name: "Milk" },
        { amount: 0.5, unit: "cup", name: "Water" },
        { amount: 0.33, unit: "cup", name: "Butter" },
        { amount: 1, unit: "large", name: "Egg" },
        { amount: 0.67, unit: "cup", name: "Brown Sugar" },
        { amount: 2, unit: "tablespoons", name: "Cinnamon" },
        { amount: 0.25, unit: "cup", name: "Butter" },
        { amount: 4, unit: "oz", name: "Cream Cheese" },
        { amount: 2, unit: "cups", name: "Powdered Sugar" },
        { amount: 1, unit: "teaspoon", name: "Vanilla Extract" }
      ],
      instructions: [
        "In a large mixing bowl, combine 2 cups of flour with sugar, yeast, and salt.",
        "Heat milk, water, and butter to 120-130°F (49-54°C).",
        "Add liquid mixture to dry ingredients and mix well.",
        "Add egg and remaining flour to form a soft dough.",
        "Knead for 5-7 minutes until smooth and elastic.",
        "Allow dough to rest for 10 minutes.",
        "Roll dough into a 12x18 inch rectangle.",
        "Spread with 1/4 cup softened butter and sprinkle with brown sugar and cinnamon.",
        "Roll up tightly from the long side and cut into 12 pieces.",
        "Place in greased pan and let rise until doubled (about 30-45 minutes).",
        "Bake at 350°F (175°C) for 25-30 minutes.",
        "For frosting, beat cream cheese, butter, powdered sugar, and vanilla until smooth.",
        "Spread frosting over warm rolls before serving."
      ]
    }
  ];

  console.log("Starting to add recipes...");
  for (const recipe of recipes) {
    try {
      await setDoc(doc(db, 'recipes', recipe.id), recipe);
      console.log(`✓ Added recipe: ${recipe.name}`);
    } catch (error) {
      console.error(`Error adding recipe ${recipe.name}:`, error);
    }
  }
  console.log("Finished adding recipes!");
}


addRecipes()
  .then(() => console.log("All recipes added successfully!"))
  .catch(error => console.error("Error in recipe addition:", error));