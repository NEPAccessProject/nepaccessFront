import {
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
  ListItem
} from '@mui/material';
import theme from '../../styles/theme.js';
import {makeStyles} from '@mui/styles';
import React, { useDebugValue, useState } from 'react';
//import PDFViewer from './PDFViewer';
// import PDFViewer from '../../examples/PDFViewer/index.jsx';
import PDFViewerDemo from '../PDFViewerDemo'
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

const useStyles = makeStyles(theme => (
  {
    centeredGridItem: {
      verticalAlign: 'center',
      textAlign: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      justifyItems: 'center',
      fontColor: '#ccc',
      border:1,

    },
    item: {
      margin: 1,
      padding: 1,
      border: 1,
      borderColor: "#ccc"
    },

  }
));
export default function PDFViewerDialog(props) {
  console.log("🚀 ~ file: PDFViewerDialog.jsx:28 ~ PDFViewerDialog ~ props:", props)
  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  //[TODO] set processId to props after testing
  //  const {processId} = props; 
  const processId = 78
  console.log("🚀 ~ file: PDFViewerDialog.jsx:31 ~ PDFViewerDialog ~ processId:", processId);
  //params.processId || query.processId;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  //  const { isOpen, onDialogClose,fileName } = props;
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFile,setCurrentFile] = useState({});
  let _mounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const samplePDF = 'https://arxiv.org/pdf/quant-ph/0410100.pdf';
  const classes = useStyles(theme);

  console.log("🚀 ~ file: PDFViewerDialog.jsx ~ processId:", processId)
  useEffect(() => {
    _mounted.current = true
    return () => {
      console.log('Component PDF Dialog is unmounted');
      _mounted.current = false;
    }
  }, []);
  const getFilesById = async (processId) => {
    console.log("🚀 ~ file: PDFViewerDialog.jsx:48 ~ getFilesById ~ processId:", processId)

    if (_mounted.current !== true) {
      return;
    }
    if (!processId) {
      console.log(`No processId recived ${processId}`);
      return;
    }
    console.log("🚀 ~ file: PDFViewerDialog.jsx:72 ~ getFilesById ~ id:", processId)
    let url = Globals.currentHost + `file/nepafiles?id=${processId}`;

    console.log("🚀 ~ file: PDFViewerDialog.jsx:120 ~ getFilesById ~ url:", url)
    try {
      const response = await axios.get(url);
      console.log("🚀 ~ file: PDFViewerDialog.jsx:116 ~ getFilesById ~ response:", response)
      const files = response.data;
      //remove all non pdf files
      const filtered = response.data.filter((file) => file.filename.slice(file.filename.lastIndexOf('.'),file.filename.length) === ".pdf")
      console.log("TLL: getFilesById -> filtered = " + filtered);
      //setFiles(files);
      return filtered;
    }
    catch (e) {
      console.error(`Failed to get a list of files for id ${processId}.With an Exception`, e);
      return [];
    }
  };
  //[TODO] Only for testing longer load times and the spinner
  const bouncedGetFilesById = _.debounce(getFilesById, 1000);

  function onDocumentLoadSuccess({ numPages }) {
    //console.log('onDocumentLoadSuccess', numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }
  useEffect(async () => {
    console.log(`Firing effect to get files, mounted: ${_mounted.current}`)
    if (_mounted.current === false) {
      console.log('Component did not mount')
      return;
    }
    //    console.log('useEffect',id);
    const files = await getFilesById(78);
    console.log(`🚀 ~ file: PDFViewerDialog.jsx:90 ~ useEffect ~ files length  ${files.length ? files.length : 0}`);
    setFiles(files);
    if(files.length > 0){
      setCurrentFile(files[0])
    }
    return async() => {
      console.log('Component PDF Dialog is unmounted - resetting data');
      setFiles([]);
    }
    //setFiles(files);
  }, []);

  useDebugValue(files ? `state updated with ${files && files.length} files` : `Files not found for ProcessID : ${processId}`)
  const onDialogClose = (evt) => {
    console.log('onDialogClose placeholder', evt);

  }
  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };
  const onLoadNextFile = (evt) => {
    if(currentFileIndex !== files.length){
      setCurrentFileIndex(currentFileIndex + 1);          
      setCurrentFile(files[currentFileIndex])
    }
    else{
      console.warn(`Cannot get next file the index ${currentFileIndex} is at ${files.length} `)
    }
      evt.preventDefault();
  }
  const onLoadPreviousFile = (evt) => {
    if (currentFileIndex => 0) {
      setCurrentFileIndex(currentFileIndex - 1);
      setCurrentFile(files[currentFileIndex])
    }
    else {
      console.warn('File Index Already 0 disable the button');
    }
    evt.preventDefault();
  }
  const handleFullWidthChange = (event) => {
    //console.log('handleFullWidth', event.target.checked);
    setFullWidth(event.target.checked);
  };
  const file = files[currentFileIndex];
  return (
    <Dialog
      id="pdf-viewer-dialog"
      //open={isOpen}
      open={true}
      fullScreen={true}
      maxWidth='xl'
      height={'100vh'}
//      maxWidth={lg}
      onClose={onDialogClose}
      xs={{
        height: '100%'
      }}
    >
      <DialogContent>
        <DialogTitle>
          <Grid container>
            {/* <Grid item xs={10} textAlign={'left'} justifyContent={'flex-start'} justifyItems={'flex-start'}>
              <Typography color={'black'} fontSize={18} fontWeight={'bold'}>
                Title?
              </Typography>
            </Grid> */}

            <Grid item xs={2} textAlign={'right'}>
              <IconButton onClick={(evt) => onDialogClose(evt)}>
                <Typography fontWeight={'bold'} fontSize={'medium'}>X</Typography>
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContentText id="pdf-viewer-dialog-content">
          <b>Current Index: {currentFileIndex}</b>
          <Divider/>
          <b>Current File Name</b>
          <Divider/>
          {(files && files.length === 0)
            ? <Paper className={classes.centeredGridItem} sx={{
              height:'100%',
              width: '80%',
            }}>
                <CircularProgress /> 
            </Paper>
            : <Grid container>
            <Grid item xs={12}>
              <Typography variant={'h6'} textAlign='center'>
                {file.filename}
              </Typography>
                <Typography variant={'h6'} textAlign='center'>
                  Current Index {currentFileIndex}
                </Typography>
                <Typography variant={'h6'} textAlign='center'>
                  Number of Files {files.length}
                </Typography>

            </Grid>
              <Grid container className={classes.centeredGridItem}>
                <Grid item xs={6} className={classes.centeredGridItem}>
                  <Button variant='outlined' disabled={currentFileIndex === 0} color='primary' onClick={onLoadPreviousFile} >Previous File</Button>
                </Grid>
                <Grid item xs={6} className={classes.centeredGridItem}>
                  <Button variant='outlined' disabled={currentFileIndex === (files.length-1)} color='primary' onClick={onLoadNextFile}>Next File</Button></Grid>
              </Grid>
              <Grid container border={1} flex={1} display='flex'>
                <Grid item xs={2} border={1}><AvailableFilesList files={files} /></Grid>
                <Grid item xs={10} border={1}><PDFContainer file={file} /></Grid>
              </Grid>
            </Grid>
          }
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}


