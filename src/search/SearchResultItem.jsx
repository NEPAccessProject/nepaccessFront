import { Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import theme from '../styles/theme.js';
import PDFViewerDialog from './Dialogs/PDFViewerDialog';
import SearchContext from './SearchContext';
import RenderSnippets from './SearchResultSnippets.jsx';


const useStyles = makeStyles((theme) => ({
  centeredContent: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardGridItem: {
    fontSize: "1rem",
    fontWeight: 'bold',
  }
}));

export default function SearchResultItem(props) {

    console.log("🚀 ~ file: 126 ~ SearchResultItem ~ props:", props)
    if (!props.record) {
      console.warn('!!!!!! 36 - No record received for SearchResultItem exiting, got props:', props);
    }
    const [isPDFViewOpen, setIsPDFViewOpen] = useState(true);
    //  const { seachState, setState, showContext } = useContext(SearchContext);
    const classes = useStyles(theme);
    const context = useContext(SearchContext);
    const { state, setState } = context;
    const _mounted = useRef(false);
    const { record } = props;
    const onCheckboxChange = (evt) => {
      //console.log('Checkbox changed, setting showContext to ', evt.target.checked);
      setState({
        ...state,
        showContext: evt.target.checked,
      });
    };
    // console.log("🚀 ~ file: SearchResultsItems.jsx:129 ~ SearchResultItem ~ propss / record:", props)
  
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
      function togglePDFPreview(processId) {
      console.log(`Toggle PDF from  ${processId} - isPDFViewOpen`, isPDFViewOpen);
      setIsPDFViewOpen(!isPDFViewOpen);
    }
    const handleDownloadClick = (evt, id) => {
      evt.preventDefault();
      //console.log('Download ID Value and filename', id, filename);
    };
  
    const onDetailLink = (evt,processId) => {
    console.log("🚀 ~ file: SearchResultsItems.jsx:193 ~ onDetailLink ~ evt,processId:", evt,processId)
  
    }

    const year = commentDate && commentDate.length > 0 ? new Date(commentDate).getFullYear() : 'N/A';
    //console.log('SEARCH STATE SearchResultComponent');
    //  { Object.keys(record) }
    const text = record.plaintext || '';    
    return (
      <>
        <Grid container border={1} borderColor={'#ccc'} id="search-result-grid-container">
          <Grid
            container
            id="search-result-grid-item"
            flex={1}
            flexGrow={1}
            className={classes.centeredContent}
            xs={12}
            sx={{
            }}
          >  
            <Grid container border={1} borderColor="#ccc" id="search-result-row-container"
            textAlign={'center'} justifyContent={'center'}>
              <Grid  item id="year-box" 
                xs={1}
                borderColor={'#ccc'}
//                borderRight={1}
                classes={classes.cardGridItem}
                display={'flex'}
                alignContent={'center'}
                justifyContent="center"
                alignItems={'center'}
              >
                <Typography
                  id="year-typography"
                  sx={{
                    // alignContent: 'center',
                    // justifyItems: 'center',
                    // jistifyContent: 'center',
                    // alignItems: 'center',
                    // textAlign: 'center',
                  }}   
                className={classes.centeredContent}
                  fontWeight={'bold'}
                >
                  {year ? year : 'N/A'}
                </Typography>
              </Grid>
      
              <Grid
                item
                id="status-document-type-grid-item"
                display={'flex'}
                xs={1}
                alignContent={'center'}
                justifyContent="center"
                alignItems={'center'}
     
                className={classes.centeredContent}
              >
                <Typography
                  className={classes.card}
                >
                  {documentType}
                </Typography>
              </Grid>
              <Grid
                display={'flex'}
                container
  //              border={1}
                borderRight={1}
                borderLeft={1}
                borderColor={'#ccc'}
                //className={classes.centeredContent}
                id="title-grid-container"
                xs={7}
                padding={1}
                flex={1}
                >
                <Typography id="snippets-title" variant='h4' >{(title) ? title  : ''}</Typography>
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
                  id="pdf-button-grid-item"
                  item
                  //          display={'flex'}
                  xs={6}
                  display={'flex'}
                  alignContent={'center'}
                  justifyContent="center"
                  alignItems={'center'}
                  borderColor={'#bbb'}
                >
                  <PDFViewerDialog
                    id="pdf-viewer-dialog"
                    record={record}
                    isOpen={isPDFViewOpen}
                    onDialogClose={setIsPDFViewOpen(false)}
                  />
                  <Button
                    //onClick={setIsPDFViewOpen(!isPDFViewOpen)}
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
                    onDialogClose={(evt) => togglePDFPreview(processId)}
                    />
                  }
                  <Button
                    onClick={(processId) => togglePDFPreview(processId)}
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
            </Grid>
        </Grid>
      </>
    );
  }