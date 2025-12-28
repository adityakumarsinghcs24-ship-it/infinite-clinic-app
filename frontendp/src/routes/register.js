import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    await registerUser(username, email, password, passwordConfirm);
  };

  const handleNavigate = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Register
          </Typography>

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleRegister}
          >
            Register
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ cursor: "pointer", mt: 1 }}
            onClick={handleNavigate}
          >
            Already have an account? Sign in
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Register;
