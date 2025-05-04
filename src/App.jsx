import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import DataProvider from './context/DataContext';

// Components
import Navbar from './components/Navbar';

// Pages
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <Router>
          <Navbar />
          <Box component="main" sx={{ pt: 2, pb: 4 }}>
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/top-users" element={<TopUsers />} />
              <Route path="/trending" element={<TrendingPosts />} />
            </Routes>
          </Box>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
