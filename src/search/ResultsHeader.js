import { SearchOutlined } from '@material-ui/icons';
import { Box, Grid, Hidden, IconButton, ListItem, TextField } from '@mui/material';
import React from 'react';
import Globals from '../globals';



const sortOptions = [ 
    { value: 'relevance', label: 'Relevance' },
    { value: 'title', label: 'Title'},
    { value: 'agency', label: 'Lead Agency'},
    { value: 'registerDate', label: 'Date'},
    { value: 'state', label: 'State'},
    // { value: 'documentType', label: 'Type'}
];


export default class ResultsHeader extends React.Component {

    constructor(props) {
        super(props);
        this.titleRaw = props.titleRaw;
        this.results = props.results;
        this.state= props.state

        console.log("🚀 ~ file: ResultsHeader.js:25 ~ constructor ~ props:", props)
        this.state = {
            sort: { value: 'relevance', label: 'Relevance' },
            order: { value: true, label: '^'}
        }
    }


toggleSearchTipsDialog = (evt) => {
console.log("🚀 ~ file: ResultsHeader.js:22 ~ toggleSearchTipsDialog ~ evt:", evt)

}
toggleAvailableFilesDialog = (evt) => {
    console.log("🚀 ~ file: ResultsHeader.js:25 ~ toggleAvailableFilesDialog ~ evt:", evt)
    
}
toggleQuickStartDialog = (evt) =>{
    
    console.log("🚀 ~ file: ResultsHeader.js:32 ~ toggleQuickStartDialog ~ toggleQuickStartDialog:", evt)
}


    onSortChange = (value_label, event) => {
        if(event.action === "select-option"){
            this.setState({
                sort: value_label
            }, () => {
                this.props.sort(this.state.sort.value, this.state.order.value);
            });
        }
    }
    
    onSortOrderChange = (value_label, event) => {
        if(event.action === "select-option"){
            this.setState({
                order: value_label
            },() => {
                this.props.sort(this.state.sort.value, this.state.order.value);
            });
        }
    }

    showDownloadButton = () => {
        if(Globals.curatorOrHigher()) {
            return <label className="link export" onClick={this.props.download}>
                Export search results
            </label>;
        } else if(localStorage.role) { // logged in?
            return <label className="link export" onClick={this.props.exportToSpreadsheet}>
                Export search results
            </label>;
        }
    }
    onIconClick = (evt) => {
        console.log('onIconClick evet',evt);
    }

    //render () {

        // return (
        //     <Grid className="results-bar">
        //             <div className="options-container">
        //                 <div className="sort-container inline-block">
        //                     <label className="dropdown-text" htmlFor="post-results-dropdown">
        //                         Sort by:
        //                     </label>
        //                     <Select id="post-results-dropdown" 
        //                         className={"multi inline-block"} classNamePrefix="react-select" name="sort" 
        //                         // styles={customStyles}
        //                         options={sortOptions} 
        //                         onChange={this.onSortChange}
        //                         value={this.state.sort}
        //                         placeholder={this.state.sort.label}
        //                     />
        //                     <Select id="post-results-dropdown-order" 
        //                         className={"multi inline-block"} classNamePrefix="react-select" name="sortOrder" 
        //                         // styles={customStyles}
        //                         options={sortOrderOptions} 
        //                         onChange={this.onSortOrderChange}
        //                         value={this.state.order}
        //                         placeholder={this.state.order.label}
        //                     />
        //                 </div>
                        
        //                 <div id="results-bar-checkbox" className="checkbox-container inline-block">
        //                     <input id="post-results-input" type="checkbox" name="showContext" className="sidebar-checkbox"
        //                             checked={this.props.showContext} 
        //                             onChange={this.props.onCheckboxChange}
        //                             disabled={this.props.snippetsDisabled}  />
        //                     <label className="checkbox-text no-select" htmlFor="post-results-input">
        //                         Show text snippets
        //                     </label>
        //                 </div>
        //                 {this.showDownloadButton()}
        //             </div>

        //         </Grid>
        // )
        render(){
return(
<>
<h2>Results Header Start</h2>
        
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
                  <ListItem onClick={this.toggleSearchTipsDialog}>
                    <a href="#">Search Tips</a>
                  </ListItem>
                  <ListItem onClick={this.toggleAvailableFilesDialog}>
                    <a href="#">Available Files</a>
                  </ListItem>
                  <ListItem onClick={this.toggleQuickStartDialog}>
                    <a href="#">Quick-start guide</a>
                  </ListItem>
                </Box>
              </Grid>
            </Hidden>
    
            <Grid container flex={1}>
              <Grid
                item
                xs={12}
                border={0}
                borderColor={'#DDD'}
                md={12}
                borderLeft={0}
                marginTop={2}
                id="search-box-grid-item"
              >
                <Box
                  id="search-box-box-item"
                  display={'flex'}
                  justifyContent={'center'}
                  justifyItems={'center'}
                  alignItems={'center'}
                  alignContent={'center'}
                  height={60}
                  paddingLeft={0}
                  paddingRight={2}
                  padding={0}
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
                    name="titleRaw"
                    variant="outlined"
                    // focused
                    // onInput={onInput}
                    // onKeyUp={onKeyUp}
                    // onKeyDown={onKeyDown}
                    placeholder="Search for NEPA documents"
                    value={this.state.titleRaw ? this.state.titleRaw : ''}
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <IconButton name="titleRaw" value={this.state.titleRaw  ? this.state.titleRaw  : ""} 
                            onClick={this.onIconClick}
                        >
                          <SearchOutlined />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={12} borderLeft={0} id="search-box-result-options-container">
                <h2>Options</h2>
                {/* <SearchResultOptions /> */}
              </Grid>
            </Grid>
          </Grid>
</>
   )}
}