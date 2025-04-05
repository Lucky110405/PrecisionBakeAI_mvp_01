export const analyzeImage = async (file) => {
    // Simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ingredients: [
            { name: 'Flour', amount: 2, unit: 'cups' },
            { name: 'Sugar', amount: 1, unit: 'spoons' },
          ],
        });
      }, 1000);
    });
  };