import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import React, { useContext, useState } from 'react';
import theme from '../styles/theme';
import SearchContext from './SearchContext';
//import './search.css';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 1,
  border: 0,
  borderRadius: 1,
  fontColor: "#000",
  fontFamily: 'open sans'
}));


const useStyles = makeStyles((theme) => ({
	centeredContent: {
		verticalAlign: 'center',
		textAlign: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		justifyItems: 'center',
		borderColor: '#ccc',
		border: 0,
		fontFamily: 'open sans',
	},
	autocomplete: {},
	resultsHeader: {
		fontFamily: 'open sans',
		fontSize: 50,
		fontWeight: 'bolder',
		padding: 4,
		margin: 2,
		fontColor: '#000',
	},
	resultItemHeader: {
		fontSize: 25,
		fontWeight: 'bold',
		margin: 0.5,
		padding: 1,
		elevation: 1,
		fontColor: '#000',
	},
	itemHeader: {
		fontFamily: 'open sans',
		fontSize: 40,
		fontWeight: 'bold',
		margin: 0.5,
		padding: 1,
		fontColor: '#000',
		elevation: 1,
		p: 1,
		'&:hover': {
			backgroundColor: '#ccc', //theme.palette.grey[200],
			boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.25)',
			cursor: 'pointer',
			'& .addIcon': {
				color: 'darkgrey',
			},
		},
		infoCard: {
			padding: 1,
			margin: 1,
			border: 1,
			borderColor: '#ddd',
		},
	},
}));

export default function SearchResultItems(props) {
  console.log("🚀 ~ file: SearchResultsItems.jsx:45 ~ SearchResultItems ~ props:", props);
  const { result, record } = props;
  //console.log("🚀 ~ file: SearchResultsItems.jsx:47 ~ SearchResultItems ~ result:", result);
  //console.log("🚀 ~ file: SearchResultsItems.jsx:47 ~ SearchResultItems ~ record:", record);
  const context = useContext(SearchContext);
  const {state} = context;
  console.log('searchResult Items state', state);


  //console.log('SearchResultItems vprops', props);
  //  const records = (props.result && props.result.records) ? props.result.records : [];

  //  console.log('search result records?', records);

  const sortByDate = (a, b) => {
    return a.commentDate > b.commentDate;
  }

  let sortedRecords = result.records.sort(sortByDate);
  //sortedRecords = result.records //result.records.sort(sortByDate);
  //console.log("🚀 ~ file: SearchResultsItems.jsx:63 ~ SearchResultItems ~ sortedRecords:", sortedRecords)

  //console.log("🚀 ~ file: SearchResultsItems.jsx:59 ~ SearchResultItems ~ sortedRecords:", sortedRecords)
  // const initialSearch = (records.length) ? records.sort(sortByDate): [];
  /* Merge doc and records */
  return (
    <>
      {/* <h2>Search Result Items Result?</h2>
    {JSON.stringify(result)} */}
      <Box marginTop={1} marginBottom={1} id="search-results-container-box">
          {sortedRecords.map((record, idx) => {
                {/* <Typography variant="searchResultSubTitle" padding={2}>{record.title}</Typography> */}
                <Item key={idx} className="search-result-item-container">
                  {/* {JSON.stringify(record)} */}
                  <Divider />
                  {/* <SearchResultItem record={record} /> */}
                  <Divider />
                </Item>
          })};
      </Box>
    </>
  );
}

export function SearchResultItem(props) {
  if (!props.record) {
    console.warn('No record received exiting, got props:', props);
  }
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  //  const { seachState, setState, showContext } = useContext(SearchContext);
  const classes = useStyles(theme);
  const context = useContext(SearchContext);
  const { state, setState } = context;
  const { record } = props;
  const onCheckboxChange = (evt) => {
    //console.log('Checkbox changed, setting showContext to ', evt.target.checked);
    setState({
      ...state,
      showContext: evt.target.checked,
    });
  };
  // console.log("🚀 ~ file: SearchResultsItems.jsx:129 ~ SearchResultItem ~ propss / record:", props)


  const {
    action,
    agency,
    commentDate,
    commentsFilename,
    cooperatingAgency,
    county,
    decision,
    documentType,
    filename,
    firstRodDate,
    luceneIds,
    id,
    link,
    name,
    notes,
    plaintext,
    state: resultState,
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
  //  { Object.keys(record) }
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
          <Typography fontSize={20} variant="h4" padding={2}>
            {title}
          </Typography>
        </>
        <Grid item id="year-box" borderRight={1}
          borderColor={"#bbb"}
          display={'flex'}
          xs={1}
          alignContent={'center'}
          justifyContent="center"
          alignItems={'center'}
          classes={classes.centeredContent}
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
          alignContent={'center'}
          justifyContent="center"
          alignItems={'center'}
          border={1}
          borderColor={'#111'}
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
//          borderRight={1}
          borderColor={'#bbb'}
          className={classes.centeredContent}
        >
          {title}
          {/* <RenderSnippets record={record} /> */}
        </Grid>
        <Grid
          display={'flex'}
          container
          borderColor={'#bbb'}
          borderLeft={0}
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
            borderRight={0}
            borderColor={'#bbb'}
          >
            {/* <PDFViewerDialog
              id="preview-button-grid-item"
              record={record}
              isOpen={isPDFViewOpen}
              onDialogClose={(evt) => closePDFPreview(evt, processId)}
            /> */}
            <Button
              onClick={(evt) => openPDFPreview(evt, processId)}
              //color={'secondary'}
              variant="outlined"
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
            {(processId)
              // <PDFViewerDialog
              //   processId={processId}
              //   record={record}
              //   isOpen={isPDFViewOpen}
              //   onDialogClose={(evt) => closePDFPreview(evt, processId)}
              // />
            }
            <Button
              onClick={(evt) => openPDFPreview(evt, processId)}
              color={'secondary'}
              display={'flex'}
              variant={'outlined'}
            >
              
              Download
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} border={0}>
          <b>Snippets go here</b>
          {/* <h4>Snippets??? {JSON.stringify(record.plaintext)}</h4>*/}
          <RenderSnippets record={record} />
        </Grid>
      </Grid>
    </>
  );
}

