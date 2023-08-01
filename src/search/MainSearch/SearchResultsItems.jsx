import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useContext, useState,useEffect } from 'react';
import theme from '../../styles/theme';
import PDFViewerDialog from './PDFViewerDialog';
import SearchContext from './SearchContext';
import SearchTips from './SearchTips';
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
        borderColor:'#ccc',
        border:1,

  },
  autocomplete: {},
});

const sortByDate = (a, b) => {
  if (a.record && a.record.commentDate && b.record && b.record.commentDate) {
    return a.commentDate > b.commentDate;
  } else if (a.commentDate && a.commentDate) {
    return a.commentDate > b.commentDate;
  }
};
export default function SearchResultItems(props) {
  const { showContext } = useContext(SearchContext);
  const classes = useStyles(theme);


  //console.log('SearchResultItems vprops', props);
  let result = props.result || [];
  const { doc, records } = result;
  //console.log('search result records?', records);
  let sortedRecords = [];
  function sortByDate(a, b) {
    //console.log('A > B', a, b);
    a.commentDate > b.commentDate;
  }
  if (records && records.length) {
    sortedRecords = records.sort(sortByDate);
  }
  if (result.doc && result.doc.commentDate) {
    sortedRecords = result;
  }

  // const initialSearch = (records.length) ? records.sort(sortByDate): [];
  /* Merge doc and records */
  return (
    <>
      {/* <h2>Search Result Items Result?</h2>
    {JSON.stringify(result)} */}
      <Box marginTop={1} marginBottom={1} id="search-results-container-box">
        {result && result.records && result.records.length ? (
          result.records.map((record, idx) => {
            return (
              <Item key={idx} className="search-result-item-container">
                <SearchResultItem record={record} />
                <Divider/>
              </Item>
            );
          })
        ) : (
          <div>
            <Typography>
              No results Found
            </Typography>
            <SearchTips/>

          </div>
        )}
      </Box>
    </>
  );
}

export function SearchResultItem(props) {
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { seachState, setSearchState, showContext } = useContext(SearchContext);
  const classes= useStyles(theme);
  
  const onCheckboxChange = (evt) => {
    //console.log('Checkbox changed, setting showContext to ', evt.target.checked);
    setSearchState({
      ...searchState,
      showContext: evt.target.checked,
    });
  };

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
  } = record;

  function onDocumentLoadSuccess({ numPages }) {
    setSearchState({ ...searchState, numPages: numPages });
    setNumPages(numPages);
  }
  function openPDFPreview(evt,id) {
    console.log(`Open PDF for ID: ${id} evt: `, evt);
    setIsPDFViewOpen(true);
    evt.preventDefault();
  }
  function closePDFPreview(evt,id) {
    setIsPDFViewOpen(false);
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
        border={1}
        borderColor={'#ccc'}
        className={classes.centeredContent}
        xs={12}
        //      border={1}
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
          xs={1}
          alignContent={'center'}
          justifyContent="center"
          alignItems={'center'}
          borderRight={1}
          borderLeft={1}
          borderColor={'#ccc'}
          className={classes.centeredContent}
        >
          <Typography
            id="status-typography"
            sx={{
              alignContent: 'center',
              justifyItems: 'center',
              border: 0,
              borderColor: '#ccc',
            }}
            fontWeight={'bold'}
          >
            {documentType}
          </Typography>
        </Grid>
        <Grid
          display={'flex'}
          container
          id="button-grid-container"
          xs={7}
          flex={1}
          // borderColor={'#ccc'}
          // border={1}
          borderLeft={0}
          borderTop={0}
          borderBottom={0}
          borderRight={1}
          borderColor={'#ccc'}
          className={classes.centeredContent}
        >
          <RenderSnippets record={record} />
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
            <PDFViewerDialog
              id="preview-button-grid-item"
              record={record}
              isOpen={isPDFViewOpen}
              onDialogClose={(evt) => closePDFPreview(evt,id)}
            />
            <Button
              onClick={(evt) => openPDFPreview(evt, id)}
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
            <PDFViewerDialog
              id={id}
              record={record}
              isOpen={isPDFViewOpen}
              onDialogClose={(evt) => closePDFPreview(evt, id)}
            />
            <Button
              onClick={(evt) => openPDFPreview(evt,id)}
              color={'secondary'}
              display={'flex'}> 
              Download
            </Button>
          </Grid>
        </Grid>
      </Grid>
   </>
  );
}

export function RenderSnippets(props){
    const { record } = props;
    const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
    const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { seachState, setSearchState, showContext } = useContext(SearchContext);
    function convertToHTML(content) {
      return { __html: content };
    }
    record.plaintext.push(
      'nim sed faucibus turpis in eu mi bibendum neque egestas congue quisque egestas diam in arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc sed blandit libero volutpat sed cras ornare arcu dui vivamus arcu felis bibendum ut tristique et egestas quis ipsum',
    );
    function toggleContentExpansion(evt, id) {
      console.log(`toggleContentExpansion id: ${id} evt~ evt`, evt);
      console.log('Setting isContentExpanded to',!isContentExpanded);
      setIsContentExpanded(!isContentExpanded);
      evt.preventDefault();
  }
  // useEffect(() => {
  //   console.log('useEffect for content expanded');
  // },[isContentExpanded]);
  return (
    <>

      <Box className={'search-result-item-container'}>
        <Box padding={1}>
          {isContentExpanded && record.plaintext[0] && record.plaintext[0].length >= 100 ? (
            <div dangerouslySetInnerHTML={convertToHTML(record.plaintext[0])} />
          ) : record.plaintext[0] && record.plaintext[0].length >= 100 ? (
            `${record.plaintext[0].substring(0, 100)}...`
          ) : (
            <div></div>
          )}
        </Box>
      </Box>
      {record.plaintext[0] && record.plaintext[0].length ? (
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
          <Typography>This document's content is not available</Typography>
        </>
      )}
    </>
  );
}
