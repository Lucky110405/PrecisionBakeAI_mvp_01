import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Box,
  CssBaseline,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  ListItemIcon,
  Divider,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import RecipeBrowser from './components/RecipeBrowser';
import Settings from './pages/Settings';
import AIAssistant from './pages/AIAssistant';



const baseTheme = createTheme({
  palette: {
    primary: { main: '#4a90e2' },
    secondary: { main: '#f5a623' },
    background: { default: '#f4f6f8' },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  spacing: 8,
});


const theme = createTheme({
  ...baseTheme,
  components: {
    MuiAppBar: {
      styleOverrides: { 
        root: { 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.9)',
        } 
      },
    },
    MuiButton: {
      styleOverrides: { 
        root: { 
          borderRadius: 8, 
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }
        } 
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': {
            paddingBottom: 16
          }
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
          [baseTheme.breakpoints.up('lg')]: {
            paddingLeft: 32,
            paddingRight: 32,
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          border: 'none'
        }
      }
    }
  }
});


const menuIcons: Record<string, React.ReactNode> = {
  'Home': <HomeIcon />,
  'Browse Recipes': <MenuBookIcon />,
  'Settings': <SettingsIcon />,
  'AI Assistant': <SmartToyIcon />
};

interface MenuItem {
  text: string;
  path: string;
}

function App() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [pageTitle, setPageTitle] = useState<string>('Home');

   useEffect(() => {
    const path = location.pathname;
    if (path === '/') setPageTitle('Home');
    else if (path === '/recipes') setPageTitle('Recipe Browser');
    else if (path.includes('/recipe/')) setPageTitle('Recipe Details');
    else if (path === '/settings') setPageTitle('Settings');
    else if (path === '/assistant') setPageTitle('AI Assistant');
  }, [location]);


  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (!isDesktop && e.touches[0].clientX < 30) {
      setDrawerOpen(true);
    }
  };


  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent): void => {
    if (
      event && 
      event.type === 'keydown' && 
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems: MenuItem[] = [
    { text: 'Home', path: '/' },
    { text: 'Browse Recipes', path: '/recipes' },
    { text: 'Settings', path: '/settings' },
    { text: 'AI Assistant', path: '/assistant' }
  ];

  const drawerContent = (
    <Box sx={{ width: 260, bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ py: 1 }}>
          PrecisionBake AI
        </Typography>
        <Typography variant="caption">
          Precision baking made simple
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = 
            (item.path === '/' && location.pathname === '/') || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <ListItem
              component="div"
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (!isDesktop) setDrawerOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 1,
                cursor: 'pointer',
                bgcolor: isActive ? `${theme.palette.primary.light}20` : 'transparent',
                color: isActive ? theme.palette.primary.main : 'inherit',
                '&:hover': { 
                  bgcolor: isActive 
                    ? `${theme.palette.primary.light}30`
                    : `${theme.palette.primary.light}10`,
                  color: theme.palette.primary.main
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: isActive ? theme.palette.primary.main : 'inherit' 
              }}>
                {menuIcons[item.text]}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 'medium' : 'regular'
                }} 
              />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          &copy; 2025 PrecisionBake AI
        </Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          minHeight: '100vh',
          bgcolor: theme.palette.background.default
        }}
        onTouchStart={!isDesktop ? handleTouchStart : undefined}
      >
        {isDesktop && (
          <Drawer 
            variant="permanent"
            sx={{
              width: 260,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 260,
                boxSizing: 'border-box',
                borderRight: '1px solid rgba(0,0,0,0.08)',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
        <Box sx={{ 
          flexGrow: 1, 
          ml: { md: '260px' },
          width: { xs: '100%', md: 'calc(100% - 260px)' },
          display: 'flex',
          flexDirection: 'column'
        }}>
          <AppBar 
            position="fixed" 
            elevation={0}
            sx={{ 
              zIndex: theme.zIndex.drawer + 1,
              width: { md: 'calc(100% - 260px)' },
              ml: { md: '260px' },
              bgcolor: 'rgba(255,255,255,0.95)', 
              color: 'text.primary',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
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
                {pageTitle}
              </Typography>
            </Toolbar>
          </AppBar>
          
          {/* Main content area */}
          <Container 
            maxWidth="xl" 
            sx={{ 
              pt: { xs: 9, sm: 10 },
              pb: 4,
              flexGrow: 1,  
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<RecipeBrowser />} />
              <Route path="/recipe/new" element={
                <RecipeDetail />
              } />
              <Route path="/recipe/:id" element={
                <RecipeDetail />
              } />
              <Route path="/settings" element={<Settings />} />
              <Route path="/assistant" element={<AIAssistant />} />
            </Routes>
          </Container>
          
          {/* Optional footer for desktop */}
          {isDesktop && (
            <Box 
              component="footer" 
              sx={{ 
                py: 2, 
                px: 3, 
                mt: 'auto', 
                borderTop: '1px solid rgba(0,0,0,0.08)',
                textAlign: 'center',
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                PrecisionBake AI &copy; 2025
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Mobile drawer */}
        {!isDesktop && (
          <SwipeableDrawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            disableBackdropTransition={false}
            disableDiscovery={false}
            swipeAreaWidth={30}
          >
            {drawerContent}
          </SwipeableDrawer>
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