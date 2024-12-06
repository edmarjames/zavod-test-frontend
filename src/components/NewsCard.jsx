// react imports
import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

// external imports
import {
  AppBar,
  Avatar,
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
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { lightBlue, red } from '@mui/material/colors';
import {
  NavLink,
  Link
}     from 'react-router-dom';

// internal imports
import AppContext from '../AppContext';

export default function NewsCard({ newsData, handleDeleteNewsOpen }) {

  const { user } = useContext(AppContext);

  return (
    <div>
      <Card sx={{ maxWidth: 600, minHeight: 400 }}>
        <CardMedia
          sx={{ height: 200 }}
          image={newsData?.image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {newsData?.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`${newsData?.text.slice(0 , 95)}...`}
          </Typography>
          {newsData?.tags?.length > 0 ? (
            <Stack direction='row' spacing={1} sx={{ my: 1 }}>
              {newsData?.tags?.map((tags, index) => (
                <Chip
                  key={index}
                  label={tags}
                  color='info'
                  variant='outlined'
                  avatar={
                    <Avatar sx={{ bgcolor: lightBlue[100] }}>
                      {tags.charAt(0)}
                    </Avatar>
                  }
                />
              ))}
            </Stack>
          ) : (
              <Typography variant='caption'>No tags defined.</Typography>
          )}
        </CardContent>
        {user?.isAdmin && (
          <CardActions>
              <Button
                variant='contained'
                fullWidth
                sx={{ bgcolor: red[400]}}
                onClick={() => handleDeleteNewsOpen(newsData?.id)}
              >
                <Stack direction='row' alignContent='center'>
                  <DeleteOutlineIcon fontSize='small'/>
                  Delete
                </Stack>
              </Button>
            {/* <Button size="small">Share</Button>
            <Button size="small">Learn More</Button> */}
          </CardActions>
        )}
        {!user?.isAdmin && (
          <Stack direction='row' spacing={1} sx={{ justifyContent: 'center', alignItems: 'center'}}>
            <IconButton>
              <ThumbUpOffAltIcon/>
            </IconButton>
            <IconButton>
              <ThumbDownOffAltIcon/>
            </IconButton>
            <MuiLink as={NavLink} to={`/news/${newsData?.id}`} underline='hover'>Read more</MuiLink>
          </Stack>
        )}
      </Card>
    </div>
  )
}

NewsCard.propTypes = {
  newsData: PropTypes.object,
  handleDeleteNewsOpen: PropTypes.func,
};

