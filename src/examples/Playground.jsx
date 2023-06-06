import React from 'react';
import {Grid,TextField,IconButton,Select,Container} from '@material-ui/core/';
import {SearchOutlined} from '@material-ui/icons/';

    const proximityOptions = [
      { value: 0, label: 'exact phrase' },
      { value: 10, label: '10 words' },
      { value: 50, label: '50 words' },
      { value: 100, label: '100 words' },
      { value: 500, label: '500 words' },
      { value: -1, label: 'any distance (default)' },
    ];
export default function Playground(props) {
    return (
          <Grid
            container
            direction="row"
            width= '80%'
            sx={{
              border: 2,
            backgroundColor: '#CCC',
              marginLeft: '10%',
              marginRight: '10%',
              justifyContent: 'center',
              border:2,
              borderColor: 'red',
              m:4,
              p:2
            }}
          >
            <Grid
              item
              md={2}
              xs={12}
              sx={{
                minHeight: '100vh',
                border: 1,
                justifyContent: 'flex-end',
                backgroundColor: '#CCC',
                width: '80%',
                ml:1,
              }}
            >
              <Select
                id="fragmentSize"
                className="multi"
                classNamePrefix="react-select"
                name="fragmentSize"
                placeholder="Default"
                options={proximityOptions}
                sx={{
                    height: '200vh'
                }}
                // (temporarily) specify menuIsOpen={true} parameter to keep menu open to inspect elements.
                // menuIsOpen={true}
              />
            </Grid>
            <Grid
              item
              md={11}
              xs={12}
              sx={{
                border: 2,
                justifyContent: 'flex-start',
              }}
            >
              <TextField
                fullWidth
                id="standard-bare"
                variant="standard"
                placeholder="Search for NEPA documents"
                value="some value"
                autoFocus
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  border: 'none',
                  backgroundColor: 'dark gray',
                  padding: 0,
                  paddingLeft: 2,
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchOutlined />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>
    );
}