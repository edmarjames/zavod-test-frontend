// react imports
import React, {
  useState
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
import { red }                              from '@mui/material/colors';
import {
  useMutation,
  useQueryClient,
}                                           from '@tanstack/react-query';

// internal imports
import TagsSelect                           from './TagsSelect';

export default function AddNewsModal({ open, handleClose, tagsFilter }) {

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const queryClient = useQueryClient();

  function handleChangeTitle(e) {
    setTitle(e.target.value);
  };
  function handleChangeText(e) {
    setText(e.target.value);
  };
  function handleCloseModal() {
    resetStates();
    handleClose();
  };
  function resetStates() {
    setTitle('');
    setText('');
    setTags([]);
    setImage(null);
    setImageName('');
  };
  function handleChangeTag(e) {
    const {
      target: { value },
    } = e;
    setTags(value);
  };
  function onFileChange(e) {
    const file = e.target.files[0];
    const fileName = file?.name;
    setImage(file);
    setImageName(fileName);
  };
  const createNews = async (formData) => {
    const response = await fetch('http://127.0.0.1:8000/api/news/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create news');
    }

    return response.json();
  };
  const createNewsMutation = useMutation({
    mutationFn: createNews,
    onSuccess: (data) => {
      if (data?.message === 'News created successfully') {
        resetStates();
        handleClose();

        queryClient.setQueryData(['news', 'infinite', tagsFilter], (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  data: [data.data, ...page.data],
                };
              }
              return page;
            }),
          };
        });

        queryClient.invalidateQueries(['news', 'infinite', tagsFilter], { exact: true });
      }
    },
    onError: (error) => {
      console.error('Error creating news:', error);
    },
  });
  function handleFormSubmit() {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    formData.append('image', image);
    tags.forEach((tag) => formData.append('tags', tag));

    createNewsMutation.mutate(formData);
  };

  return (
    <Dialog
        open={open}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            if (image && imageName) {
              handleFormSubmit();
            } else {
              alert('No image selected!');
            }
          },
        }}
      >
        <DialogTitle sx={{ mx: 1 }}>Create news</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin='dense'
            id='title'
            name='title'
            label='title'
            type='text'
            fullWidth
            variant='outlined'
            onChange={(e) => handleChangeTitle(e)}
            value={title}
          />
          <TextField
            required
            margin='dense'
            id='text'
            name='text'
            label='text'
            type='text'
            fullWidth
            multiline
            maxRows={10}
            minRows={5}
            variant='outlined'
            onChange={(e) => handleChangeText(e)}
            value={text}
          />
          <TagsSelect tags={tags} handleChangeTag={handleChangeTag}/>
          <Button variant='outlined' component='label' fullWidth sx={{ my: 1}}>
            Select image
            <input
              id='image'
              name='image'
              type='file'
              accept='image/*'
              hidden
              onChange={onFileChange}
            />
          </Button>
          <Typography
            variant={(!image && !imageName) ? 'body2' : 'caption'}
            sx={{ ml: 1, color: (!image && !imageName) && red[900] }}
          >
            {image && imageName ? imageName : 'Image is required *'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' type='submit'>
            {createNewsMutation?.isLoading ? 'Saving..' : 'Save'}
          </Button>
          <Button variant='outlined' onClick={handleCloseModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
  )
};

AddNewsModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  tagsFilter: PropTypes.array,
};

