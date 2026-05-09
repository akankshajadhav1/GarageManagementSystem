import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32', // Deep Green
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1A1A1A', // Stark Black accent
      light: '#404040',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FDFBF7', // Creme background
      paper: '#FFFFFF',   // White surfaces
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#ED6C02',
    },
    success: {
      main: '#2E7D32',
    },
    info: {
      main: '#0288D1',
    },
    text: {
      primary: '#1A1A1A', // Black text
      secondary: '#5C5C5C', // Dark grey for secondary
    },
    divider: alpha('#1A1A1A', 0.1),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.02em', color: '#1A1A1A' },
    h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.01em', color: '#1A1A1A' },
    h3: { fontWeight: 600, fontSize: '1.5rem', color: '#1A1A1A' },
    h4: { fontWeight: 600, fontSize: '1.25rem', color: '#1A1A1A' },
    h5: { fontWeight: 600, fontSize: '1.1rem', color: '#1A1A1A' },
    h6: { fontWeight: 600, fontSize: '1rem', color: '#1A1A1A' },
    body1: { fontSize: '0.95rem', lineHeight: 1.6, color: '#1A1A1A' },
    body2: { fontSize: '0.875rem', lineHeight: 1.5, color: '#333333' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#BDBDBD #FDFBF7',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: '#FDFBF7' },
          '&::-webkit-scrollbar-thumb': { background: '#BDBDBD', borderRadius: '4px' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 15px rgba(46, 125, 50, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          '&:hover': {
            border: '1px solid rgba(46, 125, 50, 0.3)',
            boxShadow: '0 4px 20px rgba(46, 125, 50, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#FAFAFA',
            '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(46, 125, 50, 0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgba(46, 125, 50, 0.04)',
            color: '#1B5E20',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '2px solid rgba(46, 125, 50, 0.1)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.02) !important' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(0, 0, 0, 0.06)' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(253, 251, 247, 0.85)',
          color: '#1A1A1A',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.75rem' },
      },
    },
  },
});

export default theme;
