import React, { useEffect } from 'react'

// external imports
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link as MuiLink,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
  NavLink,
  Link,
  useParams,
  useNavigate,
}     from 'react-router-dom';
import { useInfiniteQuery, useQueryClient, useQuery, useMutation } from '@tanstack/react-query';


export default function NewsView() {

  const { newsId } = useParams();
  const navigate = useNavigate();

  function fetchNewsData() {
    return fetch(`http://127.0.0.1:8000/api/news/${newsId}`)
      .then(res => res.json())
      .then(data => data.data);
  };
  const newsDataQuery = useQuery({
    queryKey: ['data'],
    queryFn: fetchNewsData,
    refetchInterval: 3000
  });
  const handleBack = () => {
    navigate('/news');
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  const dateCreated = new Date(newsDataQuery?.data?.date_created).toLocaleDateString('en-US', options) || '';

  return (
    <Container maxWidth="false">
      <Paper elevation={1} sx={{ p: 3, m: 5 }}>
        <Stack
          direction='row'
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button variant='outlined' onClick={handleBack}>
            <ArrowBackIcon fontSize='small'/>
            back
          </Button>
        </Stack>
        <Stack spacing={3} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant='h3'>{newsDataQuery?.data?.title}</Typography>
          <img src={newsDataQuery?.data?.image} alt={newsDataQuery?.data?.title}/>
          <Box sx={{ width: '85%' }}>
            <Typography variant='body1'>{newsDataQuery?.data?.text}</Typography>
          </Box>
          <Stack
            direction='row'
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              width: '100%',
            }}
          >
            <Typography variant='body2'>Published: {dateCreated}</Typography>
            <Stack direction='row' spacing={2}>
              <Badge
                badgeContent={newsDataQuery?.data?.likes}
                color='info'
                showZero
              >
                <ThumbUpOffAltIcon/>
              </Badge>
              <Badge
                badgeContent={newsDataQuery?.data?.dislikes}
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
}
