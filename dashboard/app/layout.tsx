"use client";

import { useState } from "react";
import { ThemeProvider, CssBaseline, Box, Toolbar, IconButton, AppBar, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import theme from "./theme"; // Adjust the path to where your theme file is located

const drawerWidth = 240;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html lang="en">
        <body>
          <Box sx={{ display: "flex" }}>
            <AppBar
              position="fixed"
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                transition: theme.transitions.create(["width", "margin"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                ...(drawerOpen && {
                  marginLeft: drawerWidth,
                  width: `calc(100% - ${drawerWidth}px)`,
                  transition: theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                }),
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, ...(drawerOpen && { display: "none" }) }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                  CRM Platform
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="persistent"
              anchor="left"
              open={drawerOpen}
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: 1,
                  ...theme.mixins.toolbar,
                }}
              >
                <IconButton onClick={handleDrawerToggle}>
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
              <Divider />
              <Box sx={{ overflow: "auto" }}>
                <List>
                  <ListItem button>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Customers" />
                  </ListItem>
                  {/* Add more items here */}
                </List>
                <Divider />
                <List>
                  <ListItem button>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                transition: theme.transitions.create("margin", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                marginLeft: `-${drawerWidth}px`,
                ...(drawerOpen && {
                  transition: theme.transitions.create("margin", {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                  marginLeft: 0,
                }),
              }}
            >
              <Toolbar />
              {children}
            </Box>
          </Box>
        </body>
      </html>
    </ThemeProvider>
  );
}