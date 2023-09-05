import { Box, Divider, Link, Paper, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import React from "react";
import { reactFormatter } from "react-tabulator";
import "react-tabulator/lib/css/tabulator_site.min.css"; // theme
import "react-tabulator/lib/styles.css"; // required styles
import "../cardProcess.css";
import Globals from "../globals.js";
import "../loader.css";
import "./search.css";
//import SearchProcessResult from "./SearchProcessResult.js";
import SearchContext from './SearchContext';
import SearchProcessResult from "./SearchProcessResult";
import SearchResultItems from './SearchResultsItems.jsx';
import SearchTips from './SearchTips.jsx';
//import SearchResultItems from "./SearchResultsItems.jsx";
import ResultsLayoutSkeleton from './ResultsLayoutSkeleton';
import SearchResultCards from './SearchResultCards';

const _ = require("lodash");

const FULLSTYLE = {
  width: "100%",
  minWidth: "20%",
  maxWidth: "100%",
};
const Item = styled(Paper)(({ theme }) => ({
  ...theme,
  //backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  //backgroundColor:"#ccc",
  //...theme.typography.body2,
  padding: 2,//theme.spacing(1),
  // textAlign: 'center',
  color: "#ccc", //theme.palette.text.secondary,
  elevation: 1,

  borderRadius: 0,
  mt: 2,
  mb: 2,
  pl: 0,
  pr: 0,
  fontColor: '#000',
  "&:hover": {
    //           backgroundColor: //theme.palette.grey[200],
    boxShadow: "0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)",
    cursor: "pointer",
    "& .addIcon": {
      color: "purple",
    },
    fontFamily: "open sans"
  },
}));

const SkeletonItem = styled(Skeleton)(({ theme }) => ({
  ...theme,
  //backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  //backgroundColor:"#ccc",
  //...theme.typography.body2,
  padding: 2,//theme.spacing(1),
  // textAlign: 'center',
  color: "#ccc", //theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 1,
  fontColor: '#000',
  "&:hover": {
    //           backgroundColor: //theme.palette.grey[200],
    boxShadow: "0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)",
    cursor: "pointer",
    "& .addIcon": {
      color: "purple",
    },
    fontFamily: "open sans",
    width: 75,
    height: 50,
  },
}));

const CardItem = styled(Paper)(({ theme }) => ({
  //backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  //...theme.typography.body2,
  //...theme,
  padding: 2,//theme.spacing(1),
  // textAlign: 'center',
  fontColor: "#000", //theme.palette.text.secondary,
  elevation: 1,

  borderRadius: 0,
  // mt: 2,
  // mb: 2,
  margin: 2,
  "&:hover": {
    //           backgroundColor: //theme.palette.grey[200],
    boxShadow: "0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)",
    cursor: "pointer",
    "& .addIcon": {
      color: "purple",
    },
  },
}));
export default class SearchProcessResults extends React.Component {
  static contextType = SearchContext;
  _size = 0;
  _columns = [];
  hidden = new Set();

  page = 1;
  pageSize = 10;
  offsetY = null;

  constructor(props) {
    super(props);
    // console.log(
    //   "🚀 ~ file: SearchProcessResults.js:41 ~ SearchProcessResults ~ constructor ~ props:",
    //   props
    // );
    const ctx = this.context;
    console.log('Search Process Results - 97 - ctx', ctx);
    this.state = {
      //     ...state,
      showContext: true,
      size: 0,
      hidden: new Set(),
    };
    window.addEventListener("resize", this.handleResize);
    Globals.registerListener("new_search", this.resetHidden);

    this._columns = [
      {
        title: "",
        field: "",
        formatter: reactFormatter(
          <SearchProcessResult
            show={this.state.showContext}
            hideText={this.hideText}
            hidden={this.hide}
          />
        ),
      },
    ];

    this.options = {
      selectable: false,
      tooltips: false,
      pagination: "local", //paginate the data
      paginationSize: 10, //allow 10 rows per page of data
      paginationSizeSelector: [10, 25, 50], // with all the text, even 50 is a lot.
      movableColumns: false, //don't allow column order to be changed
      resizableRows: false,
      resizableColumns: false,
      layout: "fitColumns",
      invalidOptionWarnings: false, // spams spurious warnings without this
    };

    this.updateTableDebounced = _.debounce(this.updateTable, 0);
    this.doneRenderDebounced = _.debounce(this.doneRender, 0);
  }

  resetHidden = () => {
    // console.log("Brand new search, clear toggled Set");
    this.hidden = new Set();
  };

  hide = (props) => {
    return this.hidden.has(props);
  };

  hideText = (_offsetY, _index, record) => {
    this.offsetY = _offsetY;

    if (this.hidden.has(record.id)) {
      this.hidden.delete(record.id);
      this.setState({ hidden: this.hidden });
    } else {
      this.hidden.add(record.id);
      this.setState({ hidden: this.hidden }, () => {
        this.props.gatherSpecificHighlights(_index, record);
      });
    }
  };

  handleResize = () => { };
  /** TODO:  The problem is that we don't always want to scroll when the page has to
   * redraw.  Examples would be showing/hiding text snippets or changing the page.  Page tends to redraw
   * several times, so we can't just immediately set offsetY to null, and it's slightly laborious to clear
   * offsetY every time we do any other kind of event.  So we just clear it here on a delay, but it's a little
   * bit of a hack. */
  doneRender = () => {
    // console.log("They see me scrollin'")
    if (this.offsetY) {
      // console.log("They hatin'",this.offsetY)
      window.scrollTo(0, this.offsetY);
      setTimeout(() => {
        // After all redraws are probably finished, clear variable
        this.offsetY = null;
      }, 500);
    }
  };
  onPageLoaded = (pageNumber) => {
    // this.page can become a string on mount/unmount, which makes comparisons interesting.
    // console.log(typeof(this.page));
    try {
      const TABLE = this.ref.table;
      let PAGE_SIZE = TABLE.footerManager.links[0].size;
      let shouldScroll = false;
      // Page change OR page size change
      if (this.page != pageNumber || this.pageSize != PAGE_SIZE) {
        // Only scroll to top on new page, not new page size
        if (this.page != pageNumber) {
          shouldScroll = true;
        }

        // Need to set these ahead of informAppPage()
        this.page = pageNumber;
        this.pageSize = PAGE_SIZE;

        // Ensures this won't try to run if parent (App.js) isn't supporting on-demand highlighting
        if (this.props.informAppPage) {
          this.props.informAppPage(pageNumber, PAGE_SIZE);
        }

        if (shouldScroll) {
          this.props.scrollToTop();
        }
      } else {
        // do nothing
        // console.log("Nothing is different", this.page, pageNumber, this.pageSize, PAGE_SIZE);
      }
    } catch (e) {
      /* New search (or webapp navigation): Reset page number.
                Otherwise on new search the table will go to the page from the previous results from the previous search,
                which can't possibly be correct. Size could be restored but 10 is actually already large. */
      this.page = pageNumber;
      this.pageSize = 10;

      // console.error(e);
      // console.error("Table not yet rendered");
    }
  };
  handlePaginationError = (evt) => {
    console.log("Custom pagination error logic");
    this.onPageLoaded(1);
  };
  onCheckboxChange = (evt) => {
    this.setState({
      showContext: evt.target.checked,
    });
  };
  /** To update show/hide text snippets, updates columns; also redraws table to accommodate potentially
   * different-sized contents (particularly height) so that nothing overflows and disappears outside the table itself
   */
  updateTable = () => {
    if (this.ref && this.ref.table) {
      const TABLE = this.ref.table;
      try {
        // all needed for text snippets show/hide
        let _columns = [];
        if (this.props.results && this.props.results[0]) {
          this._size = this.props.results.length;

          _columns = [
            {
              title: "",
              field: "",
              formatter: reactFormatter(
                <SearchProcessResult
                  show={this.state.showContext}
                  hideText={this.hideText}
                  hidden={this.hide}
                />
              ),
            },
          ];
        }
        TABLE.setColumns(_columns);

        // Check if filtering has reduced the page count below the last known active page.
        // We don't want to call setPage on a page that doesn't exist.
        // Use max page in that case. Other option would be setPage(1).
        TABLE.setPage(Math.min(this.page, TABLE.footerManager.links[0].max));
        // Note that we might want the page to be reset in some circumstances but that can be handled if so
      } catch (e) {
        console.log("Column setup error");
        // that's okay
      } finally {
        // need to redraw to accommodate new data (new dimensions) or hiding/showing texts
        setTimeout(function () {
          TABLE.redraw(true);
          console.log("Table redrawn");
        }, 0);
      }
    }
  };
  getCorrectResultsStyle = () => {
    if (this.props.filtersHidden) {
      return FULLSTYLE;
    } else {
      return null;
    }
  };
  onDetailLink = (processId) => {
    //console.log('onDetailLink',processId);
    //this.props.onDetailLink(processId);
  }
  // render() {
  //   console.log(`🚀 ~ file: SearchProcessResults.js:97 ~ SearchProcessResults ~ constructor ~ this.context:`, this.context);
  //   console.log(`🚀 ~ file: SearchProcessResults.js:97 ~ SearchProcessResults ~ constructor ~ Search Context:`, SearchContext);

  //   if (!this.props.results || (!this.props.results.length > 0)) {
  //     /** Show nothing until loading results. props.resultsText will just be "Results" before any search.
  //      * During a search, it will be "Loading results..." and if 100+ async results we may
  //      * simultaneously have 100 props.results.  After a search we won't hit this logic because we'll have props.results
  //      */
  //     if (this.props.resultsText !== "Results") {
  //       return (
  //         <>
  //         <Box  padding={1} paddingLeft={3} paddingRight={3} id="search-results-box">
  //             <Typography variant='h3' fontSize={20} >{this.state.searching}</Typography>

  //             <Grid container id="search-tips-item-container" >
  //               <Grid item id="search-tips-grid-item">
  //                 <Grid paddingLeft={3} paddingRight={3} item xs={12} justifyContent={'center'} alignContent={'center'} > 
  //                   {/* <divider>
  //                     {(this.props.results.length  === 0)}
  //                       ? Loading......
  //                       <Box height={100} width={100}>
  //                         <CircularProgress />
  //                        </Box> 
  //                       : <SearchTips/>
  //                   </divider> */}
  //                   <Skeleton variant="rectangular" width={'100%'} height={400} />
  //                 </Grid>
  //               </Grid>
  //             </Grid>
  //         </Box>

  //         </>);
  //     } else {
  //       return <></>;
  //     }
  //   }

  //   try {
  //     return (
  // 			<>
  //         {this.state.hasSearched
  // 				? (
  //             <Box id="search-process-results-container" 
  //         sx={{
  //           padding:0,
  //         }}>
  // 				  <Typography margin={2}  marginLeft={1} color="primary" variant='h2'>
  // 						Search results {''}
  // 					</Typography>
  //             <Grid container display={'flex'} sx={9} flex={1} id="results-text-container" >
  // 						  <Typography variant="h4">{this.props.resultsText}&nbsp;</Typography>
  //             {/* <CircularProgress/> */}
  // 						<Tippy
  // 							className='tippy-tooltip--small searchTips'
  // 							trigger='manual click'
  // 							hideOnClick={true}
  // 							interactive={true}
  //               placement='right'
  // 							content={
  // 								<div>
  // 									The map view is a{' '}
  // 									<span className='bold'>visual representation</span> of all
  // 									states and counties found in the current results table.
  // 									<div>
  // 										• If you hover over a polygon, a tooltip will also show how
  // 										many of the current results are linked to it.
  // 									</div>
  // 									<div>
  // 										• You can toggle the state and/or county layer by clicking
  // 										on the checkboxes in the upper left corner.
  // 									</div>
  // 								</div>
  // 							}
  // 						>
  // 							{
  // 								<span className={'side-link inline'}>
  // 									<svg
  // 										xmlns='http://www.w3.org/2000/svg'
  // 										width='16px'
  // 										height='16px'
  // 										viewBox='0 0 100 100'
  // 									>
  // 										<path
  // 											className='info-svg'
  // 											d='M50.433,0.892c-27.119,0-49.102,21.983-49.102,49.102s21.983,49.103,49.102,49.103s49.101-21.984,49.101-49.103S77.552,0.892,50.433,0.892z M59,79.031C59,83.433,55.194,87,50.5,87S42,83.433,42,79.031V42.469c0-4.401,3.806-7.969,8.5-7.969s8.5,3.568,8.5,7.969V79.031z M50.433,31.214c-5.048,0-9.141-4.092-9.141-9.142c0-5.049,4.092-9.141,9.141-9.141c5.05,0,9.142,4.092,9.142,9.141C59.574,27.122,55.482,31.214,50.433,31.214z'
  // 										/>
  // 									</svg>
  // 								</span>
  // 							}
  // 						</Tippy>

  //             {this.props.hasSearched && this.props.searching ? <>Searching</> : <>Done</>}
  //              <Typography variant='h6'> Results # {this.props.results.length}</Typography>
  //               <Chip>Searching: {this.props.searching}</Chip>
  //               <Chip>Search Result Text: {this.props.resultsText}</Chip>
  // 						{this.props.results.map((result, index) => {
  // 							return (
  // 								<Grid item>
  // 									<>
  //                   <Typography paddingLeft={2} color={'primary'} variant='h5'>{(result.title) 
  //                     ? <a onClick={this.onDetailLink(result.processId)} href="#">{result.title}</a>
  //                     : ''}</Typography>
  // 										<SearchResultCards result={result} />
  // 										<SearchResultItems result={result} />
  // 									</>
  // 								</Grid>
  // 							);
  // 						})}
  // 					  </Grid>
  // 				    </Box>
  //           )
  //         : (
  //             <>
  //               <SearchTips/>
  //             </>
  //           )
  //         }
  // 			</>
  // 		);

  //   } catch (e) {
  //     if (e instanceof TypeError) {
  //       // Tabulator trying to render new results before it switches to new column definitions
  //       console.error("TypeError", e);
  //     } else {
  //       console.error(e);
  //     }
  //     return (
  //       <div className="sidebar-results">
  //         {/* <Typography variant="h4" id="results-label">First Search Result Items with # of results {this.props.results.length}
  //           ResultsText= {this.props.resultsText}</Typography> */}
  //         {this.props.results.map((result, index) => {
  //           return (
  //             <>
  //               <b>{index}</b>
  //               {/* <SearchResultItems result={result} /> */}
  //             </>
  //           )
  //         })}
  //       </div>
  //     );
  //   }
  // }

  render() {
    const ctxState = this.context.state;
    const { results } = this.props;

    //If searching display skeleton
    if (this.props.searching)
      return (
        <>
                   <b>this.props.searching: {this.props.searching}</b>
                  <Divider/>
                  <b>this.state.searching: {this.state.searching}</b>
                  <Divider/>
                  <b>this.props.results.length: {results.length}</b>
                  <Divider/>
                  <b>this.props.resultsText: {this.props.resultsText}</b>
                  <Divider/>
                  <b>this.state.resultsText: {this.state.resultsText}</b>
                  <Divider/>
                  <b>this.props.hasSearched: {this.props.hasSearched}</b>      
                    <Divider/>
                  <b>this.state.hasSearched: {this.state.hasSearched}</b>     
                  <b>state.hasSearched {this.props.hasSearched}</b>  
                          <Divider/>
          <ResultsLayoutSkeleton />
            <Divider/>
          <ResultsLayoutSkeleton />
            <Divider/>
          <ResultsLayoutSkeleton />
        </>
      )
    //Search was attempted but got no results, display search tips
    else if (ctxState.hasSearched && (!this.props.results.length && !this.props.searching)) {
      return (
        <>
          <Typography variant="h4">
            {results.length} Results Found for "{this.props.titleRaw}"
          </Typography>
          <SearchTips />
        </>
      )
    }
    //If there are results, then diplay them
    else {

      return (
        <>
          {}
          {results.map((result, index) => {
            return (
              <Paper key={result.id}>
                <Box id="search-results-parent-container-box" border={1} borderColor={"#eee"} paddingTop={1} paddingBottom={1} >           
                <Typography paddingLeft={2} color={'primary'} variant='h4'>
                  <Link  onClick={this.onDetailLink(result.processId)}>{result.title}</Link>
                </Typography>
                  <b>this.props.searching: {this.props.searching}</b>
                  <Divider/>
                  <b>this.props.searching: {this.state.searching}</b>
                  <Divider/>
                  <b>this.props.results.length: {results.length}</b>
                  <Divider/>
                  <b>this.props.resultsText: {this.props.resultsText}</b>
                  <Divider/>
                  <b>this.state.resultsText: {this.state.resultsText}</b>
                  <Divider/>
                  <b>this.props.hasSearched: {this.props.hasSearched}</b>      
                    <Divider/>
                  <b>this.state.hasSearched: {this.state.hasSearched}</b>      
                    <Divider/>
                  <Box id="search-results-cards-container-box">
                    <SearchResultCards result={result} />
                  </Box>
                  <Box id="search-results-items-container-box">
                    <SearchResultItems result={result} />
                  </Box>

                </Box>
              </Paper>
            );
          }
          )}
        </>
      )
    }
  }

  componentDidMount() {
    // // Restore user's last viewed page in results if possible
    if (localStorage.unmountedPage) {
      try {
        this.page = localStorage.unmountedPage;
      } catch (e) {
        console.log(e);
      }
    }
  }
  componentWillUnmount() {
    // // Save last viewed page number so user doesn't lose their place on navigation
    localStorage.unmountedPage = this.page;
  }
  componentDidUpdate() {
    this.updateTableDebounced();
  }
}

// function uuidv4() {
//     let returnVal = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
//         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//     );
//     console.log('uuid',returnVal);

//     return returnVal;
// }
