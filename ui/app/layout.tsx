"use client";

import { useState } from "react";
import { ThemeProvider, CssBaseline, Box, Toolbar, IconButton, AppBar, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import theme from "./theme";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import { FaHome, FaTachometerAlt, FaUsers, FaUser, FaCog, FaChevronLeft, FaBars } from 'react-icons/fa'; // Import react-icons

const drawerWidth = 240;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [drawerOpen, setDrawerOpen] = useState(true);

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
                  <FaBars /> {/* Use react-icons */}
                </IconButton>
                <Typography variant="h6" noWrap>
                  NXTBiz Suite
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
                  <FaChevronLeft /> {/* Use react-icons */}
                </IconButton>
              </Box>
              <Divider />
              <Box sx={{ overflow: "auto" }}>
                <List>
                  <ListItem button>
                    <ListItemIcon>
                      <FaHome /> {/* Use react-icons */}
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <FaTachometerAlt /> {/* Use react-icons */}
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <FaUsers /> {/* Use react-icons */}
                    </ListItemIcon>
                    <ListItemText primary="Customers" />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem button component="a" href="/profile">
                    <ListItemIcon>
                      <FaUser /> {/* Use react-icons */}
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem button component="a" href="/settings">
                    <ListItemIcon>
                      <FaCog /> {/* Use react-icons */}
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
          <ToastContainer />
        </body>
      </html>
    </ThemeProvider>
  );
}