export function DisplayGrid(props) {
  //    console.log("🚀 ~ file: SearchResultsItems.jsx:303 ~ DisplayGrid ~ props:", props)
  const [state, setState] = useContext(SearchContext);
  const { result } = props.result;
  const { processId, documentType } = result;
  //  console.log("🚀 ~ file: SearchResultsItems.jsx:316 ~ DisplayGrid ~ result:", result)

  const openPDFPreview = (evt, processId) => {
    this.setState({ showPDFDialog: true })
    evt.preventDefault();
  };
  const classes = useStyles(theme);

  return (
    <>
      {/* {JSON.stringify(result)} */}

      <Grid item xs={1} className={classes.centeredContent} borderRight={1} borderColor={"#ddd"}>
        2022
      </Grid>
      <Grid xs={2}
        borderRight={1}
        borderLeft={1}
        borderColor={"#ddd"}>
        <Typography
        textAlign={'center'}
        justifySelf={'center'}
        id="status-typography"
        fontWeight={'bold'}
      >
        {documentType} ?????
      </Typography> </Grid>
      <Grid item xs={6} className={classes.centeredContent} border={1} borderColor={"red"}>Space</Grid>
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
            variant="outlined"
            display={'flex'}>
            Download PDFs
          </Button>
        </Grid>

      </Grid>
    </>
  )
}

export function RenderSnippets(props) {
  const {
    record
  } = props;
    console.log('RenderSnippets props', props);
  const { state, setState } = useContext(SearchContext);


  //  console.log("🚀 ~ file: SearchResultsItems.jsx:343 ~ RenderSnippets ~ record:", record)
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { hideText, hidden } = state;

  function convertToHTML(content) {
    return { __html: content };
  }
  function toggleContentExpansion(evt, id) {
    //console.log(`toggleContentExpansion id: ${id} evt~ evt`, evt);
    //console.log('Setting isContentExpanded to',!isContentExpanded);
    setIsContentExpanded(!isContentExpanded);
    evt.preventDefault();
  }
  return (
    // useEffect(() => {
    //   console.log('useEffect for content expanded');
    // },[isContentExpanded]);
    record.plaintext.map((text, idx) => {
      return (
        <b>record.processId - record.id - recorc.</b>
      )
    }))
}

export function Snippets(props) {
  const { text, hidden, isContentExpanded, id, processId } = props;
  function convertToHTML(content) {
    return { __html: content };
  }
  function toggleContentExpansion(evt, id) {
    console.log(`Content Expansion Called for id ${id} evt:`, evt);
  }
  return (
    <>
      <Box className={'content-snippets--result-item-container'}>
        <Divider />
        <b>{text}</b>
        <Divider />
        {/* {JSON.stringify(props)} */}
        <Box>
          {(text.length > 0)
            &&
            <div dangerouslySetInnerHTML={convertToHTML(text)} />
          }
        </Box>
        <Box padding={1}>
          {isContentExpanded && text && text.length <= 100
            &&
            <div dangerouslySetInnerHTML={convertToHTML(text)} />
          }
          {!isContentExpanded && text && text.length >= 100
            ? (
              <div dangerouslySetInnerHTML={convertToHTML(text.substring(0, 100) + '...')} />
            ) : (
              <div></div>
            )}
        </Box>
      </Box>
      <Box
        id="click-to-see-more-box"
        width={'100%'}
        alignContent={'center'}
        textAlign={'center'}
        justifyContent={'center'}
        onClick={(evt) => toggleContentExpansion(evt,)}
        bgcolor="#A2A5A6"
        paddingTop={1}
        paddingBottom={1}
      >
        {isContentExpanded && text.length >= 100
          ? (
            <Typography variant="expanderButton">
              Click to See less
            </Typography>
          ) : (
            <Typography variant="expanderButton">Click to to See More...</Typography>
          )}
      </Box>
      : (
        <Typography align='center'>This document's content is not available</Typography>

      )
    </>
  )
}
