import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Box } from '@mui/material';

const fallbackData = [
  { month: 'Jan', revenue: 4200, services: 28 },
  { month: 'Feb', revenue: 3800, services: 24 },
  { month: 'Mar', revenue: 5100, services: 32 },
  { month: 'Apr', revenue: 4700, services: 30 },
  { month: 'May', revenue: 5800, services: 38 },
  { month: 'Jun', revenue: 6200, services: 42 },
  { month: 'Jul', revenue: 5500, services: 35 },
  { month: 'Aug', revenue: 7100, services: 48 },
  { month: 'Sep', revenue: 6800, services: 44 },
  { month: 'Oct', revenue: 7500, services: 50 },
  { month: 'Nov', revenue: 8200, services: 54 },
  { month: 'Dec', revenue: 9100, services: 60 },
];

interface RevenueChartProps {
  data?: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(46, 125, 50, 0.2)',
          borderRadius: 2,
          p: 1.5,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Box sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>
          {label}
        </Box>
        {payload.map((entry: any, index: number) => (
          <Box key={index} sx={{ color: entry.color, fontSize: '0.8rem', py: 0.25 }}>
            {entry.name}: {entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = data || fallbackData;

  return (
    <ResponsiveContainer width="100%" height="90%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.08)" />
        <XAxis
          dataKey="month"
          stroke="#757575"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#757575" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '0.8rem', color: '#757575' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#2E7D32"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#colorRevenue)"
          dot={false}
          activeDot={{ r: 6, stroke: '#2E7D32', strokeWidth: 2, fill: '#FFFFFF' }}
        />
        <Area
          type="monotone"
          dataKey="services"
          name="Services"
          stroke="#4CAF50"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#colorServices)"
          dot={false}
          activeDot={{ r: 6, stroke: '#4CAF50', strokeWidth: 2, fill: '#FFFFFF' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
