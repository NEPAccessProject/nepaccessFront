import { SearchOutlined } from '@material-ui/icons';
import {
  Box,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  Paper,
  TextField,
} from '@mui/material';
import React from 'react';
import theme from '../styles/theme'
import Globals from '../globals';
import SearchContext from './SearchContext';
import SearchResultOptions from './SearchResultOptions';
import SearchTipsDialog from './Dialogs/SearchTipDialog';
import AvailableFilesDialog from './Dialogs/AvailableFilesDialog';
import QuickStartDialog from './Dialogs/QuickStartDialog'
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'title', label: 'Title' },
  { value: 'agency', label: 'Lead Agency' },
  { value: 'registerDate', label: 'Date' },
  { value: 'state', label: 'State' },
  // { value: 'documentType', label: 'Type'}
];

export default class ResultsHeader extends React.Component {
  static contextType = SearchContext;

  constructor(props) {
    super(props);
    const ctx = this.context;
    console.log(
      `file: ResultsHeader.js:32 ~ ResultsHeader ~ constructor ctx State:`,
      ctx,
    );

    this.state = {
      //[TODO] move sort and sort order to the parent state (Search) component
      sort: { value: 'relevance', label: 'Relevance' },
      order: { value: true, label: '^' },
      isSearchTipsDialogOpen: false,
      isAvailableFilesDialogOpen: false,
      isQuickStartDialogOpen: false,
    };
  }
  toggleSearchTipsDialog = (evt) => {
    console.log(
      '🚀 ~ Current State after SearchTipsToggle',
      this.state,
    );

    this.setState({
      isSearchTipsDialogOpen:
        !this.state.isSearchTipsDialogOpen,
    });
  };
  toggleAvailableFilesDialog = (evt) => {
    console.log(
      '🚀 ~ file: ResultsHeader.js:25 ~ toggleAvailableFilesDialog ~ evt:',
      evt,
    );
    this.setState({
      isAvailableFilesDialogOpen:
        !this.state.isAvailableFilesDialogOpen,
    });
  };
  toggleQuickStartDialog = (evt) => {
    console.log(
      '🚀 ~ file: ResultsHeader.js:32 ~ toggleQuickStartDialog ~ toggleQuickStartDialog:',
      evt,
    );
    this.setState({
      isQuickStartDialogOpen:
        !this.state.isQuickStartDialogOpen,
    });
  };

  onSortChange = (event) => {
    console.log(
      `file: ResultsHeader.js:59 ~ ResultsHeader ~ event:`,
      event,
    );
    //if (event.action === "select-option") {
    this.setState(
      {
        sort: event.target.value,
      },
      () => {
        this.props.sort(
          this.state.sort.value,
          this.state.order.value,
        );
      },
    );
    //}
  };
  onSortOrderChange = (event) => {
    console.log(
      `file: ResultsHeader.js:72 ~ ResultsHeader ~ event:`,
      event,
    );
    //    if (event.action === "select-option") {
    this.setState(
      {
        order: event.target.value,
      },
      () => {
        this.props.sort(
          this.state.sort.value,
          this.state.order.value,
        );
      },
    );
    //  }
  };

  showDownloadButton = () => {
    if (Globals.curatorOrHigher()) {
      return (
        <label
          className='link export'
          onClick={this.props.download}>
          Export search results
        </label>
      );
    } else if (localStorage.role) {
      // logged in?
      return (
        <label
          className='link export'
          onClick={this.props.exportToSpreadsheet}>
          Export search results
        </label>
      );
    }
  };
  onIconClick = (evt) => {
    console.log('onIconClick evet', evt);
  };
  onResizeHandler(){
    console.log(`onResizeHandler window.innerWidth: ${window.innerWidth} - window.innerHeight: ${window.innerHeight}`);
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 990;
    const isDesktop = window.innerWidth > 990;
    this.setState({
      isMobile,
      isTablet,
      isDesktop
    })
  }
  componentDidMount() {
    const ctx = this.context;
    console.log(`file: ResultsHeader.js:155 ~ ResultsHeader ~ componentDidMount ~ ctx:`, ctx);
    console.log(`file: ResultsHeader.js:158 ~ ResultsHeader ~ componentDidMount ~ CONTEXT PROPS:`, this.props);
    // this.setState = this.context
  }

