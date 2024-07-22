"use client";

import { Container, Grid, Paper, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Switch, Box } from "@mui/material";
import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
  });

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Settings</Typography>
        <Box component="form" noValidate autoComplete="off">
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Theme</FormLabel>
            <RadioGroup
              name="theme"
              value={settings.theme}
              onChange={handleSettingChange}
            >
              <FormControlLabel value="light" control={<Radio />} label="Light" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Notifications</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleSettingChange}
                  name="notifications"
                />
              }
              label="Enable Notifications"
            />
          </FormControl>
        </Box>
      </Paper>
    </Container>
  );
}