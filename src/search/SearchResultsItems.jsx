import React, { useContext, useState } from 'react';
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../styles/theme';
import PDFViewerDialog from './Dialogs/PDFViewerDialog';
import SearchContext from './SearchContext';
import SearchTips from './Dialogs/SearchTips';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 1,
  mt: 1,
  mb: 1,
  pl: 0,
  pr: 0,
  '&:hover': {
    // //           backgroundColor: //theme.palette.grey[200],
    // boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.25)',
    // backgroundColor: '#eee',
    // cursor: 'pointer',
    // '& .addIcon': {
    //   color: 'darkgrey',
    // },
  },
}));

const useStyles = (theme) => ({
  centeredContent: {
    verticalAlign: 'center',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    borderColor: '#ccc',
    border: 1,

  },
  autocomplete: {},
});


export default function SearchResultItems(props) {
  console.log("🚀 ~ file: SearchResultsItems.jsx:45 ~ SearchResultItems ~ props:", props)
  const context = useContext(SearchContext);
  const classes = useStyles(theme);


  //console.log('SearchResultItems vprops', props);
  let result = props.result || [];
  console.log("🚀 ~ file: SearchResultsItems.jsx:51 ~ SearchResultItems ~ result:", result)
  const records = (props.result && props.result.records) ? props.result.records : [];
  console.log("🚀 ~ file: SearchResultsItems.jsx:54 ~ SearchResultItems ~ records:", records)

  //  console.log('search result records?', records);
  let sortedRecords = [];
  
  const sortByDate = (a, b) => {
    return a.commentDate > b.commentDate;
    }

  //  sortedRecords = result.records.sort(sortByDate);
  sortedRecords = result.records.sort(sortByDate);
  console.log("🚀 ~ file: SearchResultsItems.jsx:63 ~ SearchResultItems ~ sortedRecords:", sortedRecords)

  //console.log("🚀 ~ file: SearchResultsItems.jsx:59 ~ SearchResultItems ~ sortedRecords:", sortedRecords)
  // const initialSearch = (records.length) ? records.sort(sortByDate): [];
  /* Merge doc and records */
  return (
    <>
      {/* <h2>Search Result Items Result?</h2>
    {JSON.stringify(result)} */}
      <Box marginTop={1} marginBottom={1} id="search-results-container-box">
        {sortedRecords && sortedRecords.length ? (
          sortedRecords.map((record, idx) => {
            return (
              <>
                {/* <Typography variant="searchResultSubTitle" padding={2}>{record.title}</Typography> */}
                <Item key={idx} className="search-result-item-container">
                  {JSON.stringify(record)}
                  <Divider/>
                  {/* <SearchResultItem record={record} /> */}
                  <Divider />
                </Item>
              </>
            );
          })
        ) : (
          <div>
            <Typography>
              No results Found
            </Typography>
            <SearchTips />

          </div>
        )}
      </Box>
    </>
  );
}

