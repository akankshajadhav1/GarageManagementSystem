import React from 'react';
import { Paper, Typography, Box, alpha } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        border: `1px solid rgba(0,0,0,0.02)`,
        boxShadow: '0 10px 30px 0 rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: `0 16px 40px 0 rgba(46, 125, 50, 0.12)`,
          borderColor: `rgba(46, 125, 50, 0.2)`,
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              fontSize: { xs: '1.75rem', sm: '2rem' },
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          {trend && (
            <Box display="flex" alignItems="center" mt={1} gap={0.5}>
              <TrendingUpIcon sx={{ fontSize: 16, color: '#2E7D32' }} />
              <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: alpha(color, 0.12),
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsCard;
