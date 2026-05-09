import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import ServiceStatusChart from '../components/dashboard/ServiceStatusChart';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Customers',
      value: '1,254',
      icon: <PeopleIcon fontSize="large" />,
      color: '#2E7D32',
      trend: '+12% this month',
    },
    {
      title: 'Active Vehicles',
      value: '324',
      icon: <DirectionsCarIcon fontSize="large" />,
      color: '#4CAF50',
      trend: '+5% this month',
    },
    {
      title: 'Service Requests',
      value: '48',
      icon: <BuildIcon fontSize="large" />,
      color: '#ED6C02',
      trend: '+8% this week',
    },
    {
      title: 'Monthly Revenue',
      value: '$24,580',
      icon: <AttachMoneyIcon fontSize="large" />,
      color: '#1B5E20',
      trend: '+18% vs last month',
    },
  ];

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
          Welcome back, {user?.username || 'Admin'} 👋
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Here's what's happening in your garage today
        </Typography>
      </Box>

      {/* Row 1: 4 Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3, mt: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box sx={{ animation: `fadeIn 0.4s ease-out ${index * 0.1}s both` }}>
              <StatsCard {...stat} />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Row 2: Revenue Overview + Recent Activity + Service Status all 3 in one line */}
      <Grid container spacing={3}>
        {/* Revenue Overview */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              height: 420,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              animation: 'fadeIn 0.4s ease-out 0.4s both',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
              Revenue Overview
            </Typography>
            <RevenueChart />
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              height: 420,
              overflowY: 'auto',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              animation: 'fadeIn 0.4s ease-out 0.5s both',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
              Recent Activity
            </Typography>
            <RecentActivity />
          </Paper>
        </Grid>

        {/* Service Status */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              height: 420,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              animation: 'fadeIn 0.4s ease-out 0.6s both',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
              Service Status
            </Typography>
            <ServiceStatusChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