export function SearchResultItem(props) {
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
//  const { seachState, setState, showContext } = useContext(SearchContext);
  const classes = useStyles(theme);
  const context = useContext(SearchContext);
 const {state,setState} = context;
  const onCheckboxChange = (evt) => {
    //console.log('Checkbox changed, setting showContext to ', evt.target.checked);
    setState({
      ...state,
      showContext: evt.target.checked,
    });
  };
  console.log("🚀 ~ file: SearchResultsItems.jsx:129 ~ SearchResultItem ~ propss / record:", props)

  const { record } = props;

  const {
    agency,
    commentDate,
    commentsFilename,
    cooperatingAgency,
    county,
    documentType,
    filename,
    id,
    name,
    notes,
    plaintext,
    status,
    subtype,
    title,
    processId,
  } = record;

  function onDocumentLoadSuccess({ numPages }) {
    setState({ ...state, numPages: numPages });
  }
  // function openPDFPreview(evt, processId) {
  //   console.log(`Open PDF for ID: ${id} evt: `, evt);
  //   setIsPDFViewOpen(true);
  //   evt.preventDefault();
  // }
  function closePDFPreview(evt, processId) {
    setState({ ...state, showPDFDialog: false });
  }
  const openPDFPreview = (evt, processId) => {
    setState({ ...state, showPDFDialog: true });
  }

  const handleDownloadClick = (evt, id) => {
    evt.preventDefault();
    //console.log('Download ID Value and filename', id, filename);
  };
  

  const year = commentDate && commentDate.length > 0 ? new Date(commentDate).getFullYear() : 'N/A';
  //console.log('SEARCH STATE SearchResultComponent');
  const text = record.plaintext || '';
  return (
    <>
      <Grid
        container
        id="search-result-item-root-item"
        flex={1}
        flexGrow={1}
        border={0}
        borderColor={'#ccc'}
        className={classes.centeredContent}
        xs={12}
        //      border={0}
        sx={{
          marginTop: 2,
          marginBottom: 2,
          elevation: 0,
        }}
      >
        <>
          {/* <Typography variant="searchResultSubTitle" padding={2}>
            {documentType} - {title}
          </Typography> */}
        </>
        <Grid item id="year-box" display={'flex'} xs={1} alignContent={'center'} justifyContent="center" alignItems={'center'} borderRight={0} classes={classes.centeredContent}
        >
          <Typography
            id="year-typography"
            sx={{
              alignContent: 'center',
              justifyItems: 'center',
            }}
            className={classes.centeredContent}
            fontWeight={'bold'}
          >
            {year ? year : 'N/A'}
          </Typography>
        </Grid>

        <Grid
          item
          id="status-box"
          display={'flex'}
          xs={2}
          alignContent={'center'} justifyContent="center" alignItems={'center'}
          borderRight={1}
          borderLeft={1}
          borderColor={'#ccc'}
          className={classes.centeredContent}
        >
          <Typography
            textAlign={'center'}
            justifySelf={'center'}
            id="status-typography"
            fontWeight={'bold'}
          >
            {documentType}
          </Typography>
        </Grid>
        <Grid
          display={'flex'}
          container
          id="button-grid-container"
          xs={6}
          flex={1}
          // borderColor={'#ccc'}
          // border={0}
          borderLeft={0}
          borderTop={0}
          borderBottom={0}
          borderRight={1}
          borderColor={'#ccc'}
          className={classes.centeredContent}
        >
          {/* <RenderSnippets record={record} /> */}
        </Grid>
        <Grid
          display={'flex'}
          container
          id="button-grid-container"
          xs={3}
          flex={1}
        //       className={classes.centeredContent}
        >
          <Grid
            id="preview-button-grid-item"
            item
            //          display={'flex'}
            xs={6}
            display={'flex'}
            alignContent={'center'}
            justifyContent="center"
            alignItems={'center'}
          >
            {/* <PDFViewerDialog
              id="preview-button-grid-item"
              record={record}
              isOpen={isPDFViewOpen}
              onDialogClose={(evt) => closePDFPreview(evt, processId)}
            /> */}
            <Button
              onClick={(evt) => openPDFPreview(evt, processId)}
              color={'secondary'}
            >
              Preview
            </Button>
          </Grid>
          <Grid
            id="preview-button-grid-item"
            item
            //         display={'flex'}
            xs={6}
            border={0}
            alignContent={'center'}
            justifyContent="center"
            alignItems={'center'}
            display={'flex'}
          >
            {(processId) &&
              <PDFViewerDialog
                processId={processId}
                record={record}
                isOpen={isPDFViewOpen}
                onDialogClose={(evt) => closePDFPreview(evt, processId)}
              />}
            <Button
              onClick={(evt) => openPDFPreview(evt, processId)}
              color={'secondary'}
              display={'flex'}>
              Download
            </Button>
          </Grid>
        </Grid>
        <Grid item > <RenderSnippets/> </Grid>
      </Grid>
    </>
  );
}





