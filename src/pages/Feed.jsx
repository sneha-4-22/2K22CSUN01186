import React, { useContext, useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Button, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { DataContext } from '../context/DataContext';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorHandler from '../components/ErrorHandler';

const Feed = () => {
  const { 
    allPosts, 
    postsWithComments, 
    users, 
    loading, 
    error, 
    usingMockData, 
    refreshData 
  } = useContext(DataContext);
  
  const [displayPosts, setDisplayPosts] = useState([]);
  const [userFilter, setUserFilter] = useState('all');

  // Update displayed posts when all posts or filter changes
  useEffect(() => {
    if (postsWithComments.length > 0) {
      let filteredPosts = [...postsWithComments];
      
      // Apply user filter if set
      if (userFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.userid === userFilter);
      }
      
      // Sort by ID (assuming higher ID means newer)
      filteredPosts.sort((a, b) => b.id - a.id);
      
      setDisplayPosts(filteredPosts);
    }
  }, [postsWithComments, userFilter]);

  const handleUserFilterChange = (event) => {
    setUserFilter(event.target.value);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Social Media Feed
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
          Real-time posts with newest at the top
        </Typography>
        
        {/* Error handler */}
        {error && (
          <ErrorHandler 
            error={error} 
            onRetry={refreshData} 
          />
        )}

        {/* Mock data notification */}
        {usingMockData && !error && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            icon={<InfoIcon />}
          >
            Currently displaying demo data due to API connection issues. Some features may be limited.
          </Alert>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 3,
          gap: 2
        }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="user-filter-label">Filter by User</InputLabel>
            <Select
              labelId="user-filter-label"
              id="user-filter"
              value={userFilter}
              label="Filter by User"
              onChange={handleUserFilterChange}
            >
              <MenuItem value="all">All Users</MenuItem>
              {Object.entries(users).map(([id, name]) => (
                <MenuItem key={id} value={id}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box>
            {usingMockData && (
              <Chip 
                label="Demo Mode" 
                color="warning" 
                size="small" 
                sx={{ mr: 1 }} 
              />
            )}
            <Button 
              startIcon={<RefreshIcon />} 
              onClick={refreshData}
              variant="outlined"
            >
              Refresh Feed
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {displayPosts.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">No posts available yet.</Alert>
            </Grid>
          ) : (
            displayPosts.map(post => (
              <Grid item xs={12} md={6} lg={4} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};


export default Feed;