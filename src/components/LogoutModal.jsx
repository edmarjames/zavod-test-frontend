import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

// external imports
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import {
  useNavigate
}     from 'react-router-dom';

// internal imports
import AppContext from '../AppContext';

export default function LogoutModal({ open, handleClose }) {

  const navigate = useNavigate();

  function handleLogout() {
    navigate('/logout');
  };

  return (
    <Dialog open={open}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <Stack
          direction='row'
          justifyContent='center'
          alignItems='center'
          spacing={2}
          sx={{ my: 2 }}
        >
          <Button variant='outlined' onClick={handleLogout}>Yes</Button>
          <Button variant='outlined' onClick={handleClose}>Cancel</Button>
        </Stack>
      </Dialog>
  )
}

LogoutModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};