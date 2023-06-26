import React from 'react';
import {Input,Select} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
//import Grid from '@mui/material/Grid'; // Grid version 1
import { Paper, Button, Box,  Divider, FormControl, Autocomplete,InputLabel,TextField, Typography,Container } from '@mui/material';
import { styled } from '@mui/material/styles';
const proximityOptions = [
    { value: 0, label: 'exact phrase' },
    { value: 10, label: '10 words' },
    { value: 50, label: '50 words' },
    { value: 100, label: '100 words' },
    { value: 500, label: '500 words' },
    { value: -1, label: 'any distance (default)' }
  ];
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
export default function SearchBar(props){
  const [inputSearch, setInputSearch] = React.useState('');
        return (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <Grid xs="auto">
                <Item>      <Select
                  id="proximity-select"
                  placeholder="Find within..."
                  options={proximityOptions}
                  value=""
                  // menuIsOpen={true}
                  isMulti={false}
                /></Item>
              </Grid>
              <Grid xs={9}>
                <Item><Input
                  id="main-search-bar"
                  ref={(input) => {
                    setInputSearch(input);
                    //this.inputSearch = input;
                  }}
                  className="search-bar"
                  name="titleRaw"
                  placeholder="Enter search terms (or leave blank to get all results)"
                  tabIndex="1"
                  value="some input"
                  autoFocus
                  xs={{
                    display: 'inline-flex',
                    border: 1,
                    color: 'darkgray',
                  }}
                /></Item>
              </Grid>
              <Grid xs>
                <Item>xs</Item>
              </Grid>
            </Grid>
          </Box>
        );
      }
