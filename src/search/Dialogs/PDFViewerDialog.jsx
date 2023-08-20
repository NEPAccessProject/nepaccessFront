import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  ListItem,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
// const [fullWidth, setFullWidth] = React.useState(true);
// const [maxWidth, setMaxWidth] = React.useState('md');
// import SearchContext from './SearchContext';
//https://codesandbox.io/s/pdf-view-l3i46?file=/src/Components/DrawArea.js
//https://react-pdf-viewer.dev/examples/
import axios from 'axios';
import { useEffect, useRef } from 'react';
import Globals from '../../globals';
import PDFViewer from './PDFViewer';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

export default function PDFViewerDialog(props) {
//  console.log("🚀 ~ file: PDFViewerDialog.jsx ~ line 25 ~ PDFViewerDialog ~ props", JSON.stringify(props))

  const id = 17281;
  const processId = 17281;
const record = {
  id: 17281,
    title: 'Test Record Title'
  }
  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  //  const { isOpen, onDialogClose,fileName } = props;
  const [files,setFiles] = useState([]);
  let _mounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const samplePDF = 'https://arxiv.org/pdf/quant-ph/0410100.pdf';
  function onDocumentLoadSuccess({ numPages }) {
    //console.log('onDocumentLoadSuccess', numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }

  useEffect(() => {
    _mounted.current = true
    return ()=>{
      console.log('Component unmounted');
      _mounted.current = false;
    }
  }, []);

  useEffect(() => {
    if(_mounted.current === false){
      return;
    }
//    console.log('useEffect',id);
    const files = getFilesById(processId);
    console.log("🚀 ~ file: PDFViewerDialog.jsx:90 ~ useEffect ~ files:", files)
    setFiles(files);
  },processId);


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

  useEffect(()=> {
    if(_mounted.current === false){
      return false;
    }
     getFilesById(processId);
     console.log(`Got files for id ${processId}`,files);
     setFiles(files);
  },[processId])

const getFilesById = (processId) => {
  if(_mounted.current !== true){
    return;
  }
  if(!processId){
    console.log(`No processId recived ${processId}`);
    return;
  }
   console.log("🚀 ~ file: PDFViewerDialog.jsx:72 ~ getFilesById ~ id:", processId)
   let url = Globals.currentHost + `file/nepafiles?id=${processId}`;   
   
   axios
    .get(url)
    .then((response)=> {
      console.log('file response')
      console.log('getFiles data',response.data);
      setFiles(response.data);
      const filtered = response.data.filter((file)=> file.processId === processId )
      console.log("TLL: getFilesById -> filtered = " + filtered);
    })
    .catch((e)=>{
        console.error(`Failed to get a list of files for id ${id}.With an Exception`,e)
        return [];
    })
  };

  // useEffect(() => {
  //   console.log('useEffect',id);
  //   const files = getFilesById(id);
  //   console.log("🚀 ~ file: PDFViewerDialog.jsx:90 ~ useEffect ~ files:", files)
  //   setFiles(files);
  // },[getFilesById])

  //const {searchState,setSearchState} = useContext(SearchContext);
  const { isOpen, onDialogClose, docId, docTitle } = props;
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
            Process ID: {processId}
            <Grid item xs={10} textAlign={'left'} justifyContent={'flex-start'} justifyItems={'flex-start'}>
              <Typography color={'black'} fontSize={18} fontWeight={'bold'}>
                {(docTitle) ? docTitle : ''}
              </Typography>
            </Grid>

            <Grid item xs={2} textAlign={'right'}>
              <IconButton onClick={onDialogClose}>
                <Typography fontWeight={'bold'} fontSize={'medium'}>X</Typography>
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContentText id="pdf-viewer-dialog-content">
          {/* {(files.length) && (files.map((file,idx)=>(
            <span key={idx}>filename : {file}</span>
          )))} */}

          <Typography>{record.title}</Typography>
          {/* {isLoaded ? <CircularProgress /> : ( */}
          <Container id="pdf-viewer-document-container">
            {/* <FloatingToolbar/> */}
            <Typography> {record.title} </Typography>
            {/* {JSON.stringify(files)} */}
              <Grid container >
              <Grid id="related-files-grid-item" item xs={3}>
                  
              {
                  (files && files.length) &&
                    files.splice(0,5).map((file,idx)=> {
                      return(  
                    
                          <Box key={record.id}
                          sx={{border:1}}>
                            <ListItem>{idx} of {files.length}</ListItem>
                              <span key={idx}><b>id</b> : {file.id}</span>
                            <ListItem>
    
                              <span key={idx}><b>filename</b> : {file.filename}</span>
                            </ListItem>
                            {/* <ListItem>
                              <span key={idx}><b>documentType</b> : {file.documentType}</span>
                            </ListItem>
                            <ListItem>
                              <span key={idx}><b>folder</b> : {file.folder}</span>
                            </ListItem>
                            <ListItem>
                              <span key={idx}><b>folder</b> : {file.folder}</span>
                            </ListItem> */}
    
                          </Box>
                      )
                    })
              }
              </Grid>
              <Grid id="pdf-view-grid-item" xs={8} border={1}>
                <PDFViewer processId={processId} />
              </Grid>            
           </Grid>

          </Container>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
