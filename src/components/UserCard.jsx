import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Box, 
  Chip 
} from '@mui/material';
import { Comment as CommentIcon } from '@mui/icons-material';

const UserCard = ({ user, rank }) => {
  const getRandomImage = () => {
    // Generate a placeholder image URL
    return `/api/placeholder/100/100?text=${user.name.charAt(0)}`;
  };

  return (
    <Card sx={{ 
      mb: 2, 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'center', sm: 'flex-start' },
      p: 2,
      boxShadow: 3,
      borderLeft: `4px solid ${user.avatarColor || '#1976d2'}`
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: { xs: 2, sm: 0 },
        mr: { sm: 2 }
      }}>
        <Chip 
          label={`#${rank}`} 
          color="primary" 
          sx={{ 
            mr: 2, 
            fontWeight: 'bold', 
            height: 35, 
            width: 35, 
            borderRadius: '50%' 
          }} 
        />
        <Avatar 
          src={getRandomImage()} 
          sx={{ 
            width: 60, 
            height: 60, 
            bgcolor: user.avatarColor || '#1976d2' 
          }}
        >
          {user.name.charAt(0)}
        </Avatar>
      </Box>
      
      <CardContent sx={{ flex: '1 0 auto', p: { xs: 0, sm: 1 } }}>
        <Typography variant="h6" component="div">
          {user.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <CommentIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {user.commentCount} comments on posts
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;
