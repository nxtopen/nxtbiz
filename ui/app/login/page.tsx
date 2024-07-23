"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const validate = () => {
    let tempErrors = { username: "", password: "" };
    if (!formData.username) tempErrors.username = "Username is required";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          router.push("/");
        } else {
          const data = await res.json();
          setLoginError(data.message);
        }
      } catch (error) {
        setLoginError("An error occurred. Please try again.");
      }
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography component="h1" variant="h5" align="center">
          Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleInputChange}
            error={Boolean(errors.username)}
            helperText={errors.username}
            // Display validation error message for username
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            // Display validation error message for password
          />
          {loginError && (
            <Typography color="error" variant="body2" align="center">
              {loginError}
            </Typography>
          )}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleButtonClick}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}