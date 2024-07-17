"use client";

import { Container, Grid, Paper, Typography, TextField, Button, Box } from "@mui/material";
import { useState } from "react";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Add save functionality
    console.log("Profile data saved:", profileData);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Profile</Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            margin="normal"
            name="phone"
            value={profileData.phone}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}