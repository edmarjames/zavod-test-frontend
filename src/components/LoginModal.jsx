// react imports
import React, {
  useContext,
  useState,
}                                           from 'react';
import PropTypes                            from 'prop-types';

// external imports
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
}                                           from '@mui/material';

// internal imports
import AppContext                           from '../AppContext';


export default function LoginModal({ open, handleClose }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AppContext);

  function handleCloseModal() {
    handleClose();
    setError();
    resetStates();
  };
  function resetStates() {
    setUsername('');
    setPassword('');
  };
  function handleChangeUsername(e) {
    setUsername(e.target.value);
  };
  function handleChangePassword(e) {
    setPassword(e.target.value);
  };
  function handleSubmit() {
    fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data?.message == 'Login successful') {
        setUser({
          username: username,
          isAdmin: true
        });
        localStorage.setItem('username', username);
        localStorage.setItem('isAdmin', true);
        handleClose();
        resetStates();
      } else if (data?.error) {
        setError(data?.error);
        resetStates();
      };
    })
  };

  return (
    <Dialog
        open={open}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleSubmit();
          },
        }}
      >
        <DialogTitle sx={{ mx: 1 }}>Login as admin</DialogTitle>
        {error && <Typography variant='body2' color='error' sx={{ mx: 4 }}>{error}</Typography>}
        <DialogContent>
          <TextField
            autoFocus
            required
            margin='dense'
            id='username'
            name='username'
            label='Username'
            type='text'
            fullWidth
            variant='outlined'
            onChange={(e) => handleChangeUsername(e)}
            value={username}
          />
          <TextField
            autoFocus
            required
            margin='dense'
            id='password'
            name='password'
            label='Password'
            type='password'
            fullWidth
            variant='outlined'
            onChange={(e) => handleChangePassword(e)}
            value={password}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='contained' type='submit'>Login</Button>
          <Button variant='outlined' onClick={handleCloseModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
  )
};

LoginModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

