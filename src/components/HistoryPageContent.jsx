import React from 'react';
import Box from '@mui/material/Box';
import Export from './Export';

function HistoryPageContent() {
  return (
    <Box
      sx={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <h1>History Page</h1>
      <Export />
    </Box>
  );
}

export default HistoryPageContent;