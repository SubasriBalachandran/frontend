import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/upload");
    } else {
      navigate("/signup");
    }
  };

  const handleUploadClick = () => {
    if (isLoggedIn) {
      navigate("/upload");
    } else {
      alert("Please sign up or log in first to use the upload feature.");
      navigate("/signup");
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "#1a237e" }}>
          📊 Excel Analytics Platform
        </Typography>

        <Typography variant="h6" color="textSecondary" paragraph>
          Welcome! Upload your Excel files and get real-time insights with summaries and interactive visualizations.
        </Typography>

        <Typography variant="body1" paragraph>
          🔍 Features:
          <ul>
            <li>Secure authentication</li>
            <li>Excel file uploads</li>
            <li>Smart summaries & visual charts</li>
          </ul>
        </Typography>

        <Box mt={4}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleUploadClick}
          >
            Upload Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
