import React, { useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Button, 
  Grid 
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { DataContext } from '../context/DataContext';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';

const TrendingPosts = () => {
  const { trendingPosts, loading, error, refreshData } = useContext(DataContext);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
        <Button 
          startIcon={<RefreshIcon />} 
          variant="contained" 
          onClick={refreshData}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Trending Posts
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
          Posts with the maximum number of comments
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            startIcon={<RefreshIcon />} 
            onClick={refreshData}
            size="small"
          >
            Refresh Data
          </Button>
        </Box>

        <Grid container spacing={3}>
          {trendingPosts.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">No trending posts available yet.</Alert>
            </Grid>
          ) : (
            trendingPosts.map(post => (
              <Grid item xs={12} md={6} key={post.id}>
                <PostCard post={post} showComments={true} />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};


export default TrendingPosts;