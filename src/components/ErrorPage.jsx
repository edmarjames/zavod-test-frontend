// react imports
import React                                from 'react';

// external imports
import {
  Button,
  Container,
  Paper,
  Stack,
  Typography,
}                                           from '@mui/material';
import {
  useNavigate
}                                           from 'react-router-dom';

// internal imports
import NotFound                             from '../assets/404 error with a tired person.gif';

export default function ErrorPage() {

  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/news');
  };

  return (
    <Container maxWidth='false'>
      <Paper elevation={1} sx={{ p: 3, m: 5 }}>
        <Stack spacing={3} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <img src={NotFound} alt='404_page_not_found'/>
          <Typography variant='body1'>The page you are looking for cannot be found</Typography>
          <Button variant='outlined' onClick={() => handleReturn()}>Return</Button>
        </Stack>
      </Paper>
    </Container>
  )
}
