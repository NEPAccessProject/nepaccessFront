import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
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

export default function MultiPDFViewer(props) {
  //  console.log("🚀 ~ file: PDFViewerDialog.jsx ~ line 25 ~ PDFViewerDialog ~ props", JSON.stringify(props))

  const docTitle = 1004028;
  const processId = 1004028;
  const id = 1004028;
  const record = {
      id: 1004028,
      title: 'placeholder title'
  }
  // const { id, record, processId } = props;

  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  //  const { isOpen, onDialogClose,fileName } = props;
  const [files, setFiles] = useState([]);
  let _mounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const samplePDF = 'https://arxiv.org/pdf/quant-ph/0410100.pdf';
  const onDialogClose=(evt)=>{
  c onsole.log("TLL: onDialogClose -> evt = " + evt);
    
  }


  function onDocumentLoadSuccess({ numPages }) {
    //console.log('onDocumentLoadSuccess', numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }

  useEffect(() => {
    _mounted.current = true
    return () => {
      console.log('Component unmounted');
      _mounted.current = false;
    }
  }, []);

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

  // useEffect(() => {
  //   if (_mounted.current === false) {
  //     return false;
  //   }
  //   const files = getFilesById(processId);
  //   console.log(`Got files for id ${processId}`, files);
  //   setFiles(files);
  // }, [processId])

  const getFilesById = async(processId) => {
    if (_mounted.current !== true) {
      console.log(`PDF Viewer is not mounted`)
      return;
    }
    if (!processId) {
      console.log(`No processId recived ${processId}`);
      return;
    }

    console.log("🚀 ~ file: PDFViewerDialog.jsx:72 ~ getFilesById ~ id:", processId)
    let url = Globals.currentHost + `file/nepafiles?processId=${processId}`;

      axios.get(url)
      .then((response) => {
        debugger;
        console.log(`API Returned ${response.data.length}`);
        //const files =  JSON.parse(response.data);
        console.log (`received ${files.length} files for id ${processId}`);
        setFiles(response.data);
      })
      .catch((e) => {
      console.error("TLL: getFilesById -> e = " + e);
        return [];
      })
  };

  return (
    <Dialog
      id="pdf-viewer-dialog"
      ////open={isOpen}
      open={true}
      fullWidth={true}
      maxWidth={maxWidth}
      onClose={onDialogClose}
      maxWidth= 'xl'
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
              <IconButton onClick={()=><div>placeholder</div>}>
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
            {(files && files.length)
              ? files.map((file, idx) => {
                return (<span key={idx}>filename : {file}</span>)
              })
              : <b>No Files found for processId {processId}</b>
            }
            {JSON.stringify(files)}
            <PDFViewer processId={processId} />
            <Grid flex={1} container>
              <Grid item justifyContent={'flex-start'} xs={4}><Button variant='outlined' onClick={() => setPageNumber(pageNumber - 1)}>{'<'} Previous Page</Button></Grid>
              <Grid item xs={4} justifyContent={'center'}>
                Page {pageNumber} of {numPages}
              </Grid>
              <Grid item justifyContent={'flex-end'} xs={4}><Button variant='outlined' onClick={() => setPageNumber(pageNumber + 1)}>Next Page {'>'}</Button></Grid>

            </Grid>
            {/*
            <Document file={samplePDF} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
            <Typography fontSize={14}>
              Page {pageNumber} of {numPages}
            </Typography> */}

          </Container>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
