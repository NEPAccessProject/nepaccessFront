import React, { useContext } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  Input,
  InputAdornment,
  IconButton,
  TextField,
  FormControl,
  Select,
  ListItem,
} from '@mui/material';
import ProximitySelect from './ProximitySelect';
import SearchContext from './SearchContext';
import SearchTipsDialog from './SearchTipDialog';
import AvailableFilesDialog from './AvailableFilesDialog';
import QuickStartDialog from './QuickStartDialog';
import { SearchOutlined } from '@mui/icons-material';
import theme from '../../styles/theme';
const useStyles = (theme) => ({
  formControl: {},
  autocomplete: {},
});

export default function SearchHeader(props) {
  const classes = useStyles(theme);
  const {
    searchState,
    setSearchState,
    onKeyUp,
    onKeyDown,
    onInput,
    toggleSearchTipsDialog,
    toggleAvailableFilesDialog,
    toggleQuickStartDialog,
    isAvailableFiltersDialogOpen,
    isQuickStartDialogOpen,
    isSearchTipsDialogIsOpen,
  } = useContext(SearchContext);
  return (
    <div id="search-text-div">
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
          <ListItem onClick={toggleSearchTipsDialog}>
            <a href="#">Search Tips - {isSearchTipsDialogIsOpen}</a>
          </ListItem>
          <ListItem onClick={toggleAvailableFilesDialog}>
            <a href="#">Available Files - {isAvailableFiltersDialogOpen}</a>
          </ListItem>
          <ListItem onCanPlay={toggleQuickStartDialog}>
            <a href="#">Quick-start guide - {isQuickStartDialogOpen}</a>
          </ListItem>
          {isQuickStartDialogOpen} - {isQuickStartDialogOpen} - {isAvailableFiltersDialogOpen}
        </Grid>
        <Grid item xs={2}>
          <Box
            id="proximity-search-box"
            //   width={'100%'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'flex-end'}
            paddingLeft={1}
            value={searchState.proximityOptions}
          >
            <ProximitySelect
              onProximityChange={(evt) => onProximityChange(evt)}
              options={searchState.proximityOption}
            />
          </Box>
        </Grid>
        <Grid item xs={8} borderLeft={0} id="search-box-grid-item">
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
            borderRadius={0}
            borderColor={'#CCC'}
            borderLeft={0}
            marginLeft={0}
            marginRight={0}
          >
            {' '}
            <TextField
              fullWidth
              backgroundColor={'white'}
              id="main-search-text-field"
              variant="outlined"
              focused
              onInput={onInput}
              onKeyUp={onKeyUp}
              placeholder="Search for NEPA documents"
              value={searchState.titleRaw ? searchState.titleRaw : ''}
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
      <SearchTipsDialog isOpen={isQuickStartDialogOpen} onClose={toggleSearchTipsDialog} />
      <AvailableFilesDialog
        isOpen={isAvailableFiltersDialogOpen}
        onClose={toggleAvailableFilesDialog}
      />
      <QuickStartDialog isOpen={isQuickStartDialogOpen} onClose={toggleQuickStartDialog} />
    </div>
  );
}
