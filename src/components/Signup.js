import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  Paper,
} from "@mui/material";

const SignUp = () => {
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleOnchange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      userDetails.name === "" ||
      userDetails.email === "" ||
      userDetails.password === "" ||
      userDetails.confirm_password === ""
    ) {
      setError("Please fill in all the required fields");
      return;
    }

    if (userDetails.password !== userDetails.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { confirm_password, ...dataToSend } = userDetails;
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        dataToSend
      );
      console.log("Signup success:", response.data);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('https://images.unsplash.com/photo-1542744173-05336fcc7ad4')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: "100%", opacity: 0.95 }}>
        <Typography variant="h4" gutterBottom align="center">
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={userDetails.name}
            onChange={handleOnchange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleOnchange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={userDetails.password}
            onChange={handleOnchange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirm_password"
            value={userDetails.confirm_password}
            onChange={handleOnchange}
            margin="normal"
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default SignUp;
