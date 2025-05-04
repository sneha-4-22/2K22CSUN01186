import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  Divider,
  Box
} from '@mui/material';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No comments yet
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {comments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>{comment.id.toString().charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`Comment #${comment.id}`}
              secondary={comment.content}
            />
          </ListItem>
          {index < comments.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};
export default CommentList;