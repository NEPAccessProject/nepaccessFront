import React, { useState } from 'react';
import {
  Paper,
  Button,
  Input,
  Box,
  Divider,
  FormControl,
  Select,
  Autocomplete,
  InputLabel,
  ListItem,
  IconButton,
  TextField,
  Typography,
  Container,
  FormLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { ThemeProvider, styled } from '@mui/material/styles';
import theme from '../../styles/theme';
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';
import { InputAdornment, SearchOutlined } from '@mui/icons-material';
import {
  proximityOptions,
  actionOptions,
  decisionOptions,
  agencyOptions,
  stateOptions,
  countyOptions,
} from '../options';
import { withStyles } from '@mui/styles';
import SideBarFilters from './SideBarFilters';
import SearchFilter from './SearchFilter';
import ResponsiveSearchResults from './ResponsivSearchResults';
import { lightBlue } from '@mui/material/colors';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  // ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 0,
  mt: 1,
  mb: 1,
  pl: 0,
  pr: 0,
  '&:hover': {
    //           backgroundColor: //theme.palette.grey[200],
    boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
    cursor: 'pointer',
    '& .addIcon': {
      color: 'darkgrey',
    },
  },
}));

const useStyles = (theme) => ({
  formControl: {},
  autocomplete: {},
});
const countyChange = (evt) => {
  console.log('countyChange', evt.target.value);
  evt.preventDefault();
};
const onLocationChange = (evt) => {
  console.log('onLocationChange', evt.target.value);
  evt.preventDefault();
};
const onAgencyChange = (evt) => {
  console.log('onAgencyChange', evt.target.value);
};
const onInput = (evt) => {
  console.log('onInput', evt.target.value);
  evt.preventDefault();
};
const onKeyUp = (evt) => {
  console.log('onKeyUp', evt.target.value);
  evt.preventDefault();
};

const onChangeHandler = (evt) => {
  console.log('onChangeHandler', evt.target.value);
  evt.preventDefault();
};
const onProximityChange = (evt) => {
  console.log('onProximityChange', evt.target.value);
  evt.preventDefault();
};

const SearchTipsDialog = (props) => {
  const isOpen = props.isOpen || false;

  console.log(`showSearchTipsDialog isOpen : ${isOpen}`);
  return (
    <Dialog open={isOpen}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Subscribe</Button>
      </DialogActions> */}
    </Dialog>
  );
};

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};
const section = {
  height: '100%',
  paddingTop: 5,
  backgroundColor: '#fff',
};
const summary = {
  marginTop: 15,
  marginBottom: 15,
  padding: 10,
  backgroundColor: '#d4d4d4',
};

