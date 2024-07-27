import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009688',
      light: '#33b1a6',
      dark: '#00675b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#004d40',
      light: '#00796b',
      dark: '#00332a',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    warning: {
      main: '#F5004F',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#ffffff',
    },
  },
  shape: {},
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '1.5px',
          boxSizing: 'border-box',
          cursor: 'pointer',
          fontFamily: 'Inter, Helvetica, "Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", EmojiSymbols, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", sans-serif',
          fontSize: '16px',
          fontWeight: 700,
          lineHeight: '24px',
          opacity: 1,
          outline: '0 solid transparent',
          padding: '8px 18px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'manipulation',
          width: 'fit-content',
          wordBreak: 'break-word',
          border: 0,
          transition: 'box-shadow 0.3s ease, background 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 24px -10px',
          },
        },
        containedPrimary: {
          background: '#5E5DF0',
          boxShadow: '#5E5DF0 0 10px 20px -10px',
          color: '#FFFFFF',
          '&:hover': {
            background: '#4b4ae0',
            boxShadow: '#4b4ae0 0 12px 24px -10px',
          },
        },
        containedWarning: {
          background: '#FFA726',
          boxShadow: '#FFA726 0 10px 20px -10px',
          color: '#ffffff',
          '&:hover': {
            background: '#F57C00',
            boxShadow: '#F57C00 0 12px 24px -10px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontWeight: 700,
          color: '#009688',
        },
        h2: {
          fontWeight: 600,
          color: '#009688',
        },
        body1: {
          color: '#333333',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});

export default theme;