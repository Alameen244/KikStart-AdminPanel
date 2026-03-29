import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
        main: '#ED1C24',
      dark: '#000000',
      contrastText: '#fff',
    },
    secondary: {
      main: '#000000',
      dark: '#ED1C24',
      contrastText: '#fff',
    },
    activeSidebar : "#f0c040",
    mainTheme :"#fffafa",
    dark: '#2B2B2B',
    semiDark: '#494949',
    navBlack: '#000000',
    myRed: '#ED1C24',
    background: {
      default: '#FFF8F8',
      paper: '#FFFFFF',
    },
    sidebar: {
      bg: '#2B2B2B',
      text: '#FFFFFF',
      hover: 'rgba(255, 255, 255, 0.1)',
      active: 'rgba(237, 28, 36, 0.2)',
    }
  },
  breakpoints: {
    values: {
      lg: 1140,
      xl: 1600
    }
  },
  typography: {
    fontFamily: 'Noto Sans, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFF8F8',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2B2B2B',
          borderRight: 'none',
        }
      }
    }
  }
});
