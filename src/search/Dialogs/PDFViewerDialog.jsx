import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Button,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import theme from '../../styles/theme.js';
import { makeStyles } from '@mui/styles';
import React, { useDebugValue, useState } from 'react';
//import PDFViewer from './PDFViewer';
// import PDFViewer from '../../examples/PDFViewer/index.jsx';
import PDFViewer from '.../PDFViewer/PDFViewer.jsx';
import PDFViewerContainer from '../PDFViewer/PDFViewerContainer.jsx';
import AvailablePDFsList from '../PDFViewer/AvailablePDFsList.js'
// const [fullWidth, setFullWidth] = React.useState(true);
// const [maxWidth, setMaxWidth] = React.useState('md');
// import SearchContext from './SearchContext';
//https://codesandbox.io/s/pdf-view-l3i46?file=/src/Components/DrawArea.js
//https://react-pdf-viewer.dev/examples/
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import Globals from '../../globals';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

const useStyles = makeStyles((theme) => ({
  centered: {

  },
  item: {
    //margin: 5,
    padding: 5,
    border: 1,
    borderColor: '#ccc',
    borderRadius: 1,
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
      boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.5)',
      cursor: "pointer",
      "& .addIcon": {
        color: "purple"
      }
    }
  },
}));

export default function PDFViewerDialog(props) {
  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  //[TODO] set processId to props after testing
  //  const {processId} = props;
  //[TODO][CRITICAL] this is hardcode for testing
  const processId = props.processId || 78;
  //params.processId || query.processId;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  //  const { isOpen, onDialogClose,fileName } = props;
  const [files, setFiles] = useState([]);
  const [currentEisDoc, setCurrentEisDoc] = useState({});
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState({});
  let _mounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const samplePDF = 'https://arxiv.org/pdf/quant-ph/0410100.pdf';
  const classes = useStyles(theme);
  useEffect(() => {
    _mounted.current = true;
    return () => {
      console.log('Component PDF Dialog is unmounted');
      _mounted.current = false;
    };
  }, []);
  const getFilesById = async (processId = 0) => {
    if (_mounted.current !== true) {
      return;
    }
    let url = Globals.currentHost + `file/nepafiles?id=${processId}`;
    try {
      const response = await axios.get(url);
      //remove all non pdf files
      const files = response.data.filter(
        (file) =>
          file.filename.slice(file.filename.lastIndexOf('.'), file.filename.length) === '.pdf',
      );
      console.log('TLL: getFilesById -> filtered = ' + files);
      //setFiles(files);
      return files;
    } catch (e) {
      console.error(`Failed to get a list of files for id ${processId}.With an Exception`, e);
      return [];
    }
  };
  //[TODO] Only for testing longer load times and the spinner
  //  const bouncedGetFilesById = _.debounce(getFilesById, 1000);


  useEffect(() => {
    if (_mounted.current !== true) {
      return;
    }
    async function getFiles() {
      const files = await getFilesById(processId);
      console.log('116 useffect got files', files);
      setFiles(files);
      if (files.length > 0) {
        console.log('Setting Current File to ', files[0]);
        setCurrentFile(files[0]);
        setCurrentEisDoc(files[0].eisdoc);
      }
    }
    getFiles();
    return () => {
      console.log('PDF Viewer Dialog UnMounted, reseting results');
      setFiles(null);
    }
  }, [])

  useDebugValue(
    files
      ? `state updated with ${files && files.length} files`
      : `Files not found for ProcessID : ${processId}`,
  );
    const handleFullWidthChange = (event) => {
    //console.log('handleFullWidth', event.target.checked);
    setFullWidth(event.target.checked);
  };

  function onDocumentLoadSuccess({ numPages }) {
    //console.log('onDocumentLoadSuccess', numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }
  function onPDFListFileSelect(id){
    console.log(`onPDFListFileSelect fired with id of ${id} - currentFile`,currentFile)
     const file = files.filter((file) => file.id === id);

    console.log(`🚀 ~ file: PDFViewerDialog.jsx:147 setting current file with id of ${id}`, file);
    //[TODO] when a file is not found display an error message.
    if(file && file.id){
      setCurrentFile(file)
    }
;
  }
  const onDialogClose = (evt) => {
    console.log('onDialogClose placeholder', evt);
  };
  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };
  const onLoadNextFile = (evt) => {
    console.log(`Next Button fired, current File with at index ${currentFileIndex} was:`,currentFile)
    if (currentFileIndex !== files.length) {
      setCurrentFileIndex(currentFileIndex + 1);
      setCurrentFile(files[currentFileIndex]);
      console.log(`Next Button fired, updated file with file new index is ${currentFileIndex} Current File is not`,currentFile)

    } else {
      console.warn(`Cannot get next file the index ${currentFileIndex} is at ${files.length} `);
    }
    evt.preventDefault();
  };
  const onLoadPreviousFile = (evt) => {
    if ((currentFileIndex) => 0) {
      setCurrentFileIndex(currentFileIndex - 1);
      setCurrentFile(files[currentFileIndex]);
    } else {
      console.warn('File Index Already 0 disable the button');
    }
    evt.preventDefault();
  };

  // const {title} = eisdoc;
  return (
    <Dialog
      id="pdf-viewer-dialog"
      //open={isOpen}
      open={true}
      //      fullScreen={true}
      maxWidth="xl"
      width="xl"
      //height={'100vh'}
      //      maxWidth={lg}
      onClose={onDialogClose}
    >
      <DialogContent>
        <DialogTitle>
          <Grid container>
            {/* <Grid item xs={10} textAlign={'left'} justifyContent={'flex-start'} justifyItems={'flex-start'}>
              <Typography color={'black'} fontSize={18} fontWeight={'bold'}>
                Title?
              </Typography>
            </Grid> */}

            <Grid item xs={2} display='flex' textAlign={'flex-end'} id="icon-button-grid-item">
              <IconButton onClick={(evt) => onDialogClose(evt)}>
                <Typography fontWeight={'bold'} fontSize={'medium'}>
                  X
                </Typography>
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContentText id="pdf-viewer-dialog-content">
          {files && files.length === 0 ? (
            <Paper
              elevation={1}
              className={classes.centered}
              sx={{
                border: 0,
                // position: 'absolute',
                // top: '50%',
                // left: '50%',
                // height: '80%',
                // width: '80%',
              }}
            >
              <CircularProgress />
            </Paper>
          ) : (
            <Paper>
              {/* <Grid container border={0}>
                <Grid item xs={3} className={classes.centered} border={0} borderColor='#ccc' id="file-list-grid-item">
                  <AvailableFilesList {...props} files={files} />
                </Grid>
                <Grid container xs={9} className={classes.centered} border={0} borderColor={'#ccc'}>
                  <Grid item xs={12} border={1} borderColor={'#ccc'} id="pdf-viewer-grid-container">
                    <Typography textAlign={'center'} variant="h6">{(currentFile && currentFile.eisdoc) ? currentFile.eisdoc.title : '0'}</Typography>

                  </Grid>
                  <Grid item xs={12} border={1} borderColor={'#ccc'} id="pdf-viewer-grid-item-container">
                      <PDFContainer {...props} file={currentFile} />
                  </Grid>
                </Grid>
              </Grid> */}

              <Grid container border={0} borderColor="#ccc">

                <Grid container border={0} spacing={1} justifyContent='space-between' flex={1} display="flex">
                  <Grid item xs={3}>
                      <AvailableFilesList {...props} files={files} onPDFListFileSelect={onPDFListFileSelect} />
                  </Grid>
                  <Grid item xs={9} border={0}>
                    <Grid border={1} container className={classes.centered} id="grid-button-container">
                      <Grid item xs={6} flex={1} className={classes.centered} id="previous-button-grid-item">
                        <Button
                          variant="outlined"
                          disabled={currentFileIndex === 0}
                          color="primary"
                          onClick={onLoadPreviousFile}
                        >
                          Previous File
                        </Button>
                      </Grid>
                      <Grid item xs={6} className={classes.centered} id="next-button-grid-item">
                        <Button
                          variant="outlined"
                          disabled={(!files || (currentFileIndex === files.length))}
                          color="primary"
                          onClick={onLoadNextFile}
                        >
                          Next File
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container id="pdf-viewer-grid-container">
                      <Grid item xs={12} border={1} borderColor={'#ccc'} id="pdf-viewer-grid-item">
                        <Typography textAlign={'center'} variant="h6">{(currentFile && currentFile.eisdoc) ? currentFile.eisdoc.title : '0'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <PDFContainer {...props} file={currentFile} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          )}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
