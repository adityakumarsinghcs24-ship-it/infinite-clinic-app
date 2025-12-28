import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Link,
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser } = useAuth();
  const nav = useNavigate();

  const handleLogin = async () => {
    await loginUser(username, password);
  };

  const handleNavigate = () => {
    nav("/register");
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f9fc",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Login
        </Typography>

        <Stack spacing={3} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username here"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password here"
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              py: 1.2,
              mt: 1,
              borderRadius: 2,
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            Don't have an account?{" "}
            <Link
              onClick={handleNavigate}
              sx={{ cursor: "pointer", fontWeight: 500 }}
              color="primary"
              underline="hover"
            >
              Sign up
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
