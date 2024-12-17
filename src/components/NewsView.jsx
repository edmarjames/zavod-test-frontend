// react imports
import React                                from 'react';

// external imports
import {
  Badge,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
}                                           from '@mui/material';
import ArrowBackIcon                        from '@mui/icons-material/ArrowBack';
import ThumbDownOffAltIcon                  from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon                    from '@mui/icons-material/ThumbUpOffAlt';
import {
  Navigate,
  useNavigate,
  useParams,
}                                           from 'react-router-dom';
import { useQuery }                         from '@tanstack/react-query';


export default function NewsView() {

  const { newsId } = useParams();
  const navigate = useNavigate();

  function fetchNewsData() {
    return fetch(`http://127.0.0.1:8000/api/news/${newsId}`)
      .then(res => res.json())
      .then(data => data.data);
  };
  function fetchLikesDislikes() {
    return fetch(`http://127.0.0.1:8000/api/news/${newsId}?filtered=true`)
      .then(res => res.json())
      .then(data => data.data);
  };
  const newsDataQuery = useQuery({
    queryKey: ['data', newsId],
    queryFn: fetchNewsData
  });
  const likesDislikesQuery = useQuery({
    queryKey: ['likesDislikes', newsId],
    queryFn: fetchLikesDislikes,
    refetchInterval: 3000
  });
  const handleBack = () => {
    navigate('/news');
  };
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const dateCreated = new Date(newsDataQuery?.data?.date_created).toLocaleDateString('en-US', options) || '';

  if (newsDataQuery?.error !== null) {
    return (
      <Navigate to='/*' />
    )
  };

  return (
    <Container maxWidth='false'>
      <Paper elevation={1} sx={{ p: 3, m: 5 }}>
        <Stack
          direction='row'
          sx={{
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button variant='outlined' onClick={handleBack}>
            <ArrowBackIcon fontSize='small'/>
            back
          </Button>
        </Stack>
        <Stack spacing={3} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant='h3'>{newsDataQuery?.data?.title}</Typography>
          <Box sx={{ width: '100%', maxWidth: '1500px' }}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
              }}
              src={newsDataQuery?.data?.image}
              alt={newsDataQuery?.data?.title}
            />
          </Box>
          <Box sx={{ width: '85%' }}>
            <Typography variant='body1'>{newsDataQuery?.data?.text}</Typography>
          </Box>
          <Stack
            direction='row'
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant='body2'>Published: {dateCreated}</Typography>
            <Stack direction='row' spacing={2}>
              <Badge
                badgeContent={likesDislikesQuery?.data?.likes}
                color='info'
                showZero
              >
                <ThumbUpOffAltIcon/>
              </Badge>
              <Badge
                badgeContent={likesDislikesQuery?.data?.dislikes}
                color='info'
                showZero
              >
                <ThumbDownOffAltIcon/>
              </Badge>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
};
