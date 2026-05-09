import React from 'react';
import { Chip, alpha } from '@mui/material';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: '#FFB020', label: 'Pending' },
  diagnosing: { color: '#6C63FF', label: 'Diagnosing' },
  waiting_parts: { color: '#FF4C6A', label: 'Waiting Parts' },
  in_progress: { color: '#00D9FF', label: 'In Progress' },
  completed: { color: '#14B8A6', label: 'Completed' },
  cancelled: { color: '#64748B', label: 'Cancelled' },
  low: { color: '#14B8A6', label: 'Low' },
  medium: { color: '#FFB020', label: 'Medium' },
  high: { color: '#FF4C6A', label: 'High' },
  urgent: { color: '#FF1744', label: 'Urgent' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const config = statusConfig[status] || { color: '#64748B', label: status };

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        backgroundColor: alpha(config.color, 0.12),
        color: config.color,
        fontWeight: 700,
        fontSize: '0.7rem',
        letterSpacing: '0.03em',
        border: `1px solid ${alpha(config.color, 0.2)}`,
      }}
    />
  );
};

export default StatusBadge;
