"use client";

import { Container, Grid, Paper, Typography, Box, Card, CardContent } from "@mui/material";
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const options = {
  title: "Company Performance",
  curveType: "function",
  legend: { position: "bottom" },
};

export default function Dashboard() {
  const [userStats, setUserStats] = useState({ users: 0, activeUsers: 0 });
  useEffect(() => {
    // Fetch user stats from an API or use mock data
    setUserStats({ users: 1000, activeUsers: 150 });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* User Statistics */}
      </Grid>
    </Container>
  );
}