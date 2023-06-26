import React, { useState, useEffect,useContext } from 'react';
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
const handleDownloadClick = (evt,id) => {
  evt.preventDefault();
  console.log('Download ID Value',id)
};
export default function SearchResultItems(props) {
  const { searchState, setSearchState } = useContext(SearchContext);
  const [isPDFViewOpen,setIsPDFViewOpen] = useState(false);
  const { status, id, title, content, link, resultsText,page,pageNumber,numPages } = props;
  function onDocumentLoadSuccess({ numPages }) {
    setSearchState({...searchState,numPages: numPages});
    setNumPages(numPages);
  }
  function openPDFPreview(evt,id) {
    setIsPDFViewOpen(true);
    evt.preventDefault();
  }
  function closePDFPreview() {
    setIsPDFViewOpen(false);
  }
  return (
    <>
      <Box>
        <Box border={0} margin={0} padding={1} paddingLeft={3}>
          <Typography variant="searchResultSubTitle">
            <a href={'https://www.nepaccess.org/record-details?id=' + id}>{`${status} ${title}`}</a>
          </Typography>
        </Box>
        <Grid container xs={12}>
          <Grid item xs={10}>
            <Container>
              <Box
                bgcolor="#f4f4f4"
                padding={1}
                border={1}
                borderColor={'lightgray'}
                borderRadius={1}
              >
                {(content.length > 500) ? content.substring(0,550) + ' click to see more...' : content}
              </Box>
            </Container>
          </Grid>
          <Grid item xs={2}>
            <Button
              color="primary"
              onClick={(evt) => handleDownloadClick(evt,id)}
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
              onClick={(evt) => openPDFPreview(evt,id)}
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
      </Box>
    </>
  );
}
