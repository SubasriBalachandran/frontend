import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Stack,
} from "@mui/material";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Upload from "./components/Upload";
import Analysis from "./components/Analysis";
import Home from "./components/Home";
import Logout from "./components/Logout";

function App() {
  // Clear token on every reload
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");


  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      const user = JSON.parse(localStorage.getItem("user"));
      setUserName(user?.name || "");
    };

    handleStorageChange(); // run on mount
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      {/* ✅ Sticky Navbar */}
      <AppBar position="fixed" sx={{ background: "#2d3e50" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" component={Link} to="/" sx={{ color: "white", textDecoration: "none" }}>
              Home
            </Typography>
            {isLoggedIn && (
              <>
                <Button color="inherit" component={Link} to="/upload">Upload</Button>
                <Button color="inherit" component={Link} to="/analysis">Analysis</Button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Button color="inherit" component={Link} to="/signup">Signup</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
              </>
            )}
          </Stack>

          {/* ✅ Right Corner User Info */}
          {isLoggedIn && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>{userName}</Typography>
              <Avatar>{userName?.[0]?.toUpperCase() || "U"}</Avatar>
              <Logout onLogout={() => {
                setIsLoggedIn(false);
                setUserName("");
              }} />
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* ✅ Offset content below fixed navbar */}
      <Box sx={{ mt: 8, px: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={
              <Signup
                onSignup={() => {
                  setIsLoggedIn(true);
                  const user = JSON.parse(localStorage.getItem("user"));
                  setUserName(user?.name || "");
                }}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                onLogin={() => {
                  setIsLoggedIn(true);
                  const user = JSON.parse(localStorage.getItem("user"));
                  setUserName(user?.name || "");
                }}
              />
            }
          />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
