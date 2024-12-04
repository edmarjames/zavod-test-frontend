// react imports
import React, { useState, useContext, useEffect } from 'react'
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
import Grid from '@mui/material/Grid2';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  useNavigate
}     from 'react-router-dom';

// internal imports
import AppContext from '../AppContext';
import LoginModal from './LoginModal';
import ConfirmModal from './ConfirmModal';
import AddNewsModal from './AddNewsModal';
import NewsCard from './NewsCard';


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
  const [deleteNewsOpen, setDeleteNewsOpen] = useState(false);
  const [modalUsage, setModalUsage] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [allNews, setAllNews] = useState([]);

  const { user } = useContext(AppContext);
  const navigate = useNavigate();

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
    setModalUsage('logout');
  };
  const handleLogoutClose = () => {
    setLogoutOpen(false);
    setModalUsage('');
  };
  const handleAddNewsOpen = () => {
    setAddNewsOpen(true);
  };
  const handleAddNewsClose = () => {
    setAddNewsOpen(false);
  };
  const handleDeleteNewsOpen = (deleteId) => {
    setDeleteNewsOpen(true);
    setModalUsage('delete');
    setDeleteId(deleteId);
  };
  const handleDeleteNewsClose = () => {
    setDeleteNewsOpen(false);
    setModalUsage('');
    setDeleteId(null);
  };
  function handleLogout() {
    navigate('/logout');
  };
  function fetchNews() {
    fetch('http://127.0.0.1:8000/api/news/')
    .then(res => res.json())
    .then(data => {
      if (data?.data?.length > 0) {
        const allNews = data?.data?.map(news => news);
        setAllNews(allNews);
      };
    })
    .catch(error => {
      console.error(error);
    });
  };
  function deleteNews(deleteId) {
    fetch(`http://127.0.0.1:8000/api/news/${deleteId}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (res.ok) {
        console.log(res);
        handleDeleteNewsClose();
        fetchNews();
      }
    })
    .catch(error => {
      console.error(error);
    });
  };

  useEffect(() => {
    fetchNews();
  }, []);
  useEffect(() => {
    console.log(allNews);
  }, [allNews]);
  useEffect(() => {
    console.log(deleteId);
  }, [deleteId]);

  return (
    <>
      <CssBaseline />
      <LoginModal open={open} handleClose={handleClose}/>
      <AddNewsModal
        open={addNewsOpen}
        handleClose={handleAddNewsClose}
        refetch={fetchNews}
      />
      <ConfirmModal
        open={logoutOpen || deleteNewsOpen}
        handleClose={logoutOpen ? handleLogoutClose : handleDeleteNewsClose}
        handleClick={logoutOpen ? handleLogout : () => deleteNews(deleteId)}
        usage={modalUsage}
      />
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
              {allNews?.length > 0 ? (
                <Grid container spacing={3}>
                  {allNews.map(news => (
                    <Grid size={4}>
                      <NewsCard key={news.id} newsData={news} handleDeleteNewsOpen={handleDeleteNewsOpen}/>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <div>No news yet.</div>
              )}

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

