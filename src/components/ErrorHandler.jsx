import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  Button, 
  Box, 
  Paper, 
  Typography,
  Divider
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon 
} from '@mui/icons-material';

const ErrorHandler = ({ 
  error, 
  onRetry, 
  title = "Connection Error", 
  showDetails = false 
}) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mt: 3, 
        mb: 3, 
        maxWidth: 600, 
        mx: 'auto',
        border: '1px solid #f5c6cb'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <ErrorIcon color="error" sx={{ fontSize: 38, mr: 2 }} />
        <Box>
          <Typography variant="h5" component="h2" color="error" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            We're having trouble connecting to our servers. The application will use demo data until the connection is restored.
          </Typography>
        </Box>
      </Box>

      {showDetails && (
        <>
          <Divider sx={{ my: 2 }} />
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Technical Details</AlertTitle>
            {error}
          </Alert>
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          startIcon={<RefreshIcon />} 
          variant="contained" 
          color="primary" 
          onClick={onRetry}
        >
          Try Again
        </Button>
      </Box>
    </Paper>
  );
};

export default ErrorHandler;