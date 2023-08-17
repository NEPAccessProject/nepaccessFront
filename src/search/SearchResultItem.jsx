import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { makeStyles,withStyles } from '@mui/styles';
import theme from '../styles/theme.js';
import SearchContext from './SearchContext';
import PDFViewerDialog from './Dialogs/PDFViewerDialog';
import RenderSnippets from './SearchResultSnippets.jsx';


const useStyles = makeStyles((theme) => ({
  subTitle: {
    fontSize: '0.9rem',
    textAlign : 'center',
    padding:10,
    margin:10,
    fontColor: 'red',
    border: 5,

  },
  centeredContent: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardGridItem: {
    color: 'green',
    fontSize: "1rem",
    fontWeight: 'bold',
  }
}));

export default function SearchResultItem(props) {
    console.log("🚀 ~ file: 126 ~ SearchResultItem ~ props:", props)
    if (!props.record) {
      console.warn('No record received for SearchResultItem exiting, got props:', props);
    }
    const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
    //  const { seachState, setState, showContext } = useContext(SearchContext);
    const classes = useStyles(theme);
    console.log("🚀 ~ file: SearchResultItem.jsx:34 ~ SearchResultItem ~ classes:", classes)
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
  
    const onDetailLink = (evt,processId) => {
    console.log("🚀 ~ file: SearchResultsItems.jsx:193 ~ onDetailLink ~ evt,processId:", evt,processId)
  
    }


  
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
            xs={1}
    
            classes={classes.cardGridItem}
          >
            <Typography
              id="year-typography"
              sx={{
                alignContent: 'center',
                justifyItems: 'center',
                borderRight:1,
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
            borderLeft={1}
            borderColor={'#ccc'}
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
            borderRight={1}
            borderLeft={1}
            borderColor={'#ccc'}
            //className={classes.centeredContent}
            id="snippets-grid-container"
            xs={6}
            padding={1}
            flex={1}
            >
            <Typography className={classes.subTitle} >{(title) ? title  : ''}</Typography>
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