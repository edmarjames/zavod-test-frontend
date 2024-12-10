// react imports
import React                                from 'react';
import PropTypes                            from 'prop-types';

// external imports
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
}                                           from '@mui/material';
import { useQuery }                         from '@tanstack/react-query';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function TagsSelect({ tags, handleChangeTag }) {

  function getTags() {
    return fetch('http://127.0.0.1:8000/api/tags/')
      .then(res => res.json())
      .then(data => data?.data || []);
  };

  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: getTags
  });

  return (
    <FormControl required fullWidth sx={{ my: 1 }}>
      <InputLabel id='tags-select-label'>Tags</InputLabel>
      <Select
        labelId='tags-select-label'
        id='tags-select'
        multiple
        value={tags}
        label='tags'
        onChange={handleChangeTag}
        input={<OutlinedInput label='Tags' />}
        MenuProps={MenuProps}
      >
        {tagsQuery && tagsQuery?.data?.length > 0 ?
          tagsQuery?.data.map((tag) => (
            <MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>
          )) : <MenuItem value='Loading' disabled>Loading...</MenuItem>
        }
      </Select>
    </FormControl>
  )
};

TagsSelect.propTypes = {
  tags: PropTypes.array,
  handleChangeTag: PropTypes.func,
};

