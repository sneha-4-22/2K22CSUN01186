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
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';

const TopUsers = () => {
  const { topUsers, loading, error, refreshData } = useContext(DataContext);

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
          Top Users
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
          Users with the most commented posts
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

        <Grid container spacing={2}>
          <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
            {topUsers.length === 0 ? (
              <Alert severity="info">No user data available yet.</Alert>
            ) : (
              topUsers.map((user, index) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  rank={index + 1} 
                />
              ))
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};


export default TopUsers;