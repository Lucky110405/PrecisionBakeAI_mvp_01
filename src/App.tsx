import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  CssBaseline,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Home from './pages/Home';
import RecipePage from './pages/RecipePage';
import Settings from './pages/Settings';

const theme = createTheme({
  palette: {
    primary: { main: '#4a90e2' }, // Modern blue
    secondary: { main: '#f5a623' }, // Warm accent
    background: { default: '#f4f6f8' }, // Light gray background
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif', // Modern font
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: { root: { boxShadow: '0 2px 10px rgba(0,0,0,0.1)' } },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } },
    },
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Tab') return;
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Recipe', path: '/recipe' },
    { text: 'Settings', path: '/settings' },
  ];

  const drawerContent = (
    <Box sx={{ width: 250, bgcolor: '#fff', height: '100%', p: 2 }}>
      <Typography variant="h6" sx={{ p: 2, color: theme.palette.primary.main }}>
        PrecisionBake AI
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem
            component="div"
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              cursor: 'pointer',
              borderRadius: 4,
              mb: 1,
              '&:hover': { bgcolor: theme.palette.primary.light, color: '#fff' },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {isDesktop && (
          <Drawer variant="permanent" open sx={{ width: 250, flexShrink: 0 }}>
            {drawerContent}
          </Drawer>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar>
              {!isDesktop && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                PrecisionBake AI
              </Typography>
            </Toolbar>
          </AppBar>
          <Box component="main" sx={{ p: { xs: 2, md: 4 }, mt: 8 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe" element={<RecipePage />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
        {!isDesktop && (
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>
        )}
      </Box>
    </ThemeProvider>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;