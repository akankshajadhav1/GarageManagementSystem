import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';

const data = [
  { name: 'Pending', value: 2, color: '#ED6C02' },
  { name: 'Diagnosing', value: 2, color: '#0288D1' },
  { name: 'In Progress', value: 2, color: '#4CAF50' },
  { name: 'Waiting Parts', value: 1, color: '#D32F2F' },
  { name: 'Completed', value: 3, color: '#2E7D32' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 2,
          p: 1.5,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Typography variant="body2" sx={{ color: payload[0].payload.color, fontWeight: 700 }}>
          {payload[0].payload.name}: {payload[0].value}
        </Typography>
      </Box>
    );
  }
  return null;
};

const ServiceStatusChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 5,
        }}
        barSize={60}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.06)" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#757575"
          tickLine={false}
          axisLine={false}
          fontSize={13}
          dy={10}
        />
        <YAxis
          stroke="#757575"
          tickLine={false}
          axisLine={false}
          fontSize={13}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ServiceStatusChart;
