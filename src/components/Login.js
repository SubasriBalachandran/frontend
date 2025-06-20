import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Alert } from "@mui/material";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin();
      navigate("/upload");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box 
    sx={{
          backgroundImage: `url('https://images.unsplash.com/photo-1531746790731-6c087fecd65a')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "90vh",
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          px: 2,
           }}
           >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: "100%", opacity: 0.95 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField 
          fullWidth 
           label="Email"
           name="email" 
           type="email"
          value={formData.email} 
          onChange={handleChange} 
          margin="normal" 
          required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />     

          <Button 
           type="submit" 
          variant="contained"
           fullWidth
           sx={{ mt: 2 }}
           >
            Login
            </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
