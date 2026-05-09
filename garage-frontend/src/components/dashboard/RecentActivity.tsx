import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Box, Chip, alpha } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';

const activities = [
  {
    type: 'service',
    text: 'Oil change completed',
    detail: 'Toyota Camry - ABC-1234',
    time: '2 hours ago',
    icon: <CheckCircleIcon />,
    color: '#2E7D32',
  },
  {
    type: 'service',
    text: 'New service request',
    detail: 'BMW 3 Series - Brake inspection',
    time: '4 hours ago',
    icon: <BuildIcon />,
    color: '#0288D1',
  },
  {
    type: 'customer',
    text: 'New customer added',
    detail: 'Fiona Davis',
    time: '5 hours ago',
    icon: <PersonAddIcon />,
    color: '#4CAF50',
  },
  {
    type: 'service',
    text: 'Waiting for parts',
    detail: 'Tesla Model 3 - Battery check',
    time: '8 hours ago',
    icon: <ScheduleIcon />,
    color: '#ED6C02',
  },
  {
    type: 'service',
    text: 'Transmission fluid changed',
    detail: 'Mercedes C-Class - STU-3344',
    time: '1 day ago',
    icon: <CheckCircleIcon />,
    color: '#2E7D32',
  },
  {
    type: 'customer',
    text: 'New customer added',
    detail: 'Edward Garcia',
    time: '2 days ago',
    icon: <PersonAddIcon />,
    color: '#4CAF50',
  },
];

const RecentActivity: React.FC = () => {
  return (
    <List sx={{ py: 0 }}>
      {activities.map((activity, index) => (
        <ListItem
          key={index}
          sx={{
            px: 0,
            py: 1.5,
            borderBottom: index < activities.length - 1 ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Box
              sx={{
                p: 0.75,
                borderRadius: 1.5,
                backgroundColor: alpha(activity.color, 0.12),
                color: activity.color,
                display: 'flex',
                alignItems: 'center',
                '& svg': { fontSize: 18 },
              }}
            >
              {activity.icon}
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.82rem' }}>
                {activity.text}
              </Typography>
            }
            secondary={
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {activity.detail}
                </Typography>
                <Typography variant="caption" display="block" sx={{ color: 'text.disabled', mt: 0.25 }}>
                  {activity.time}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RecentActivity;
