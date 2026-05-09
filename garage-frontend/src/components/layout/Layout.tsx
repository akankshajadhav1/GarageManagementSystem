import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 260;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} drawerWidth={DRAWER_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          pt: 5,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px)',
          animation: 'fadeIn 0.4s ease-out',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
