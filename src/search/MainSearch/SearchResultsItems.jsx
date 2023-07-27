import { Box, Button, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import React, { useContext, useState } from 'react';
import PDFViewerDialog from './PDFViewerDialog';
import SearchContext from './SearchContext';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 1,
  mt: 1,
  mb: 1,
  pl: 0,
  pr: 0,
  '&:hover': {
    // //           backgroundColor: //theme.palette.grey[200],
    // boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.25)',
    // backgroundColor: '#eee',
    // cursor: 'pointer',
    // '& .addIcon': {
    //   color: 'darkgrey',
    // },
  },
}));


const sortByDate = (a, b) => {
  console.log('🚀 ~ file: SearchResultsItems.jsx ~ line 17 ~ sortByDate ~ a,b', a, b);
  if (a.record && a.record.commentDate && b.record && b.record.commentDate) {
    return a.commentDate > b.commentDate;
  } else if (a.commentDate && a.commentDate) {
    return a.commentDate > b.commentDate;
  }
};
export default function SearchResultItems(props) {
  console.log('SearchResultItems vprops', props);
  let result = props.result || [];
  const { doc, records } = result;
  console.log('search result records?', records);
  console.log('Search result docs?', doc);
  let sortedRecords = [];
  function sortByDate(a, b) {
    console.log('A > B', a, b);
    a.commentDate > b.commentDate;
  }
  if (records && records.length) {
    sortedRecords = records.sort(sortByDate);
  }
  if (result.doc && result.doc.commentDate) {
    sortedRecords = result;
  }

  // const initialSearch = (records.length) ? records.sort(sortByDate): [];
  console.log("🚀 ~ file: SearchResultsItems.jsx:58 ~ SearchResultItems ~ sortedRecords:", sortedRecords)

  /* Merge doc and records */
  return (
    
    <>
    {JSON.stringify(sortedRecords)}
      {/* <Box minHeight={'100vh'}>
        {sortedRecords && sortedRecords.length ? (
          sortedRecords.map((record, idx) => {
            return (
              <div key={idx}>
                <SearchResultItem record={record} />
              </div>
            );
          })
        ) : (
          <div>No results Found</div>
        )}
      </Box> */}
    </>
  );
}

export function SearchResultItem(props) {
  console.log('🚀 ~ file: SearchResultsItems.jsx:46 ~ SearchResultItem ~ props:', props);
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const context = useContext(SearchContext);
  const { searchState, setSearchState, showContext } = context;
  const { record } = props;
  const {
    agency,
    commentDate,
    commentsFilename,
    cooperatingAgency,
    county,
    documentType,
    filename,
    id,
    name,
    notes,
    plaintext,
    status,
    subtype,
    title,
  } = record;


  function onDocumentLoadSuccess({ numPages }) {
    setSearchState({ ...searchState, numPages: numPages });
    setNumPages(numPages);
  }
  function openPDFPreview(id, evt) {
    console.log(`Open PDF for ID: ${id} evt: `, evt);
    setIsPDFViewOpen(true);
    evt.preventDefault();
  }
  function closePDFPreview() {
    setIsPDFViewOpen(false);
  }
  function toggleContentExpansion(evt) {
    evt.preventDefault();
    console.log(`Open toggleContentExpansion for ID: ${id}`);
    setIsContentExpanded(!isContentExpanded);
  }
  
const handleDownloadClick = (evt, id) => {
  evt.preventDefault();
  console.log('Download ID Value and filename', id,filename);
};

  const year = commentDate && commentDate.length > 0 ? new Date(commentDate).getFullYear() : 'N/A';
  console.log('SEARCH STATE SearchResultComponent');
  const contents = plaintext || [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Donec et odio pellentesque diam volutpat. Adipiscing commodo elit at imperdiet dui accumsan sit amet. Morbi tincidunt ornare massa eget egestas purus. Tempus quam pellentesque nec nam aliquam sem et tortor consequat. Tortor posuere ac ut consequat semper viverra. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper. Porta nibh venenatis cras sed felis eget velit aliquet. Elementum eu facilisis sed odio morbi quis commodo odio aenean. Metus dictum at tempor commodo. Massa vitae tortor condimentum lacinia quis vel eros donec. Mauris a diam maecenas sed. Diam in arcu cursus euismod. Vulputate sapien nec sagittis aliquam. Ipsum dolor sit amet consectetur. Nibh praesent tristique magna sit amet purus gravida quis. Commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit. Porta non pulvinar neque laoreet suspendisse interdum consectetur.',
  ];
  return (
    <>
      <Typography variant="searchResultSubTitle" padding={2}>
        {documentType} - {title}
      </Typography>
      <Grid flex={1} container marginTop={2} marginBottom={2}>
        <Grid item xs={1} textAlign={'center'}>
          <Typography fontWeight={'bold'}>{year ? year : 'N/A'}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Container>
            {
              Object.keys(record).map((key,idx)=> {
                return(
                  <Grid   flex={1} container key={idx}>
                    <Item xs={2} key={idx}  sx={{
                    }}>
                      <b>{key}:</b> {record[key]}
                    </Item>
                  </Grid>
                )
              })
            }
             
          </Container>
          {showContext &&
            contents.map((content, idx) => {
              return (
                <>
                  {' '}
                  <Container key={idx}>
                    <Box
                      bgcolor="#f4f4f4"
                      padding={1}
                      border={0}
                      borderColor={'lightgray'}
                      borderRadius={1}
                    >
                      {isContentExpanded
                        ? content
                        : content.substring(0, 100) + (content.length > 100 ? '...' : '')}
                    </Box>
                  </Container>
                  <Container key={idx}>
                    <Box
                      bgcolor="#f4f4f4"
                      padding={1}
                      border={0}
                      borderColor={'lightgray'}
                      borderRadius={1}
                    >
                      {isContentExpanded
                        ? content
                        : content.substring(0, 100) + (content.length > 100 ? '...' : '')}
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
                      <Typography variant="expanderButton">Click to see more...</Typography>
                    </Box>
                  </Container>
                </>
              );
            })}
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
            onClick={(evt) => openPDFPreview(id, evt)}
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
  );
}
