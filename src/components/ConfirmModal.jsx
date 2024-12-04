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

// internal imports
import AppContext from '../AppContext';

export default function ConfirmModal({ open, handleClose, handleClick, usage }) {

  return (
    <Dialog open={open}>
        <DialogTitle>
          {`Are you sure you want to ${usage === 'logout' ? 'logout' : 'delete'}?`}
        </DialogTitle>
        <Stack
          direction='row'
          justifyContent='center'
          alignItems='center'
          spacing={2}
          sx={{ my: 2 }}
        >
          <Button variant='contained' onClick={handleClick}>Yes</Button>
          <Button variant='outlined' onClick={handleClose}>Cancel</Button>
        </Stack>
      </Dialog>
  )
}

ConfirmModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleClick: PropTypes.func,
  usage: PropTypes.string,
};