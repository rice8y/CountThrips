import React from 'react';
import Box from '@mui/material/Box';
import Weather from './Weather';
import Forcast from './Forecast';

function WeatherPageContent() {
  return (
    <Box
      sx={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <h1>Weather Page</h1>
      <Weather />
    </Box>
  );
}

export default WeatherPageContent;