  render() {
    return (
      <>
        <Paper fullWidth elevation={1} border={0} sx={{
          width: '100%',
          flex:1,
          borderRadius: 0,
          marginLeft: 0,
          marginRight: 0,
          padding: 0,
          margin: 0
        }} >
          <SearchTipsDialog
            onClose={this.toggleSearchTipsDialog.bind(this)}
            isOpen={this.state.isSearchTipsDialogOpen}
          />
          <AvailableFilesDialog
            onClose={this.toggleAvailableFilesDialog.bind(this)}
            isOpen={this.state.isAvailableFilesDialogOpen}
          />
          <QuickStartDialog
            onClose={this.toggleQuickStartDialog.bind(this)}
            isOpen={this.state.isQuickStartDialogOpen}
          />
          <Grid
            container
            id='search-text-grid-container'
            display={'flex-root'}
            alignItems={'center'}
            layout={'row'}
            spacing={1}
          >
              <Grid
                item
                md={2}
                xs={12}
                justifyContent={'center'}
                alignContent={'center'}
                alignItems={'center'}
              >
                <Box
                  id='search-text-grid-item'
                // backgroundColor="transparent"
                //height={115}
                >
                  <ListItem
                    onClick={this.toggleSearchTipsDialog.bind(this)}>
                    <a href='#'>
                      Search Tips
                    </a>
                  </ListItem>
                  <ListItem
                    onClick={this.toggleAvailableFilesDialog.bind(
                      this,
                    )}>
                    <a href='#'>
                      Available Files
                    </a>
                  </ListItem>
                  <ListItem
                    onClick={this.toggleQuickStartDialog.bind(
                      this,
                    )}>
                    <a href='#'>Quick Start
                    </a>
                  </ListItem>
                </Box>
              </Grid>
            <Grid
              id="search-box-grid-container"
              container
              flex={1}
            >
              <Grid
                item
                xs={12}
                border={0}
                md={12}
                borderLeft={0}
                marginTop={2}
                paddingRight={3}
                // paddingRight={1}
                id='search-box-grid-item'>
                <Box
                  id='search-box-box-item'
                  display={'flex'}
                  height={60}
                  padding={0}
                >
                  <TextField
                    fullWidth
                    focused
                    backgroundColor={'white'}
                    id='main-search-text-field'
                    name='titleRaw'
                    variant='outlined'
                    color="primary"
                    onInput={(evt) => this.props.onInput(evt)}
                    sx={{
                      marginLeft: 2,
                      marginRight: 2,
                    }}
                    // onKeyUp={onKeyUp}
                    // onKeyDown={onKeyDown}
                    placeholder='Search for NEPA documents'
                    value={
                      this.props.titleRaw
                        ? this.props.titleRaw
                        : ''
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "1px solid lightblue",
                        borderRadius: "0",
                        padding: "0",
                      },
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid lightblue",
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <Hidden mdDown>
                          <Grid item md={1} xs={0}>
                            <IconButton
                              name='titleRaw'
                              value={
                                this.props.titleRaw
                                  ? this.props.titleRaw
                                  : ''
                              }
                              onClick={this.props.onIconClick}>
                              <SearchOutlined />
                            </IconButton>

                          </Grid>
                        </Hidden>
                      ),
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                id='search-box-result-options-container'>
                <SearchResultOptions isDesktop={this.state.isDesktop} isMobile={this.state.isMobile} isTablet={this.state.isTablet} onResizeHandler={this.onResizeHandler} />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }
}
