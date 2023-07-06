import React, { useState, useEffect, useContext } from 'react';
import {
  Paper,
  Button,
  Input,
  Box,
  Divider,
  FormControl,
  Select,
  Autocomplete,
  InputLabel,
  ListItem,
  IconButton,
  TextField,
  Typography,
  Container,
  FormLabel,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import SearchContext from './SearchContext';
import PDFViewerDialog from './PDFViewerDialog';
const handleDownloadClick = (evt, id) => {
  evt.preventDefault();
  console.log('Download ID Value', id);
};
export default function SearchResultItems(props) {
  const { searchState, setSearchState } = useContext(SearchContext);
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { status, id, title, content, link, resultsText, page, pageNumber, numPages,publishedYear } = props;
  function onDocumentLoadSuccess({ numPages }) {
    setSearchState({ ...searchState, numPages: numPages });
    setNumPages(numPages);
  }
  function openPDFPreview(evt, id) {
    setIsPDFViewOpen(true);
    evt.preventDefault();
  }
  function closePDFPreview() {
    setIsPDFViewOpen(false);
  }
  function toggleContentExpansion(evt) {
    evt.preventDefault();
    setIsContentExpanded(!isContentExpanded);
  }

  return (
    <>
        <Divider />
        <Typography variant='searchResultSubTitle'>{status} {title}</Typography>
        <Grid
          flex={1}
          container
          marginTop={2}
          marginBottom={2}
        >
          <Grid item xs={1} textAlign={'center'}>
            <Typography fontWeight={'bold'}>
              {(publishedYear) ? publishedYear : 'N/A'}

            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Container>
              <Box
                bgcolor="#f4f4f4"
                padding={1}
                border={0}
                borderColor={'lightgray'}
                borderRadius={1}
              >
                {isContentExpanded ? content : content.substring(0, 100)}
              </Box>
            </Container>
            <Container>
              <Box
                width={'100%'}
                alignContent={'center'}
                textAlign={'center'}
                onClick={toggleContentExpansion}
                bgcolor="#A2A5A6"
              >
                <Typography fontSize={14} fontWeight={'bold'} paddingBottom={1} paddingTop={1} color={'#fff'}>
                  Expand to see more...
                </Typography>
              </Box>
            </Container>
          </Grid>
          <Grid item xs={2}>
            <Button
              color="primary"
              onClick={(evt) => handleDownloadClick(evt, id)}
              sx={{
                width: '90%',
              }}
            >
              Download
            </Button>
            {/* <Document file="url('Appendix A_ProjectLocationMap.pdf')" onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document> */}

            <PDFViewerDialog isOpen={isPDFViewOpen} onDialogClose={closePDFPreview} />
            <Button
              onClick={(evt) => openPDFPreview(evt, id)}
              color={'secondary'}
              sx={{
                mt: 1,
                width: '90%',
              }}
            >
              {' '}
              Preview{' '}
            </Button>
          </Grid>
        </Grid>
    </>
  );
}
