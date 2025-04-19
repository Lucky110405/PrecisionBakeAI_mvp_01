# PrecisionBake AI

PrecisionBake AI is a modern web application designed to elevate your baking experience with AI-powered precision, real-time guidance, and tailored health insights. Whether you're a beginner or a seasoned baker, PrecisionBake AI helps you achieve perfect results every time.

---

## Features

### 🎂 **Recipe Management**
- Browse a collection of built-in recipes with detailed instructions.
- Add custom recipes via text or image upload.
- View precise measurements and nutritional information for each recipe.

### 🧑‍🍳 **AI Baking Assistant**
- Ask baking-related questions and get expert answers powered by a PythonAnywhere backend using a Retrieval-Augmented Generation (RAG) model.
- Sample questions include:
  - "What's the best temperature for baking bread?"
  - "How do I prevent cookies from spreading too much?"

### ⚖️ **Precision Measurements**
- Convert vague units (e.g., cups, tablespoons) into precise gram measurements.
- Account for ingredient density and volume conversions.

### 🥗 **Nutritional Analysis**
- Calculate calories, protein, carbs, and fat for each recipe.
- Tailor recipes to dietary preferences (e.g., diabetic-friendly, low-carb).

### 📋 **Real-Time Guidance**
- Step-by-step instructions for each ingredient.
- Contextual tips for handling specific ingredients (e.g., flour, butter, eggs).

### ⚙️ **Customizable Settings**
- Set dietary preferences (e.g., vegan, gluten-free).
- Define health goals (e.g., weight loss, muscle gain).
- Specify daily calorie limits.

---

## Project Structure

### **Frontend**
- Built with **React**, **TypeScript**, and **Material UI**.
- Hosted on **Vercel** for fast and reliable deployment.

### **Backend**
- Python-based backend hosted on **PythonAnywhere**.
- Uses **Flask** for handling AI assistant queries.
- Powered by a **Retrieval-Augmented Generation (RAG)** model which uses **Google's GEMMA**.

### **Database**
- **Firebase Firestore** for storing recipes, ingredients, and user settings.
- Ingredient data includes density, volume conversions, and nutritional information.

---

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- Firebase account for database setup

### Clone the Repository
```bash
git clone https://github.com/Lucky110405/PrecisionBakeAI_mvp_01.git
```

### Install Frontend Dependencies
```bash
cd PrecisionBakeAI
npm install
```

### Install Backend Dependencies
```bash
cd ML_Backend (currently the ML_Bakend file is not pushed)
pip install -r requirements.txt
```

---

## Usage

### Run the Frontend
```bash
cd PrecisionBakeAI
npm run dev
```
- Open your browser and navigate to `http://localhost:5173`.

### Run the Backend
```bash
cd ML_Backend
python main.py
```
- The backend will be available at `http://127.0.0.1:8000`.

---

## Environment Variables

### Frontend (`.env`)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

### Backend (`.env`)
```env
OPENROUTER_API_KEY=your_openrouter_api_key
GOOGLE_API_KEY=your_google_api_key
MONGO_URI=your_mongodb_connection_string
DB_NAME=precision_bake
COLLECTION_NAME=recipe_embeddings
INDEX_NAME=recipe_vector_index
```

---

## Key Files and Directories

### Frontend
- [`src/pages`](src/pages ): Contains React pages like [`Home`](src/App.tsx ), [`RecipeDetail`](src/App.tsx ), and [`AIAssistant`](src/App.tsx ).
- [`src/components`](src/components ): Reusable components like [`MeasurementDisplay`](src/components/MeasurementDisplay.jsx ), [`NutritionalInfo`](src/components/NutritionalInfo.jsx ), and [`RealTimeGuidance`](src/components/RealTimeGuidance.jsx ).
- [`src/services`](src/services ): API integrations for Firebase and Vision API.

### Backend
- [`main.py`]: Flask application for handling AI assistant queries.
- `rag.py`: Implements the RAG model for answering baking-related questions.

---

## Screenshots

### Home Page
![Home Page](src\assets\Screenshot 2025-04-19 223943.png)

### Recipe Browser
![Recipe Browser](src\assets\Screenshot 2025-04-20 012400.png)

### AI Assistant
![AI Assistant](src\assets\Screenshot 2025-04-20 012500.png)

---

## Future Enhancements
- **Conversational AI**: Extend the assistant to remember conversation context.
- **Recipe Image Recognition**: Improve ingredient detection from photos.
- **Custom Recipe Storage**: Allow users to save their customized recipes.

---

## What I Learned
- Designed an end-to-end system architecture with clear data flow and modular components, improving scalability and maintainability.
- Gained hands-on experience in integrating Google’s Gemma LLM to deliver domain-specific AI responses tailored to baking science and nutrition.
- Understood how to manage multi-platform deployment by connecting a React frontend on Vercel with a Python backend on PythonAnywhere.
- Structured and utilized Firestore for storing, managing, and querying real-time data related to ingredient densities and nutritional breakdowns efficiently.

---

## Status:
✅ First-phase MVP is live and we are still under active development

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

---

## Final Word: 
If you're into food tech, AI, or building smart tools that solve real-life problems, I’d love your thoughts and feedback! 🙌

---