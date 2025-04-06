import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button } from '@mui/material';

const AIAssistant = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.response);
      } else {
        setResponse("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', my: 4 }}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          AI Baking Assistant
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Ask your baking question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained" 
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </Button>
        
        {response && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderLeft: 4, borderColor: 'primary.main' }}>
            <Typography><strong>Assistant:</strong> {response}</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default AIAssistant;
