import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
// import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { Box, useTheme, useMediaQuery } from '@mui/material';
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Pie from './Pie.jsx';
import Line from './Line.jsx';
import Table from './Table.jsx';
import Export from './Export.jsx';
import Weather from './Weather.jsx';

const NAVIGATION = [
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <BarChartIcon />,
    },
    {
        segment: 'history',
        title: 'History',
        icon: <HistoryIcon />
    },
    {
        segment: 'weather',
        title: 'Weather',
        icon: <ThermostatIcon />
    }
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function MainPageContent({ pathname }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: 4,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    width: '90%',
                    gap: 4,
                }}
            >
                <Box
                    sx={{
                        flexBasis: '40%',
                        flexGrow: 0,
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: isSmallScreen ? '100%' : 'auto',
                    }}
                >
                    <Table />
                </Box>
                <Box
                    sx={{
                        flexBasis: '30%',
                        flexGrow: 0,
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: isSmallScreen ? '100%' : 'auto',
                    }}
                >
                    <Pie />
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Line
                    sx={{
                        width: '100%',
                        maxWidth: '100%',
                        transform: 'scale(0.9)',
                        '@media (max-width: 768px)': {
                            transform: 'scale(0.8)',
                        },
                        '@media (max-width: 480px)': {
                            transform: 'scale(0.7)',
                        },
                    }}
                />
            </Box>
        </Box>
    );
}

function HistoryPageContent({ pathname }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: 4,
            }}
        >
            <Box
                sx={{
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Export />
            </Box>
        </Box>
    );
}

function WeatherPageContent({ pathname }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: 4,
            }}
        >
            <Box
                sx={{
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Weather />
            </Box>
        </Box>
    );
}

MainPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

HistoryPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

WeatherPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBasic(props) {
    const { window } = props;
    const router = useDemoRouter('/dashboard');
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <AppProvider
            navigation={NAVIGATION}
            branding={{
                logo: <img src="./images/ct_logo.png" alt="CT logo" />,
                title: 'CountThrips',
                // homeUrl: '/dashboard',
            }}
            router={router}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout defaultSidebarCollapsed>
                {router.pathname === '/' && <MainPageContent pathname={router.pathname} />}
                {router.pathname === '/dashboard' && <MainPageContent pathname={router.pathname} />}
                {router.pathname === '/history' && <HistoryPageContent pathname={router.pathname} />}
                {router.pathname === '/weather' && <WeatherPageContent pathname={router.pathname} />}
            </DashboardLayout>
        </AppProvider>
    );
}

DashboardLayoutBasic.propTypes = {
    window: PropTypes.func,
};

export default DashboardLayoutBasic;