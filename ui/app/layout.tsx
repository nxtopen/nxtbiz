"use client";

import { useState } from "react";
import { usePathname } from 'next/navigation';
import { ThemeProvider, CssBaseline, Box, Toolbar, IconButton, AppBar, Typography, Modal, Grid, Card, CardContent } from "@mui/material";
import theme from "./theme";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import { FaHome, FaTachometerAlt, FaUsers, FaUser, FaCog } from 'react-icons/fa';
import { CgMenuGridO } from "react-icons/cg"; // Import the new icon

const menuItems = [
  { icon: FaHome, label: "Home", link: "/" },
  { icon: FaTachometerAlt, label: "Dashboard", link: "/dashboard" },
  { icon: FaUsers, label: "Customers", link: "/customers" },
  { icon: FaUser, label: "Profile", link: "/profile" },
  { icon: FaCog, label: "Settings", link: "/settings" },
];

const popupWidth = 300;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [popupOpen, setPopupOpen] = useState(false);

  const handlePopupToggle = () => {
    setPopupOpen(!popupOpen);
  };

  const isLoginRoute = pathname === '/login';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html lang="en">
        <body>
          <Box sx={{ display: "flex", flexDirection: 'column', height: '100vh' }}>
            {!isLoginRoute && (
              <AppBar
                position="fixed"
                sx={{
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  bgcolor: '#4679b4', // More pronounced blue tint with transparency
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  borderBottom: '#4679b4', // Deeper blue border
                }}
              >
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="open popup"
                    edge="start"
                    onClick={handlePopupToggle}
                    sx={{ mr: 2 }}
                  >
                    <CgMenuGridO />
                  </IconButton>
                  <Typography variant="h6" noWrap>
                    NXTBiz Suite
                  </Typography>
                </Toolbar>
              </AppBar>
            )}
            <Modal
              open={popupOpen}
              onClose={handlePopupToggle}
              aria-labelledby="popup-menu"
              aria-describedby="popup-menu-description"
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-end', sm: 'center' },
                justifyContent: 'center',
                backdropFilter: 'blur(5px)',
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 2, // Reduced padding for the modal content
                  outline: 'none',
                  backdropFilter: 'blur(5px)',
                }}
              >
                <Grid container spacing={1}>
                  {menuItems.map((item, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Card
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'row', sm: 'column' },
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          height: { xs: 'auto', sm: '100%' },
                          p: 1, // Reduced padding for the card content
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'none',
                          }
                        }}
                        component="a"
                        href={item.link}
                      >
                        <CardContent
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'row', sm: 'column' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 0, // Removed padding for the card content
                            '&:last-child': {
                              paddingBottom: 0, // Ensure no extra padding at the bottom
                            }
                          }}
                        >
                          <item.icon size={24} />
                          <Typography variant="body2" sx={{ mt: { sm: 1, xs: 0 }, ml: { xs: 1, sm: 0 } }}>
                            {item.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Modal>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                mt: { xs: 6, sm: 8 }, // Adjust margin-top to ensure content is below AppBar
              }}
            >
              {children}
            </Box>
          </Box>
          <ToastContainer />
        </body>
      </html>
    </ThemeProvider>
  );
}