export default function Search(props) {
  const [titleRaw, setTitleRaw] = useState('');
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  console.log('Proximity Options:', proximityOptions);

  const onDialogClose = () => {
    console.log('onDialogClose');
    setDialogIsOpen(false);
  };
  const onDialogOpen = () => {
    console.log('onDialogOpen');
    setDialogIsOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container disableGutters={true} sx={{}}>
        <Item>
          <div style={styles} id="search-text-div">
            <Grid
              id="search-text-grid-container"
              display={'flex-root'}
              alignItems={'center'}
              container={true}
              layout={'row'}
              spacing={1}
              border={0}
              borderColor={'#CCC'}
            >
              <Grid
                id="search-text-grid-item"
                item={true}
                xs={2}
                border={0}
                backgroundColor="transparent"
                height={115}
                borderRadius={0}
                borderColor={'#CCC'}
                borderRight={1}
              >
                <div style={section}>
                  {' '}
                  <ListItem onClick={onDialogOpen}>Search Tips</ListItem>
                  <ListItem onClick={onDialogOpen}>Available Files</ListItem>
                  <ListItem onClick={onDialogOpen}>Quick-start guide</ListItem>
                </div>
              </Grid>
              <Grid item={true} xs={2}>
                <Box
                  id="proximity-search-box"
                  width={'100%'}
                  display={'flex'}
                  alignItems={'center'}
                  border={0}
                  justifyContent={'flex-end'}
                  paddingLeft={1}
                >
                  <ProximitySelect options={proximityOptions} />
                </Box>
              </Grid>
              <Grid item={true} xs={8} border={0} id="search-box-grid-item">
                <Box
                  id="search-box-box-item"
                  xs={12}
                  display={'flex'}
                  justifyContent={'center'}
                  justifyItems={'center'}
                  alignItems={'center'}
                  alignContent={'center'}
                  height={115}
                  paddingLeft={2}
                  paddingRight={2}
                  padding={1}
                  elevation={1}
                  borderRadius={1}
                  border={0}
                  borderColor={'#CCC'}
                >
                  {' '}
                  <TextField
                    fullWidth
                    backgroundColor={'white'}
                    id="main-search-text-field"
                    variant="standard"
                    onInput={onInput}
                    onKeyUp={onKeyUp}
                    placeholder="Search for NEPA documents"
                    value={titleRaw ? titleRaw : ''}
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={(evt) => onChangeHandler(evt)}>
                          <SearchOutlined />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        </Item>

        <Grid
          mt={2}
          textAlign={'left'}
          alignContent={'flex-start'}
          spacing={1}
          rowSpacing={1}
          justifyContent={'flex-start'}
          container={true}
        >
          <Grid xs={3} p={0} item={true}>
            <Paper>
              <SideBarFilters
                countyOptions={countyOptions}
                stateOptions={stateOptions}
                agencyOptions={agencyOptions}
                actionOptions={actionOptions}
                decisionOptions={decisionOptions}
              />
            </Paper>
            <Divider />
          </Grid>
          <Grid xs={9}>
            <Item>
              <ResponsiveSearchResults />
            </Item>
          </Grid>
        </Grid>
        <Dialog open={dialogIsOpen} onClose={onDialogClose}>
          <DialogTitle>Search word Connectors</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Grid container={true} spacing={1}>
                <Grid item={true} xs={2}>
                  <b>AND</b>
                </Grid>
                <Grid item={true} xs={10}>
                  This is the default. <b>all</b> words you enter must be found together to return a
                  result.
                </Grid>
              </Grid>
              <Grid container={true} spacing={1}>
                <Grid item={true} xs={2}>
                  <b>OR</b>
                </Grid>
                <Grid item={true} xs={10}>
                  (all caps) to search for <b>any</b> of those words.
                </Grid>
              </Grid>
              <Grid container={true} spacing={1}>
                <Grid item={true} xs={2}>
                  <b>NOT</b>
                </Grid>
                <Grid item={true} xs={10}>
                  (all caps) to search to <b>exclude</b>words or a phrase.
                </Grid>
              </Grid>
              <Grid container={true} spacing={1}>
                <Grid item={true} xs={2}>
                  <b>" "</b>
                </Grid>
                <Grid item={true} xs={10}>
                  Surround words with quotes (" ") to search for an exact phrase.
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export function ProximitySelect(props) {
  const { options, proximityDisabled } = props;
  const [proximityOptionValue, setProximityOptionValue] = React.useState(proximityOptions[0]);
  console.log('ProximitySelect options', proximityOptions ? proximityOptions.length : 0);
  const classes = useStyles(theme);
  const isDisabled = proximityDisabled ? false : true;
  // (props.proximityOptionValue) ? setProximityOptionValue(props.proximityOptionValue) : setProximityOptionValue(proximityOptions[0]);
  return (
    <>
      <Autocomplete
        id={'proximity-select-autocomplete'}
        fullWidth={true}
        autoComplete={true}
        autoHighlight={true}
        tabIndex={3}
        className={classes.autocomplete}
        options={options ? options : []}
        disablePortal={true}
        // value={value}
        // menuIsOpen={true}
        onChange={onProximityChange}
        getOptionLabel={(option) => option.label || label}
        renderInput={(params) => <TextField placeholder="Search Within..." {...params} />}
        sx={{
          p: 0,
        }}
      />
    </>
  );
}
