import React from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Divider, Avatar } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out', maxWidth: 800 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', mb: 1 }}>Settings</Typography>
      <Typography variant="body2" sx={{ color: '#94A3B8', mb: 4 }}>Manage your account and preferences</Typography>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Avatar sx={{ width: 72, height: 72, background: 'linear-gradient(135deg, #6C63FF, #4A42DB)', fontSize: '1.5rem', fontWeight: 700 }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9' }}>{user?.username}</Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>{user?.email}</Typography>
            <Typography variant="caption" sx={{ color: '#6C63FF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.08)', my: 3 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 2 }}>Profile Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Username" defaultValue={user?.username} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" defaultValue={user?.email} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" placeholder="Enter phone number" /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Role" defaultValue={user?.role} disabled /></Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained">Save Changes</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 2 }}>Change Password</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="Current Password" type="password" /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="New Password" type="password" /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Confirm New Password" type="password" /></Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained">Update Password</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 1 }}>About</Typography>
        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <BuildCircleIcon sx={{ color: '#6C63FF' }} />
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#F1F5F9' }}>GarageHub</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#94A3B8', mt: 1 }}>
          Version 1.0.0 — Complete Garage Management System
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B', mt: 0.5, display: 'block' }}>
          Built with MERN Stack (MongoDB, Express.js, React, Node.js)
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
