import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import React, { useDebugValue, useState } from 'react';
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



export default function PDFViewerDialog(props){
  console.log("🚀 ~ file: PDFViewerDialog.jsx:28 ~ PDFViewerDialog ~ props:", props)
  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  //[TODO] set processId to props after testing
//  const {processId} = props; 
  const processId= 78
  console.log("🚀 ~ file: PDFViewerDialog.jsx:31 ~ PDFViewerDialog ~ processId:", processId);
   //params.processId || query.processId;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  //  const { isOpen, onDialogClose,fileName } = props;
  const [files, setFiles] = useState([]);
  let _mounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const samplePDF = 'https://arxiv.org/pdf/quant-ph/0410100.pdf';

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
      //setFiles(response.data);
      const filtered = response.data.filter((file) => file.processId === processId)
      console.log("TLL: getFilesById -> filtered = " + filtered);
      //setFiles(files);
      return files;
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


  // useEffect(async () => {
  //   console.log('Firing Effect to get files');
  //   if (_mounted.current === false) {
  //     return false;
  //   }
  //   const files = await getFilesById(processId);
  //   console.log(`Got files for id ${processId}`, files);
  //   setFiles(files)
  //     () => files = []
  // }, [processId])

  
    useEffect(async() => {
      console.log(`Firing effect to get files, mounted: ${_mounted.current}`)
      if(_mounted.current === false){
        console.log('Component did not mount')
        return;
      }
  //    console.log('useEffect',id);
      const files = await getFilesById(78);
        console.log(`🚀 ~ file: PDFViewerDialog.jsx:90 ~ useEffect ~ files length  ${files.length ? files.length : 0}`);
        setFiles(files);
        
        return () => {
          console.log('Component PDF Dialog is unmounted - resetting data');
          setFiles([]);
        }
        //setFiles(files);
    },[]);
 
  useDebugValue(files ? `state updated with ${files && files.length} files` : `Files not found for ProcessID : ${processId}`)
  const onDialogClose= (evt)=>{
    console.log('onDialogClose placeholder',evt);

  }
  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };


  const handleFullWidthChange = (event) => {
    //console.log('handleFullWidth', event.target.checked);
    setFullWidth(event.target.checked);
  };

  return (
    <Dialog
      id="pdf-viewer-dialog"
      ////open={isOpen}
      open={true}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={onDialogClose}
    >
      <DialogContent>
        <DialogTitle>
          <Grid container>
            <Grid item xs={10} textAlign={'left'} justifyContent={'flex-start'} justifyItems={'flex-start'}>
              <Typography color={'black'} fontSize={18} fontWeight={'bold'}>
                Title?
              </Typography>
            </Grid>

            <Grid item xs={2} textAlign={'right'}>
              <IconButton onClick={(evt)=>onDialogClose(evt)}>
                <Typography fontWeight={'bold'} fontSize={'medium'}>X</Typography>
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContentText id="pdf-viewer-dialog-content">
          <Typography variant='h1' color='secondary'>PDF Viewer</Typography>
          
          {(files && files.length === 0) 
            ? <CircularProgress/> 
            :  <Grid container>
                  <Grid container flex={1}>
                    <Grid item xs={3}><AvailableFilesList files={files}/></Grid>
                    <Grid item xs={9}><PDFContainer file={files}/></Grid>
                  </Grid>
            :  </Grid>
            }
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}


export function PDFContainer(props) {
  const { file, currentFileIndex } = props;
  console.log("🚀 ~ file: PDFViewerDialog.jsx:178 ~ PDFContainer ~ props:", props)
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant='h1' color='secondary'>{file.filename}</Typography>
      </Grid>
      <Grid item xs={12}>
        <b key={currentFileIndex}>filename : {file.name}</b>
      </Grid>
    </Grid>
  )
}

export function AvailableFilesList(props) {
  console.log("🚀 ~ file: PDFViewerDialog.jsx:187 ~ AvailableFilesList ~ props:", props)
  const [files, currentFileIndex] = props;
  return (
    <ul>
      {files.map((file, idx) => (
        <li key={idx}>
          <a href={file.url} target="_blank" rel="noopener noreferrer">{file.filename}</a>
        </li>
      ))}
    </ul>
  )
}
