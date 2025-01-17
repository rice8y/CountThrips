import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardLayoutBasic from './components/DashboardLayoutBasic';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <CssBaseline />
        <DashboardLayoutBasic />
    </React.StrictMode>
);