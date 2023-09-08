import { AppBar, Autocomplete, Button, Divider, FormControl, FormLabel, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';

//import theme from '../styles/theme';
import { useTheme } from '@mui/styles';
import theme from '../styles/theme';


console.log("🚀 ~ file: MUIthemex:6 ~ theme:", theme)

const exampleInputLables = {
  "key": 1, "value": "Standard",
  "key": 2, "value": "Standard",
}
const styles = {
  root: {
    background: "linear-gradient(45deg, green 30%, orange 90%)",
    border: 0,
    borderRadius: 1,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px"
  }
};

const MUITheme = (props) => {
  console.log("🚀 ~ file: MUIthemex:14 ~ constMUITheme ~ props:", props)
  const classes = useTheme(theme);
  console.log("🚀 ~ file: MUIthemex:30 ~ MUITheme ~ classes:", classes)
  return (
<>


          <Paper  elevation={1}  
            marginTop={200}  disableGutters sx={{
              display:'block',
              alignItems: 'center',
            alignSelf: 'center',
            border: 1,
            margin:25
          }}>
            {/* {JSON.stringify(theme)} */}
          <AppBar />
                <Typography variant="h1" color="primary">H1 Primary</Typography>
                <Typography variant="h1" color="secondary">H1 Secondary</Typography>
                <Typography variant="h2" color="primary">H2 Primary</Typography>
                <Typography variant="h2" color="secondary">H2 Secondry</Typography>
                <Typography variant="h3" color="primary">H3</Typography>
                <Typography variant="h3" color="secondary">H3</Typography>
                <Typography variant="h4" color="primary">H4</Typography>
                <Typography variant="h4" color="secondary">H4</Typography>
                <Typography variant="h5" color="primary">h5</Typography>
                <Typography variant="h5" color="secondary">h5</Typography>
                <Typography variant="subtitle" color="secondary">h5</Typography>
                <Typography variant="title" color="secondary">h5</Typography>
                <Typography variant="subtitle" color="secondary">h5</Typography>    
                <Divider />

                <Typography variant="error" color="primary">Primary Error</Typography>
                <Typography variant="error" color="secondary">Secondary Error</Typography>
    
                <Typography variant="subtitle1" color="primary">Primary Subtitle1</Typography>
                <Typography variant="subtitle1" color="secondary">Secondary Subtitle1</Typography>
    <Divider/>
                <Typography variant="h5" color="primary">Buttons</Typography>

                <Button variant="contained" color="primary"> Primary Contained Button</Button>
                <Button variant="contained" color="secondary"> Secondary Contained Button</Button>
    
                <Button variant="outlined" color="primary"> Primary OutLined Button</Button>
                <Button variant="outlined" color="secondary"> Contained Outlined Button</Button>
                
                <Button variant="text" color="primary"> Primary  Text Button</Button>
                <Button variant="text" color="secondary"> Secondary Text Button</Button>
              <Divider/>

                <List color='primary'>
                  <ListItem>List Item 1</ListItem>
                  <ListItem>List Item 2</ListItem>
                  <ListItem>List Item 3</ListItem>
                </List>The

          <List color='secondary'>
            <ListItem>List Item 1</ListItem>
            <ListItem>List Item 2</ListItem>
            <ListItem>List Item 3</ListItem>
          </List>

              <Typography variant="h5" color="primary">Form Fields </Typography>


                    <TextField id="standard-basic" label="Standard" />
                    <TextField id="filled-basic" label="Filled" variant="filled" />

                    <FormControl
                      fullWidth
                    >
                      <FormLabel>
                        Lead Agencies: {''}
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
              <TextField label="Standard" variant="standard" />
          </Paper>
</>
  )
}
export default withStyles(styles)(MUITheme);