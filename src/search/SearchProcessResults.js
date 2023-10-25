import { Box, Container, Divider, Paper, Skeleton, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from "@mui/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
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
//import { List,Collection ,AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { useVirtual } from 'react-virtual'
import SearchResultItem from "./SearchResultItem";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from "react-router-dom";

const _ = require("lodash");

const FULLSTYLE = {
  width: "100%",
  minWidth: "20%",
  maxWidth: "100%",
};
const styles = {
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
const testData = [{
  id: 1,
  title: 'Title 1'
},
{
  id: 2,
  title: 'title 2'
},
];
function cellSizeAndPositionGetter({ index }) {
  const cell = {
    height: cellHeight,
    width: cellWidth,
    y: index * cellHeight,
    x: Math.floor(Math.random() * 10) * cellWidth
  }
  return cell;
}
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
    console.log(`file: SearchProcessResults.js:101 ~ SearchProcessResults ~ constructor ~ props:`, props);
    const ctx = this.context;
    this.state = {
      //     ...state,
      showContext: true,
      size: 0,
      hidden: new Set(),
      listHeight: 300,
      listRowHeight: 50,
      overscanRowCount: 10,
      rowCount: this.props.results.length,
      scrollToIndex: undefined,
      showScrollingPlaceholder: false,
      useDynamicRowHeight: false,
    };
    window.addEventListener("resize", this.handleResize);
    Globals.registerListener("new_search", this.resetHidden);

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
  }

  onCheckboxChange = (evt) => {
    this.setState({
      showContext: evt.target.checked,
    });
  };

  setRowHeight(index, size) {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  scrollToBottom() {
    listRef.current.scrollToItem(results.length - 1, "end");
  }

  renderRow({ index, key, style, parent }) {
    console.log(`file: SearchProcessResults.js:318 ~ SearchProcessResults ~ renderRow ~ index, key, style, parent :`, index, key, style, parent);
    const result = this.props.results[index];
    return (
      <>
        <b>{key}</b>
        <b>index: {index}</b>
        <b>{JSON.stringify(result)}</b>
      </>
    )
  }

  getRowHeight(index) {
    return rowHeights.current[index] + 8 || 82;
  }

  RowVirtualizerVariable({ rows }) {
    const parentRef = React.useRef();

    const rowVirtualizer = useVirtual({
      size: rows.length,
      parentRef,
      estimateSize: React.useCallback((i) => 400, []),
      overscan: 5
    });
  }
  _noRowsRenderer() {
    return <div className={styles.noRows}>No rows</div>;
  }

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
          <SearchResultsMap
            toggleMapHide={this.props.toggleMapHide}
            isHidden={this.props.isMapHidden}
            docList={this.props.geoResults}
            results={this.props.results}
          // searcherState={this.props.searcherState}
          />
          <Grid container flex={1} id="search-result-row-box" xs={12}>
            <Typography variant="h3" padding={1}>Showing {ctxState.limit}  of {results.length} Results for "{ctxState.titleRaw}"</Typography>
            <Divider />
            <Box border={0} width={'100%'} id="search-result-row-container">
              {results.length && (
                <ResultRow results={results} />
              )}
              <Divider />
            </Box>
          </Grid>
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
  }
}

// function uuidv4() {
//     let returnVal = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
//         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//     );
//     console.log('uuid',returnVal);

//     return returnVal;
// }
const _noRowsRenderer = () => {
  return <div className={styles.noRows}>No rows</div>;
}

const ResultRow = (props) => {
  console.log(`file: SearchProcessResults.js:482 ~ ResultRow ~ props:`, props);
  // References
  const { results } = props;
  const listRef = useRef({});
  // const rowHeights = useRef({});
  const ctx = useContext(SearchContext);
  const { state } = ctx;
  // const { limit } = state.searcherInputs;
  // const [currentPage, setCurrentPage] = useState(0);
  const _mounted = useRef(false);
  // Functions

  useEffect(() => {
    _mounted.current = true;
    return (() => {
      _mounted.current = false
    })
  }, []);
  //const scrollToBottom = () => {
  //  listRef.current.scrollToIndex(0);
  //};
  // useEffect(() => {
  //   if (_mounted.current && results.length > 0) {
  //     scrollToBottom();
  //   }
  //     }, [results]);
  function getRowHeight(index) {
    const height = rowHeights.current[index] + 8 || 82;
    console.log(`file: SearchProcessResults.js:512 ~ getRowHeight ~ height:`, height);
    return height;
  }

  function getRowHeight(index) {
    return rowHeights[index] + 8 || 82;
  }

  return (
    <Paper border={0} style={{
      marginTop: 0,
    }} elevation={0} id="search-result-render-row-wrapper-paper">
      <Grid
        container
        id="search-result-row-grid-container"
        marginTop={1}
        borderTop={1}
        borderColor={'#ddd'}
        marginBottom={2} xs={12} flex={1}>
        {results.map((result, idx) => (
          <Grid item xs={12} key={result.id} id={`search-result-row-grid-item-${result.id}`}>
            <SearchResultCards result={result} />
            <SearchResultItem records={result.records} />
            <Divider />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

}