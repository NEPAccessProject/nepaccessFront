import { Button, Divider, Typography,Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { makeStyles } from '@mui/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import theme from '../styles/theme';
import PDFViewerDialog from './Dialogs/PDFViewerDialog';
import SearchContext from './SearchContext';
import RenderSnippets from './SearchResultSnippets.jsx';


const useStyles = makeStyles((theme) => ({
  centered: {
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

  if (!props.record) {
    console.warn('!!!!!! 36 - No record received for SearchResultItem exiting, got props:', props);
  }
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  //  const { seachState, setState, showContext } = useContext(SearchContext);
  const classes = useStyles(theme);
  const context = useContext(SearchContext);
  const { state, setState } = context;
  const _mounted = useRef(false);
  const { record } = props;
//  console.log(`🚀 ~ file: SearchResultItem.jsx:35 ~ SearchResultItem ~ Record ID ${record.id} - title : ${record.title}    record:`, record);

  const onCheckboxChange = (evt) => {
    //console.log('Checkbox changed, setting showContext to ', evt.target.checked);
    setState({
      ...state,
      showContext: evt.target.checked,
    });
  };
  // console.log("🚀 ~ file: SearchResultsItems.jsx:129 ~ SearchResultItem ~ propss / record:", props)

  useEffect(() => {
    _mounted.current = true;
    return (() => {
      _mounted.current = false
    })
  }, [])

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

  function onPDFPreviewToggle(evt) {
    console.log('PDF VIEW Toggle,evt', evt);
    evt.preventDefault();
    setIsPDFViewOpen(!isPDFViewOpen)

  }
  function onDocumentLoadSuccess({ numPages }) {
    setState({ ...state, numPages: numPages });
  }
  function onPDFPreviewToggle(evt) {
    evt.preventDefault();
    setIsPDFViewOpen(!isPDFViewOpen);
  }
  const handleDownloadClick = (evt, id) => {
    evt.preventDefault();
    console.log('Download ID Value and filename', id, filename);
  };

  const onDetailLink = (evt, processId) => {
    console.log("🚀 ~ file: SearchResultsItems.jsx:193 ~ onDetailLink ~ evt,processId:", evt, processId)
  }

  const year = commentDate && commentDate.length > 0 ? new Date(commentDate).getFullYear() : 'N/A';
  const text = record.plaintext || '';
  return (
    <>
      <Paper elevantion={5} sx={{
        margin: 1,
        backGroundColor: "#eee"
      }}>
        <Grid container id="search-result-grid-container">
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
            <Grid container id="search-result-row-container"
              textAlign={'center'} justifyContent={'center'}>
              <Grid item id="year-box"
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
                borderRight={1}
                borderLeft={1}
                borderColor='#ccc'
                //className={classes.centeredContent}
                id="title-grid-container"
                xs={7}
                padding={1}
                flex={1}
              >
                <Typography id="snippets-title" variant='h5' >{(title) ? title : ''}</Typography>
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
                  {/* <PDFViewerDialog
                      id="pdf-viewer-dialog"
                      record={record}
                      isOpen={isPDFViewOpen}
                      onDialogClose={(evt)=>onPDFPreviewToggle(evt,processId)}
                      processId = {processId}
                      fileId = {record.id}
                    /> */}
                  <Button
                    onClick={(evt) => onPDFPreviewToggle(evt, processId)}
                    color={'primary'}
                    variant="contained"
                  >
                    Preview {isPDFViewOpen}
                  </Button>
                </Grid>
                <Grid
                  id="preview-button-grid-item"
                  item
                  //         display={'flex'}
                  xs={6}
                  alignContent={'center'}
                  justifyContent="center"
                  alignItems={'center'}
                  display={'flex'}
                >
                  {/* { processId &&
                      <PDFViewerDialog
                        processId={processId}
                        record={record}
                        isOpen={isPDFViewOpen}
                        fileId= {record.id}
                      onDialogClose={(evt) => onPDFPreviewToggle(evt,processId)}
                      />
                    } */}

                  {/* <Button
                      onClick={(evt) => handleDownloadClick(evt)}
                      color={'secondary'}
                      display={'flex'}
                      variant={'outlined'}
                    > */}
                  <Button
                    onClick={(evt) => handleDownloadClick(evt)}
                    variant='contained'
                    color="secondary"
                  >
                    Download
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <RenderSnippets record={record} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}