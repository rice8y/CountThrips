import React from 'react';
import Box from '@mui/material/Box';
import Pie from './Pie';
import Line from './Line';
import Table from './Table';

function MainPageContent() {
  return (
    <Box
      sx={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <h1>Main Dashboard</h1>
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Table />
        <Pie />
      </Box>
      <Line />
    </Box>
  );
}

export default MainPageContent;