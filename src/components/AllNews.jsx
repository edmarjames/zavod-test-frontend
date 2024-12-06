// react imports
import React, { useState, useContext, useEffect, useRef } from 'react'
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
import { useInfiniteQuery, useQueryClient, useQuery, useMutation } from '@tanstack/react-query';

// internal imports
import AppContext from '../AppContext';
import LoginModal from './LoginModal';
import ConfirmModal from './ConfirmModal';
import AddNewsModal from './AddNewsModal';
import NewsCard from './NewsCard';
import TagsSelect from './TagsSelect';
import StatisticsDashboard from './StatisticsDashboard';


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
  const [tagsFilter, setTagsFilter] = useState([]);
  const queryClient = useQueryClient();

  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    console.log(newValue);
    if (newValue === 0) {
      queryClient.setQueryData(['news', 'infinite', tagsFilter], {
        pages: [],
        pageParams: [],
      });

      queryClient.invalidateQueries(['news', 'infinite', tagsFilter], { exact: true });
    }
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
  function handleChangeTag(e) {
    const {
      target: { value },
    } = e;
    setTagsFilter(value);
  };
  // function fetchNews() {
  //   fetch('http://127.0.0.1:8000/api/news/')
  //   .then(res => res.json())
  //   .then(data => {
  //     if (data?.data?.length > 0) {
  //       const allNews = data?.data?.map(news => news);
  //       setAllNews(allNews);
  //     };
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });
  // };

  function fetchNews({ pageParam = 1, tags = [] }) {
    const tagsQuery = tags?.length > 0 ? tags.map(tag => `&tags=${tag}`).join('') : '';
    return fetch(`http://127.0.0.1:8000/api/news/?page=${pageParam}&page_size=3${tagsQuery}`)
      .then(res => res.json())
  };

  // function deleteNews(deleteId) {
  //   fetch(`http://127.0.0.1:8000/api/news/${deleteId}`, {
  //     method: 'DELETE'
  //   })
  //   .then(res => {
  //     if (res.ok) {
  //       console.log(res);
  //       handleDeleteNewsClose();
  //       fetchNews();
  //     }
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });
  // };

  // Mutation for deleting news
  const deleteNewsMutation = useMutation({
    mutationFn: (deleteId) =>
      fetch(`http://127.0.0.1:8000/api/news/${deleteId}`, {
        method: 'DELETE',
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete news');
        }
        // return res.json();
      }),
    onSuccess: (_, deleteId) => {
      console.log(`News with ID ${deleteId} deleted successfully`);
      handleDeleteNewsClose(); // Close the delete modal

      // Update the query data manually
      queryClient.setQueryData(['news', 'infinite', tagsFilter], (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.filter((news) => news.id !== deleteId), // Exclude the deleted news
          })),
        };
      });

      // queryClient.setQueryData(['news', 'infinite'], {
      //   pages: [], // Reset pages to an empty array
      //   pageParams: [],
      // });

      // queryClient.invalidateQueries({
      //   queryKey: ['news', 'infinite', tagsFilter],
      //   exact: true,
      // });

      queryClient.invalidateQueries(['news', 'infinite', tagsFilter], { exact: true });

    },
    onError: (error) => {
      console.error('Error deleting news:', error);
    },
  });

  const handleDelete = (deleteId) => {
    deleteNewsMutation.mutate(deleteId);
  };


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['news', 'infinite', tagsFilter],
    getNextPageParam: (lastPage) => {
      const nextPage = Number(lastPage.page) + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    queryFn: ({ pageParam }) => fetchNews({ pageParam, tags: tagsFilter }),
  });

  const observerRef = useRef();
  const flattenedNews = data?.pages.flatMap((page) => page.data) || [];

  // useEffect(() => {
  //   fetchNews();
  // }, []);
  useEffect(() => {
    console.log('RUNNING HERE');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 } // Trigger when the element is fully in view
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  useEffect(() => {
    console.log(allNews);
  }, [allNews]);
  useEffect(() => {
    console.log(deleteId);
  }, [deleteId]);
  useEffect(() => {
    console.log(tagsFilter);
  }, [tagsFilter]);

  return (
    <>
      <CssBaseline />
      <LoginModal open={open} handleClose={handleClose}/>
      <AddNewsModal
        open={addNewsOpen}
        handleClose={handleAddNewsClose}
        tagsFilter={tagsFilter}
      />
      <ConfirmModal
        open={logoutOpen || deleteNewsOpen}
        handleClose={logoutOpen ? handleLogoutClose : handleDeleteNewsClose}
        handleClick={logoutOpen ? handleLogout : () => handleDelete(deleteId)}
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
          <Paper elevation={1}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="News" {...a11yProps(0)} />
              <Tab label="News Statistics" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <TagsSelect tags={tagsFilter} handleChangeTag={handleChangeTag}/>
              {/* {allNews?.length > 0 ? (
                <Grid container spacing={3}>
                  {allNews.map(news => (
                    <Grid size={4}>
                      <NewsCard key={news.id} newsData={news} handleDeleteNewsOpen={handleDeleteNewsOpen}/>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <div>No news yet.</div>
              )} */}
              <Grid container spacing={3}>
                {flattenedNews?.map((news) => (
                  <Grid size={4}>
                    <NewsCard key={news.id} newsData={news} handleDeleteNewsOpen={handleDeleteNewsOpen}/>
                  </Grid>
                ))}
              </Grid>
              <div
                ref={observerRef}
                style={{
                  height: '1px',
                  margin: '20px 0',
                  backgroundColor: 'transparent',
                }}
              >
                {/* This is the "observer div" */}
              </div>
              {isFetchingNextPage && (
                <Stack direction='row' justifyContent='center'>
                  <Typography variant='h6'>Loading more news...</Typography>
                </Stack>
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              <StatisticsDashboard/>
            </TabPanel>
          </Paper>
        </Box>
      </Container>
    </>
  )
}

// AllNews.propTypes = {

// }

