import { Box,Container, Divider, Link, Grid, Paper, Skeleton, Typography } from "@mui/material";
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
import SearchResultsMap from './SearchResultsMap';
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
    console.log(`file: SearchProcessResults.js:66 ~ SearchProcessResults ~ constructor ~ props:`, props);
    // console.log(
    //   "🚀 ~ file: SearchProcessResults.js:41 ~ SearchProcessResults ~ constructor ~ props:",
    //   props
    // );
    const ctx = this.context;
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
  render() {
    const ctxState = this.context.state;
    const { results } = this.props;

    //If searching display skeleton
    if (this.props.searching)
      return (
        <>
          <ResultsLayoutSkeleton />
          <Divider />
          <ResultsLayoutSkeleton />
          <Divider />
          <ResultsLayoutSkeleton />
        </>
      )
    //Search was attempted but got no results, display search tips
    else if ((this.props.titleRaw && ctxState.hasSearched) && (!this.props.results.length && !this.props.searching)) {
      return (
        <>
          <Typography variant="h4">
            {results.length} Results Found for "{ctxState.titleRaw}"
          </Typography>
          <SearchTips />
        </>
      )
    }
    //If there are results, then diplay them
    else {

      return (
        <>
          {/* {Object.keys(ctxState).map(key => {
            return (
              <div key={key}><b>{key}:</b> {typeof(ctxState[key]) != "array" && typeof(ctxState[key]) != "object" ? ctxState[key] : JSON.stringify(ctxState[key])}</div>
            )
          })} */}
          <Typography padding={1}>{results.length} results found for "<b>{ctxState.titleRaw}</b>" </Typography>
          <Grid item xs={12}>
            <SearchResultsMap
              toggleMapHide={this.props.toggleMapHide}
              isHidden={this.props.isMapHidden}
              docList={this.props.geoResults}
              results={this.props.results}
            // searcherState={this.props.searcherState}
            />
          </Grid>
          
          {results.map((result, index) => {
            return (
              <Paper  margin={10} elevation={1} borderColor={"#000"} key={result.id}>
                <Box id="search-results-parent-container-box" border={0} borderColor={"#eee"} padding={1} >
                  {/* Title and link for each result */}
     
                  <Box id="search-results-cards-container-box">
                    <SearchResultCards result={result} />
                  </Box>
                  <Box id="search-results-items-container-box">
                    <SearchResultItems onDetailLink={this.onDetailLink}  result={result} />
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
