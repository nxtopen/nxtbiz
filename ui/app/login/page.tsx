"use client"
import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Box, Typography, Container, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../../lib/axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Joi from 'joi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.alphanum': 'Username must contain only alphanumeric characters',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must be less than 30 characters long',
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
    'string.empty': 'Password is required',
    'string.pattern.base': 'Password must be between 3 and 30 characters long and contain only alphanumeric characters',
  }),
});

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    const { error: validationError } = loginSchema.validate({ username, password });

    if (validationError) {
      toast.error(validationError.details[0].message); // Show error message with toast
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth', { username, password });

      // Cookies.set('token', response.data.token, { expires: 7 });
      setLoading(false);
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.'); // Show error message with toast
      setLoading(false);
    }
  };

  // Handle form submission on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Get Started, Sign In!
        </Typography>
        <Box
          component="form"
          noValidate
          onKeyDown={handleKeyDown} // Add onKeyDown handler here
          sx={{
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400, // Default width for smaller screens
            '@media (min-width: 768px)': {
              maxWidth: 600, // Wider width for larger screens
            },
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 3 }}>
            <Button
              onClick={handleLogin}
              variant="contained"
              sx={{ width: '100%' }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size="1rem" /> : null}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;