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
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import { blue } from '@mui/material/colors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


const columns = [
  {
    field: 'id',
    headerName: 'ID',
    type: 'number',
    flex: 1,
    resizable: false,
    headerAlign: 'left',
    align: 'left'
  },
  {
    field: 'title',
    headerName: 'Title',
    type: 'string',
    flex: 1,
    resizable: false,
    headerAlign: 'left',
    align: 'left'
  },
  {
    field: 'date_created',
    headerName: 'Date created',
    type: 'datetime',
    flex: 1,
    resizable: false,
    headerAlign: 'left',
    align: 'left'
  },
  {
    field: 'likes',
    headerName: 'Likes',
    type: 'number',
    flex: 1,
    resizable: false,
    headerAlign: 'left',
    align: 'left'
  },
  {
    field: 'dislikes',
    headerName: 'Dislikes',
    type: 'number',
    flex: 1,
    resizable: false,
    headerAlign: 'left',
    align: 'left'
  },
  {
    field: 'views',
    headerName: 'Views',
    type: 'number',
    flex: 1,
    resizable: false,
    headerAlign: 'left',
    align: 'left'
  },
];

export default function StatisticsDashboard() {

  const [xLabels, setXLabels] = useState([]);
  const [yViewsCount, setYViewsCount] = useState([]);
  const [yNewsCount, setYNewsCount] = useState([]);
  const [newsStats, setNewsStats] = useState([]);

  function getStatistics() {
    return fetch('http://127.0.0.1:8000/api/news/statistics/')
      .then(res => res.json())
      // .then(data => data?.data || []);
  };

  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: getStatistics
  });

  const newsPerTagStats = statsQuery?.data?.news_per_tag || {};
  const newsStatsHolder = statsQuery?.data?.news_stats || {};
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  useEffect(() => {
    if (Object.keys(newsPerTagStats)?.length > 0) {
      const xLabels = Object?.keys(newsPerTagStats) || [];
      const yViewsCount = Object?.values(newsPerTagStats)
        .map(tag => tag?.views_count) || [];
      const yNewsCount = Object?.values(newsPerTagStats)
        .map(tag => tag?.news_count) || [];

      setXLabels(xLabels);
      setYViewsCount(yViewsCount);
      setYNewsCount(yNewsCount);
    }
  }, [newsPerTagStats]);

  useEffect(() => {
    if (Object.keys(newsStatsHolder)?.length > 0) {
      const filteredData = newsStatsHolder.map(data => {
        return {
          id: data.id,
          title: data.title,
          likes: data.likes,
          dislikes: data.dislikes,
          views: data.views_count,
          date_created: new Date(data.date_created).toLocaleDateString('en-US', options),
        }
      });
      setNewsStats(filteredData);
      console.log(filteredData);
      // console.log(newsStatsHolder);
    };
  }, [newsStatsHolder]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={5}>
          <Box sx={{ width: '100%',  height: '400px', p: 3, bgcolor: blue[500] }}>
            <Typography variant='button' color='#fff'>
              News count
            </Typography>
            <Stack
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Typography variant='h1' color='#fff'>
                {statsQuery?.data?.total_count?.total_count}
              </Typography>
            </Stack>
          </Box>
        </Grid>
        <Grid size={7}>
          <Paper elevation={1}>
          {xLabels && yNewsCount && yViewsCount && (
            <Box sx={{ width: '100%', height: '400px' }}>
              <BarChart
                series={[
                  { data: yNewsCount, label: 'count', id: 'countId' },
                  { data: yViewsCount, label: 'views', id: 'viewId' },
                ]}
                xAxis={[{ data: xLabels, scaleType: 'band' }]}
                skipAnimation
              />
            </Box>
          )}
          </Paper>
        </Grid>
        <Grid size={12}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={newsStats}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
              sortingOrder={['asc', 'desc']}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

// StatisticsDashboard.propTypes = {

// }

