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
    console.log('onDocumentLoadSuccess',numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    console.log('handleFullWidth',event.target.checked);
    setFullWidth(event.target.checked);
  };

  //const {searchState,setSearchState} = useContext(SearchContext);
  const { isOpen, onDialogClose } = props;
  return (
    <Dialog open={isOpen} fullWidth={fullWidth} maxWidth={maxWidth} onClose={onDialogClose}>
      <Container>
        <DialogContent>
          <DialogTitle>
            <Grid item xs={1} justifyContent={'center'}>
              <IconButton onClick={onDialogClose}>
                <Typography fontSize={'medium'}>X</Typography>
              </IconButton>
            </Grid>
          </DialogTitle>
          <DialogContentText>
            <Box>
              <Typography color={'white'} fontSize={'xl'}>
                PDF Title Here
              </Typography>
            </Box>
            <Container sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Box>
                {/* {isLoaded ? <CircularProgress /> : ( */}
                  <Document file={samplePDF} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={1} />
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                  </Document>
                  <p>
        Page {pageNumber} of {numPages}
      </p>
                {/* )} */}
                </Box>
            </Container>
          </DialogContentText>
        </DialogContent>
      </Container>
    </Dialog>
  );
}
