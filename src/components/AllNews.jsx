// react imports
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
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

// internal imports
import AppContext from '../AppContext';
import LoginModal from './LoginModal';
import LogoutModal from './LogoutModal';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function AllNews() {

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [addNewsOpen, setAddNewsOpen] = useState(false);
  const { user } = useContext(AppContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleLogoutOpen = () => {
    setLogoutOpen(true);
  };
  const handleLogoutClose = () => {
    setLogoutOpen(false);
  };
  const handleAddNewsOpen = () => {
    setAddNewsOpen(true);
  };
  const handleAddNewsClose = () => {
    setAddNewsOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <LoginModal open={open} handleClose={handleClose}/>
      <LogoutModal open={logoutOpen} handleClose={handleLogoutClose}/>
      <Container maxWidth="false">
        <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" sx={{ my: 2 }}>
          {user?.username === null ? (
            <Button variant="outlined" onClick={handleClickOpen}>Login as admin</Button>
          ) : (
            <>
              <Button variant='outlined' onClick={handleAddNewsOpen}>Add news</Button>
              <Tooltip title='Logout'>
                <IconButton onClick={handleLogoutOpen}>
                  <LogoutIcon fontSize='small'/>
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
        <Box sx={{ width: '100%' }}>
          <Paper elevation={1} square>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="News" {...a11yProps(0)} />
              <Tab label="News Statistics" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              News
            </TabPanel>
            <TabPanel value={value} index={1}>
              News Statistics
            </TabPanel>
          </Paper>
        </Box>
      </Container>
    </>
  )
}

// AllNews.propTypes = {

// }

