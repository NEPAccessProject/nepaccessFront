import {
  Box,
  Button,
  Container,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useContext, useState } from 'react';
import PDFViewerDialog from './PDFViewerDialog';
import SearchContext from './SearchContext';
const handleDownloadClick = (evt, id) => {
  evt.preventDefault();
  console.log('Download ID Value', id);
  
};
const sortByDate = (a,b)=>{
console.log("🚀 ~ file: SearchResultsItems.jsx ~ line 17 ~ sortByDate ~ a,b", JSON.stringify(a),JSON.stringify(b));
  return a.doc.commentDate > b.doc.commentDate;
}
export default function SearchResultItems(props){
  let  result  = props.result || [];
  const {doc,records} = result;
  console.log('search result records?',records);
  console.log('Search result docs?', doc);
  const sortedRecords = (records && records.length) ? records.sort(sortByDate) : [];
// const initialSearch = (records.length) ? records.sort(sortByDate): [];
  //console.log("🚀 ~ file: SearchResultsItems.jsx:37 ~ SearchResultItems ~ sortedRecords:", sortedRecords)

  /* Merge doc and records */
  return (
    <>
     <Box minHeight={'100vh'}>
      {JSON.stringify(records)}
        {(sortedRecords)
        ? (sortedRecords).map((record, idx)=>{
            return(
              <div key={idx}>
                  <SearchResultItem record={record}/>
                </div>
            )
          
        })
        : <div>No results Found</div> 
      } 
        
     </Box>
    </>
  )
}

export function SearchResultItem(props) {
  console.log("🚀 ~ file: SearchResultsItems.jsx:46 ~ SearchResultItem ~ props:", props)
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const context = useContext(SearchContext);
  const {searchState,setSearchState} = context;
  const { record } = props;  function onDocumentLoadSuccess({ numPages }) {
    const { title,  agency, cooperatingAgency, commentsFilename, plaintext, notes, id, name, subtype, county, commentDate, status, documentType } = record;
  //  console.log("🚀 ~ file: SearchResultsItems.jsx:53 ~ onDocumentLoadSuccess ~ commentDate:", commentDate)
  //  console.log("🚀 ~ file: SearchResultsItems.jsx:53 ~ onDocumentLoadSuccess ~ id:", id)

    setSearchState({ ...searchState, numPages: numPages });
    setNumPages(numPages);
  }
  function openPDFPreview(id) {
    console.log(`Open PDF for ID: ${id}`);
    setIsPDFViewOpen(true);
//    evt.preventDefault();
  }
  function closePDFPreview() {
    setIsPDFViewOpen(false);
  }
  function toggleContentExpansion(evt) {
    evt.preventDefault();
    console.log(`Open toggleContentExpansion for ID: ${id}`);
    setIsContentExpanded(!isContentExpanded);
  }

  //  console.log("🚀 ~ file: SearchResultsItems.jsx:69 ~ SearchResultItem ~ props:", props)

  const year = (commentDate) ? new Date(commentDate).getFullYear() : "N/A"

  const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Donec et odio pellentesque diam volutpat. Adipiscing commodo elit at imperdiet dui accumsan sit amet. Morbi tincidunt ornare massa eget egestas purus. Tempus quam pellentesque nec nam aliquam sem et tortor consequat. Tortor posuere ac ut consequat semper viverra. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper. Porta nibh venenatis cras sed felis eget velit aliquet. Elementum eu facilisis sed odio morbi quis commodo odio aenean. Metus dictum at tempor commodo. Massa vitae tortor condimentum lacinia quis vel eros donec. Mauris a diam maecenas sed. Diam in arcu cursus euismod. Vulputate sapien nec sagittis aliquam. Ipsum dolor sit amet consectetur. Nibh praesent tristique magna sit amet purus gravida quis. Commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit. Porta non pulvinar neque laoreet suspendisse interdum consectetur."
  return (
    <>
      <Typography variant='searchResultSubTitle' padding={2}>{documentType} - {title}</Typography>
      <Grid
        flex={1}
        container
        marginTop={2}
        marginBottom={2}
      >
        <Grid item xs={1} textAlign={'center'}>
          <Typography fontWeight={'bold'}>
            {(year) ? year : 'N/A'}

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
                {isContentExpanded ? content : content.substring(0, 100) + ((content.length > 100) ? '...' : '')}
              </Box>
            </Container>
          <Container>
            <Box
              width={'100%'}
              alignContent={'center'}
              textAlign={'center'}
              onClick={toggleContentExpansion}
              bgcolor="#A2A5A6"
              paddingTop={1}
              paddingBottom={1}
            >

              <Typography variant="expanderButton">
                Click to see more...
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

          <PDFViewerDialog isOpen={isPDFViewOpen} onDialogClose={closePDFPreview} />
          <Button
            onClick={openPDFPreview(id)}
            color={'secondary'}
            sx={{
              mt: 1,
              width: '90%',
            }}
          >
            Preview
          </Button>
        </Grid>
      </Grid>
    </>

  )
}
