import { SearchOutlined } from '@mui/icons-material';
import {
  Box,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  TextField
} from '@mui/material';
import React, { useContext } from 'react';
import AvailableFilesDialog from './AvailableFilesDialog';
import QuickStartDialog from './QuickStartDialog';
import SearchContext from './SearchContext';
import SearchTipsDialog from './SearchTipDialog';

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
    onIconClick,
    onChangeHandler,
    hideText,
  } = useContext(SearchContext);
  const {    
    isAvailableFiltersDialogOpen,
    isQuickStartDialogOpen,
    isSearchTipsDialogIsOpen,titleRaw,proximityOptions} = searchState;



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
        borderColor="darkgray"
      >
        <Hidden mdDown>
          
          <Grid item xs={12} md={2}>
            <Box
              id="search-text-grid-item"
              // backgroundColor="transparent"
              height={115}
              borderRadius={0}
              borderRight={0}
              borderColor={'#CCC'}
            >
              <ListItem onClick={toggleSearchTipsDialog}>
                <a href="#">Search Tips</a>
              </ListItem>
              <ListItem onClick={toggleAvailableFilesDialog}>
                <a href="#">Available Files</a>
              </ListItem>
              <ListItem onClick={toggleQuickStartDialog}>
                <a href="#">Quick-start guide</a>
              </ListItem>
            </Box>
          </Grid>
        </Hidden>
  
        <Grid item xs={12} md={9} borderLeft={0} id="search-box-grid-item">
          <Box
            id="search-box-box-item"

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
            border={0}
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
              name='titleRaw'
              variant="outlined"
              focused
              onInput={onInput}
              onKeyUp={onKeyUp}
              onKeyDown={onKeyDown}
              placeholder="Search for NEPA documents"
              value={titleRaw ? titleRaw : ''}
              autoFocus
              InputProps={{
                endAdornment: (
                  <IconButton onClick={(evt)=>onIconClick(evt)}>
                    <SearchOutlined />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <SearchTipsDialog 
        isOpen={isSearchTipsDialogIsOpen} 
        onDialogClose={toggleSearchTipsDialog} />
      <AvailableFilesDialog
        isOpen={isAvailableFiltersDialogOpen}
        onDialogClose={toggleAvailableFilesDialog}
      />
      <QuickStartDialog 
        isOpen={isQuickStartDialogOpen}
        onDialogClose={toggleQuickStartDialog} />
    </div>
  );
}
