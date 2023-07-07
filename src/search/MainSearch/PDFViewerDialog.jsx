import React, { useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContext,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Grid,
  Box,
  Typography,
  IconButton,
  Container,
  CircularProgress,
} from '@mui/material';
// const [fullWidth, setFullWidth] = React.useState(true);
// const [maxWidth, setMaxWidth] = React.useState('md');
// import SearchContext from './SearchContext';
import { Document, Page } from 'react-pdf';
//https://codesandbox.io/s/pdf-view-l3i46?file=/src/Components/DrawArea.js
//https://react-pdf-viewer.dev/examples/
import samplePDF from './example.pdf';
import { pdfjs } from 'react-pdf';
import PDFViewer from './PDFViewer';
import FloatingToolbar from './FloatingToolbar';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

export default function PDFViewerDialog(props) {
  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  //  const { isOpen, onDialogClose,fileName } = props;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  const [isLoaded, setIsLoaded] = useState(false);
  function onDocumentLoadSuccess({ numPages }) {
    console.log('onDocumentLoadSuccess', numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }

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
                {(docTitle) ? docTitle : 'Title Placeholder'}
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
          {/* {isLoaded ? <CircularProgress /> : ( */}
          <Container id="pdf-viewer-document-container">
            <FloatingToolbar/>
            {/* <PDFViewer/> */}
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