export function DisplayGrid(props) {
    console.log("🚀 ~ file: SearchResultsItems.jsx:303 ~ DisplayGrid ~ props:", props)
    const classes = useStyles(theme);
    const [state,setState] = useContext(SearchContext);
    const {documentType,processId} = props.record;

    const openPDFPreview = (evt, processId) => {
        this.setState({showPDFDialog: true})
        evt.preventDefault();
    };

  return (
    <>
    {JSON.stringify(props.record)}

      <Grid item xs={1} className={classes.centeredContent} borderRight={1} borderColor={"#ddd"}>
        2022
      </Grid>
      <Grid xs={2} borderRight={1} borderColor={"#ddd"}>           <Typography
        textAlign={'center'}
        justifySelf={'center'}
        id="status-typography"
        fontWeight={'bold'}
      >
        {documentType}
      </Typography> </Grid>
      <Grid item xs={6} className={classes.centeredContent} borderRight={1} borderColor={"#ddd"}>Space</Grid>
      <Grid container display={'flex'} xs={3} className={classes.centeredContent} border={0}>
        <Grid item xs={6}
          border={0}
          alignContent={'center'}
          justifyContent="center"
          alignItems={'center'}
          display={'flex'}>
          <Button
            onClick={(evt) => openPDFPreview(evt, processId)}
            color={'secondary'}
          >
            Preview
          </Button>
        </Grid>
        <Grid xs={6}
          id="preview-button-grid-item"
          item
          //         display={'flex'}
          border={0}
          alignContent={'center'}
          justifyContent="center"
          alignItems={'center'}
          display={'flex'}>
          <Button
            onClick={(evt) => openPDFPreview(evt, processId)}
            color={'secondary'}
            display={'flex'}>
            Download
          </Button>
        </Grid>

      </Grid>
    </>
  )
}

export function RenderSnippets(props) {
  console.log("🚀 ~ file: SearchResultsItems.jsx:345 ~ RenderSnippets ~ props:", props)
  const { 
    record
   } = props;

  console.log("🚀 ~ file: SearchResultsItems.jsx:343 ~ RenderSnippets ~ record:", record)
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { state, setState, showContext } = useContext(SearchContext);
  const { hideText, hidden } = state;

   if(!record){
    console.warn('render Snippets did not receive a record from returning, props:',props);
    return;
   }
  //console.log(`${record.title} plaintext`, record.plaintext)
  function convertToHTML(content) {
    return { __html: content };
  }
  function toggleContentExpansion(evt, id) {
    //console.log(`toggleContentExpansion id: ${id} evt~ evt`, evt);
    //console.log('Setting isContentExpanded to',!isContentExpanded);
    setIsContentExpanded(!isContentExpanded);
    evt.preventDefault();
  }
  // useEffect(() => {
  //   console.log('useEffect for content expanded');
  // },[isContentExpanded]);
  if (!hidden) {
    return (
      <>

        <Box className={'search-result-item-container'}>
          {/* {JSON.stringify(props)} */}
          <b>FUCCCCKKKKK</b>
          {/* <Box>              
            {(record.plaintext && record.plaintext.length > 0)
            &&
            <div dangerouslySetInnerHTML={convertToHTML(record.plaintext[0])} />
  }
</Box> */}
          {/* <Box padding={1}>
            {isContentExpanded && record && record.plaintext[0] && record.plaintext[0].length >= 100 
            ? (
              <div dangerouslySetInnerHTML={convertToHTML(record.plaintext[0])} />
            ) : record && record.plaintext[0] && record.plaintext[0].length >= 100
              ? (
                <div dangerouslySetInnerHTML={convertToHTML(record.plaintext[0].substring(0, 100) + '...')} />
            ) : (
              <div></div>
            )}
          </Box> */}
        </Box>
        {!hidden && record && record.plaintext && record.plaintext[0].length ? (
          <Box
            id="click-to-see-more-box"
            width={'100%'}
            alignContent={'center'}
            textAlign={'center'}
            justifyContent={'center'}
            onClick={(evt) => toggleContentExpansion(evt, record.id)}
            bgcolor="#A2A5A6"
            paddingTop={1}
            paddingBottom={1}
          >
            {isContentExpanded && record.plaintext[0] && record.plaintext[0].length >= 100 ? (
              <Typography variant="expanderButton">
                Click to See less
              </Typography>
            ) : (
              <Typography variant="expanderButton">Click to to See More...</Typography>
            )}
          </Box>
        ) : (
          <>
            <Typography align='center'>This document's content is not available</Typography>
            
          </>
        )}
      </>
    );
  }
  else {
    return (<>Nothing</>)
  }
}
