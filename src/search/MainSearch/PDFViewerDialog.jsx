import React, { useContext, useState } from 'react';
import {
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
import samplePDF from './example.pdf';
import { pdfjs } from 'react-pdf';

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
  const { isOpen, onDialogClose } = props;
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
                  PDF Title Here
                </Typography>
              </Grid>

<Grid item xs={2} textAlign={'right'}>
                <IconButton onClick={onDialogClose}>
                  <Typography fontWeight={'bold'} fontSize={'medium'}>X</Typography>
                </IconButton>
</Grid>
            <Grid item xs={12}>
            <Typography fontSize={14}>
              Page {pageNumber} of {numPages}
            </Typography>

            </Grid>
            </Grid>
        </DialogTitle>
        <DialogContentText id="pdf-viewer-dialog-content">
            {/* {isLoaded ? <CircularProgress /> : ( */}
            <Container id="pdf-viewer-document-container">
              <Document file={samplePDF} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
              <Typography fontSize={14}>
              Page {pageNumber} of {numPages}
            </Typography>

            </Container>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