export function PDFContainer(props) {
  const {file} = props;
  const {eisdoc} = file;
  const classes = useStyles(theme)
  console.log("🚀 ~ file: PDFViewerDialog.jsx:178 ~ PDFContainer ~ eisdoc:", eisdoc)
  return (
    <Grid container>
      <Grid xs={12} item className={classes.centeredGridItem}>
        <Typography variant={'h3'} textAlign='center'>
            {eisdoc.title}
        </Typography>
      </Grid>
      <Grid item xs={12}>                 
          <PDFViewerDemo {...props} />
      </Grid>
    </Grid>
  )
}

export function AvailableFilesList(props) {
  console.log("🚀 ~ file: PDFViewerDialog.jsx:187 ~ AvailableFilesList ~ props:", props)
  const {files} = props;
  const classes = useStyles(theme)

  return (
    <>
    <Grid container>
    <Grid item xs={12} className={classes.centeredGridItem}>      
        <Typography variant={'h6'} textAlign='center'>
            Related Files
        </Typography>
    </Grid>
    <Grid item xs={12}>
      <List>
        {files.map((file, idx) => (
            <ListItem><a href={file.url} target="_blank" rel="noopener noreferrer"><Typography variant='filterLabel'>{file.filename}</Typography></a></ListItem>
        ))}
      </List>
        </Grid>
      </Grid>
    </>
  )
}
