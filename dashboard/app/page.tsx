"use client";

import { Container, Grid, Paper, Typography, Box, Card, CardContent } from "@mui/material";
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";

// Example chart data
const data = [
  ["Month", "Sales", "Expenses"],
  ["Jan", 1000, 400],
  ["Feb", 1170, 460],
  ["Mar", 660, 1120],
  ["Apr", 1030, 540],
];

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
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>User Statistics</Typography>
              <Typography variant="body1" gutterBottom>Total Users: {userStats.users}</Typography>
              <Typography variant="body1" gutterBottom>Active Users: {userStats.activeUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activities</Typography>
              <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                <ul style={{ padding: 0 }}>
                  <li>John Doe signed up</li>
                  <li>Jane Smith updated profile</li>
                  <li>Mike Johnson made a purchase</li>
                  <li>Jennifer Lee posted a comment</li>
                  <li>David Brown completed a task</li>
                  <li>...</li>
                </ul>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Performance Chart</Typography>
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}