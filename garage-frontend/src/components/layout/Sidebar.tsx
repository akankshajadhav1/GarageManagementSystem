import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Vehicles', icon: <DirectionsCarIcon />, path: '/vehicles' },
  { text: 'Service Requests', icon: <BuildIcon />, path: '/service-requests' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose, drawerWidth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ px: 2, py: 2 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontWeight: 700,
            letterSpacing: '0.1em',
            fontSize: '0.65rem',
          }}
        >
          MAIN MENU
        </Typography>
      </Box>
      <List sx={{ px: 1.5, flex: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  transition: 'all 0.2s ease',
                  backgroundColor: active ? alpha('#2E7D32', 0.12) : 'transparent',
                  borderLeft: active ? '3px solid #2E7D32' : '3px solid transparent',
                  '&:hover': {
                    backgroundColor: active
                      ? alpha('#2E7D32', 0.16)
                      : alpha('#2E7D32', 0.06),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? '#2E7D32' : 'text.secondary',
                    minWidth: 40,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'text.primary' : 'text.secondary',
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#2E7D32',
                      boxShadow: '0 0 8px rgba(46, 125, 50, 0.4)',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom section */}
      <Box
        sx={{
          p: 2,
          mx: 1.5,
          mb: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05), rgba(76, 175, 80, 0.02))',
          border: '1px solid rgba(46, 125, 50, 0.1)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Garage Management
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: 'text.disabled', mt: 0.5 }}>
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
