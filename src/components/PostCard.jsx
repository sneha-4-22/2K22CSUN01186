import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Avatar, 
  Typography, 
  IconButton, 
  Box, 
  Collapse, 
  Divider, 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import { 
  Comment as CommentIcon, 
  ExpandMore as ExpandMoreIcon, 
  ExpandLess as ExpandLessIcon 
} from '@mui/icons-material';

const PostCard = ({ post, showComments = false }) => {
  const [expanded, setExpanded] = useState(showComments);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Generate a random color for the post image
  const getRandomColor = () => {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
  };

  // Generate a random placeholder image
  const getRandomImage = (width = 400, height = 200) => {
    const imageKeywords = [
      'nature', 'city', 'technology', 'abstract', 
      'animals', 'food', 'travel', 'business'
    ];
    const keyword = imageKeywords[Math.floor(Math.random() * imageKeywords.length)];
    return `/api/placeholder/${width}/${height}?text=${keyword}`;
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: getRandomColor() }}>
            {post.username ? post.username.charAt(0) : 'U'}
          </Avatar>
        }
        title={post.username || `User ${post.userid}`}
        subheader={`Post ID: ${post.id}`}
      />
      
      <Box sx={{ 
        height: 200, 
        bgcolor: getRandomColor(), 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${getRandomImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      </Box>
      
      <CardContent>
        <Typography variant="body1">
          {post.content}
        </Typography>
      </CardContent>
      
      <CardActions disableSpacing>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <CommentIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">
            {post.commentsCount || 0} comments
          </Typography>
        </Box>
        
        {post.comments && post.comments.length > 0 && (
          <IconButton 
            onClick={toggleExpanded}
            sx={{ ml: 'auto' }}
            aria-expanded={expanded}
            aria-label="show comments"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </CardActions>
      
      {post.comments && post.comments.length > 0 && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Comments
            </Typography>
            <List>
              {post.comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getRandomColor() }}>
                      C
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Comment #${comment.id}`}
                    secondary={comment.content}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Collapse>
      )}
    </Card>
  );
};

export default PostCard;