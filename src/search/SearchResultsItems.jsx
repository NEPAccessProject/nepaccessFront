import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import theme from '../styles/theme';
import PDFViewerDialog from './Dialogs/PDFViewerDialog';
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
  //console.log("🚀 ~ file: SearchResultsItems.jsx:45 ~ SearchResultItems ~ props:", props);
  const { result, record } = props;
  //console.log("🚀 ~ file: SearchResultsItems.jsx:47 ~ SearchResultItems ~ result:", result);
  //console.log("🚀 ~ file: SearchResultsItems.jsx:47 ~ SearchResultItems ~ record:", record);
  const context = useContext(SearchContext);
  const {state} = context;
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
                return(<Item key={idx} className="search-result-item-container">
                  {/* {JSON.stringify(record)} */}
                  <Divider />
                  <SearchResultItem record={record} />
                  <Divider />
                </Item>)
          })};
      </Box>
    </>
  );
}

export function SearchResultItem(props) {
  console.log("🚀 ~ file: 126 ~ SearchResultItem ~ props:", props)
  if (!props.record) {
    console.warn('No record received for SearchResultItem exiting, got props:', props);
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
  const _mounted = useRef(false);

  useEffect(()=>{
    console.log('SearchResultItem is being mounted');
    _mounted.current = true;
    return (()=> {
      console.log('UnMounted SearchResyltItem');
      _mounted.current = false
    })
  },[])

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
        
          {/* <Typography variant="h5" fontColor="#000" fontSize={18} padding={2}>
           {title} {' '}
          </Typography> */}
        </>
        <Grid item id="year-box" 
          borderRight={1}
          borderColor={"#ccc"}
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
          borderRight={1}
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
          borderRight={1}
          borderLeft={1}
          borderColor={'#ccc'}
          //className={classes.centeredContent}
          id="snippets-grid-container"
          xs={6}
          padding={1}
          flex={1}
          >
          <Typography fontColor='black' fontSize={18} variant='h5'>{(title) ? title : ''}</Typography>
          {/* <RenderSnippets record={record} /> */}
        </Grid>
        <Grid
          display={'flex'}
          container
          borderColor={'#ccc'}
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
            { processId &&
              <PDFViewerDialog
                processId={processId}
                record={record}
                isOpen={isPDFViewOpen}
                onDialogClose={(evt) => closePDFPreview(evt, processId)}
              />
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
      <Grid item xs={6} className={classes.centeredContent} border={0} borderColor={"red"}>Space</Grid>
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
    console.log('RenderSnippets props.record', record);
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
        <>
        <h5>{idx} -  Snippets here</h5>
          <Snippets text={text} />
        </>
      )
    }))
}

export function Snippets(props) {
  const { text, hidden, isContentExpanded, id, processId } = props;
  console.log("🚀 ~ file: SearchResultsItems.jsx:462 ~ Snippets ~ props:", props, `Snipets length is ${text.length}`)
  function convertToHTML(content) {
    return { __html: content };
  }
  function toggleContentExpansion(evt, id) {
    console.log(`Content Expansion Called for id ${id} evt:`, evt);
  }
  return (
    <>
      <Box backgroudCcolor="#A2A5A6">
      {text.length > 99
        ? 
          <Box border={1} backgroudColor="#A2A5A6">
            <div dangerouslySetInnerHTML={convertToHTML(text.slice(0,255))} />
            <Box width={'100%'} backgroudColor={'#000'}>
              <Typography variant="expanderButton">
                <Button>Click to See More</Button>
              </Typography>
            </Box>
        </Box>
          : 
          <Box width={'100%'}
            backgroudColor="#A2A5A6"
            alignContent={'center'}
            textAlign={'center'}
            justifyContent={'center'}
            onClick={(evt) => toggleContentExpansion(evt,)}

            paddingTop={1}
            paddingBottom={1}>
            <Typography variant="expanderButton">
              <Button>Click to See more</Button>
            </Typography>
          </Box>
      }
        </Box>

      {/* <Box className={'content-snippets--result-item-container'}>
        <Divider />
        <Box>
          {(text.length > 0)
            &&
            <Box border={1}><div dangerouslySetInnerHTML={convertToHTML(text)} /></Box>
          }
        </Box>
        <Box padding={1}>
          {isContentExpanded && text && text.length <= 100
            &&
            <div dangerouslySetInnerHTML={convertToHTML(text)} />
          }
          {!isContentExpanded && text && text.length >= 100
            && (
              <div dangerouslySetInnerHTML={convertToHTML(text.substring(0, 100) + '...')} />
            ) 
            }
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
          ? 
            <Typography variant="expanderButton">
              Click to See less
            </Typography>
          : 
            <Typography color={'#fff'} variant="expanderButton">Click to to See More...</Typography>
        }
      </Box>
        <Typography align='center'>This document's content is not available - {text.length} </Typography> */}

    </>
  )
}
