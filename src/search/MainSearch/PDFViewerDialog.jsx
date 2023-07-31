import {
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
// const [fullWidth, setFullWidth] = React.useState(true);
// const [maxWidth, setMaxWidth] = React.useState('md');
// import SearchContext from './SearchContext';
//https://codesandbox.io/s/pdf-view-l3i46?file=/src/Components/DrawArea.js
//https://react-pdf-viewer.dev/examples/
import axios from 'axios';
import { useRef } from 'react';
import Globals from '../../globals';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

export default function PDFViewerDialog(props) {
  console.log("🚀 ~ file: PDFViewerDialog.jsx ~ line 25 ~ PDFViewerDialog ~ props", JSON.stringify(props))
  const {id,record} = props
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
    console.log('onDocumentLoadSuccess', numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }

  // useEffect(() => {
  //   _mounted.current = true;
  //   console.log(`Mounted `, _mounted);
  //   () => {
  //     console.log('cleaning up mounted check after useEffect');
  //     _mounted.current = false;
  //   };
  // }, [_mounted.current]);

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    console.log('handleFullWidth', event.target.checked);
    setFullWidth(event.target.checked);
  };

  // useEffect(()=> {
  //   `Getting file list for id ${id}`;
  //    const files = getFilesById(id);
  //    setFiles(files);
  // },[id])

const getFilesById = (id) => {
  let url = Globals.currentHost + `file/nepafiles?id=${id}`;
  console.log(`🚀 ~ file: PDFViewerDialog.jsx ~ line 52 ~ getFilesById ~ url ${url}`)

  axios
    .get(url)
    .then((response)=> {
      console.log('file response')
      console.log(response);
      return response.data;
    })
    .catch((e)=>{
        console.error(`Failed to get a list of files for id ${id}.With an Exception`,e)
        return [];
    })
}
  //const {searchState,setSearchState} = useContext(SearchContext);
  const { isOpen, onDialogClose, docId, docTitle } = props;
  return (
    <Dialog
      id="pdf-viewer-dialog"
      open={isOpen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={onDialogClose}
    >
      <DialogContent>
        <DialogTitle>
          <Grid container>
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
          <Typography>{record.title}</Typography>
          {/* {isLoaded ? <CircularProgress /> : ( */}
          <Container id="pdf-viewer-document-container">
            {/* <FloatingToolbar/> */}
            <Typography> {record.title} </Typography>
            {(files && files.length) 
              ? files.map((file,idx)=>{
                  return(<span key={idx}>filename : {file}</span>)
              })
               : <></>
            }
            {/* <PDFViewer id={id} /> */}
            {/* <Grid flex={1} container>
              <Grid item justifyContent={'flex-start'} xs={4}><Button variant='outlined' onClick={() => setPageNumber(pageNumber - 1)}>{'<'} Previous Page</Button></Grid>
              <Grid item xs={4} justifyContent={'center'}>
                Page {pageNumber} of {numPages}
              </Grid>
              <Grid item justifyContent={'flex-end'} xs={4}><Button variant='outlined' onClick={() => setPageNumber(pageNumber + 1)}>Next Page {'>'}</Button></Grid>

            </Grid>
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
