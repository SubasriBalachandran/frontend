import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Avatar, Box, Stack } from "@mui/material";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Upload from "./components/Upload";
import ChartViewer from "./components/ChartViewer";
import Home from "./components/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(JSON.parse(localStorage.getItem("user"))?.name || "");

  useEffect(() => {
    const syncState = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserName(user?.name || "");
    };
    window.addEventListener("storage", syncState);
    return () => window.removeEventListener("storage", syncState);
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <Router>
      <AppBar position="fixed" sx={{background:"#2d3e50"}}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" component={Link} to="/" sx={{ color: "white", textDecoration: "none" }}>
              Home
            </Typography>
            {isLoggedIn && <Button color="inherit" sx={{ textTransform: "none", fontSize: "1.1rem", }} component={Link} to="/upload">Analyze Excel</Button>}
            {!isLoggedIn && (
              <>
                <Button color="inherit" sx={{ textTransform: "none" , fontSize: "1.1rem",}} component={Link} to="/signup">Signup</Button>
                <Button color="inherit" sx={{ textTransform: "none", fontSize: "1.1rem", }} component={Link} to="/login">Login</Button>
              </>
            )}
          </Stack>
          {isLoggedIn && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography color="white">{userName}</Typography>
              <Avatar>{userName?.[0]?.toUpperCase() || "U"}</Avatar>
              <Button color="inherit" sx={{ textTransform: "none", fontSize: "1.1rem", }} onClick={logout}>Logout</Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 3, p: 3 }}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/signup" element={<Signup onSignup={logout} />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/chart" element={<ChartViewer />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
