import { AppBar, Autocomplete, Button, Divider, FormControl, FormLabel, Grid, Paper, TextField, Typography } from '@mui/material';
import React from 'react';

//import theme from '../styles/theme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from 'react-jss';

import { useTheme } from '@mui/material/styles';
import theme from '../styles/theme';


console.log("🚀 ~ file: MUITheme.jsx:6 ~ theme:", theme)

const exampleInputLables = {
  "key": 1, "value": "Standard",
  "key": 2, "value": "Standard",
}

const MUITheme = (props) => {
  console.log("🚀 ~ file: MUITheme.jsx:14 ~ constMUITheme ~ props:", props)
  const classes = useTheme(theme);
  return (

<>


<CssBaseline />
<ThemeProvider theme={theme}>
          <Paper marginTop={25} border={1} disableGutters={true} sx={{
            alignItems: 'center',
            alignSelf: 'center',
            border: 1
          }}>
            {/* {JSON.stringify(theme)} */}
          <AppBar />
            <Grid container flex={1} border={1}>
              <AppBar />
              <Grid item xs={6} border={1}>
                <Typography variant="h1" color="primary">H1</Typography>
                <Typography variant="h1" color="primary">H1</Typography>
                <Typography variant="h2" color="secondary">H2</Typography>
                <Typography variant="h2" color="primary">H2</Typography>
                <Typography variant="h3" color="primary">H3</Typography>
                <Typography variant="h3" color="secondary">H3</Typography>
              </Grid>
              <Grid item xs={6} border={1}>
                <Typography variant="h4" color="primary">H4</Typography>
                <Typography variant="h4" color="secondary">H4</Typography>
                <Typography variant="h5" color="primary">h5</Typography>
                <Typography variant="h5" color="secondary">h5</Typography>
                <Typography variant="subtitle" color="secondary">h5</Typography>
                <Typography variant="title" color="secondary">h5</Typography>
                <Typography variant="subtitle" color="secondary">h5</Typography>
              </Grid>
    
              <Grid item xs={6}>
                <Divider />
                <Typography variant="resultsSubtitle" color="primary">resultsSubtitle</Typography>
                <Typography variant="resultsSubtitle" color="secondary">resultsSubtitle</Typography>
                <Divider />
                <Typography variant="resultsTitle" color="primary">resultsTitle</Typography>
                <Typography variant="resultsTitle" color="secondary">resultsTitle</Typography>
                <Divider />
                <Typography variant="error" color="primary">Error</Typography>
    
                <Typography variant="subtitle1" color="primary">subtitle1</Typography>
                <Typography variant="subtitle1" color="secondary">subtitle1</Typography>
                <Typography variant="h5" color="primary">Contained Buttons</Typography>
              </Grid>
    
              <Grid item xs={6}>
                <Button variant="contained" color="primary"> Contained Button</Button>
                <Button variant="contained" color="secondary"> Contained Button</Button>
    
                <Typography variant="h5" color="primary">Outlined Buttons</Typography>
                <Button variant="outlined" color="primary"> OutLined Button Contained Button</Button>
                <Button variant="outlined" color="secondary"> OutLined Contained Button</Button>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5" color="primary">Text Buttons</Typography>
    
                <Button variant="text" color="primary"> OutLined Button Contained Button</Button>
                <Button variant="text" color="secondary"> OutLined Contained Button</Button>
              </Grid>
    
              <Typography variant="h5" color="primary">Form Elements</Typography>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={4} sm={6}>
                    <TextField id="standard-basic" label="Standard" />
                  </Grid>
                  <Grid item xs={4} sm={6}>
                    <TextField id="filled-basic" label="Filled" variant="filled" />
                  </Grid>
                  <Grid item xs={4} sm={6}>
                    <FormControl
                      fullWidth
                    >
                      <FormLabel>
                        Lead Agencies:
                      </FormLabel>
                      <Autocomplete
                        id="searchAgency"
                        name="agency"
                        fullWidth
                        autoComplete={true}
                        // autoHighlight={true}
                        tabIndex={11}
                        className={"classes.autocomplete"}
                        getOptionLabel={(exampleInputLables) => exampleInputLables.value}
                        disablePortal={true}
                        // value={searchState.agencyRaw}
                        variant="standard"
                        // menuIsOpen={true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            value={"testValue"}
                            variant="outlined"
                            sx={{
                              width: "100%",
                              p: 0,
                            }}
                            placeholder="Type or Select Lead Agencies"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
    
    
              <TextField label="Standard" variant="standard" />
            </Grid>
          </Paper>
</ThemeProvider>
</>
  )
}
export default MUITheme;