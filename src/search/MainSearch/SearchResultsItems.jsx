import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
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
  console.log(
    '🚀 ~ file: SearchResultsItems.jsx:58 ~ SearchResultItems ~ sortedRecords:',
    sortedRecords,
  );

  /* Merge doc and records */
  return (
    <>
    {/* <h2>Search Result Items Result?</h2>
    {JSON.stringify(result)} */}
      <Box marginTop={1} marginBottom={1} id="search-results-container-box">
        {(result && result.records && result.records.length) ? (
          result.records.map((record, idx) => {
            return (
              <Item key={idx} className='search-result-item-container'>
                {/* <h2>Passing Record?</h2>
                {JSON.stringify(record)} */}
                <SearchResultItem record={record} />
              </Item>
            );
          })
        ) : (
          <div>No results Found</div>
        )}
      </Box>
    </>
  );
}

export function SearchResultItem(props) {
  //  console.log('🚀 ~ file: SearchResultsItems.jsx:46 ~ SearchResultItem ~ props:', props);
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const {seachState,setSearchState,showContext} = useContext(SearchContext);
  const { record } = props;
  console.log('🚀 ~ file: SearchResultsItems.jsx:91 ~ SearchResultItem ~ record:', record);
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
    console.log("🚀 ~ file: SearchResultsItems.jsx:121 ~ toggleContentExpansion ~ evt:", evt.name, evt.name.value)
    evt.preventDefault();
    console.log(`Open toggleContentExpansion for ID: ${id}`);
    setIsContentExpanded(!isContentExpanded);
  }

  const handleDownloadClick = (evt, id) => {
    evt.preventDefault();
    console.log('Download ID Value and filename', id, filename);
  };

 function convertToHTML(content) {
   return { __html: content };
 }

  const year = commentDate && commentDate.length > 0 ? new Date(commentDate).getFullYear() : 'N/A';
  console.log('SEARCH STATE SearchResultComponent');
  const text = record.plaintext || "";
  console.log("🚀 ~ file: SearchResultsItems.jsx:134 ~ SearchResultItem ~ text:", text)
  return (
    <Item
      id="search-result-item-root"
      xs={{
        marginTop: 2,
        marginBottom: 2,
        elevation: 0,
      }}
    >
      {/* {JSON.stringify(record.plaintext)} */}
      <Typography variant="searchResultSubTitle" padding={2}>
        {documentType} - {title}
      </Typography>
      <Grid className={'search-result-item-grid-container'} flex={1} container>
        <Grid item xs={1} textAlign={'center'}>
          <Typography fontWeight={'bold'}>{year ? year : 'N/A'}</Typography>
        </Grid>
        {record.plaintext[0] && record.plaintext[0].length> 0 ? (
          <Grid item xs={9}>
            <Container className={'search-result-item-container'}>
              <Box
                bgcolor="#f4f4f4"
                padding={1}
                border={0}
                borderColor={'lightgray'}
                borderRadius={1}
                paddingTop={1}
                paddingBottom={1}
              >
                {isContentExpanded ? (
                  <div dangerouslySetInnerHTML={convertToHTML(record.plaintext[0])} />
                ) : (
                  <>
                    <div dangerouslySetInnerHTML={convertToHTML(record.plaintext[0])} />
                    {record.plaintext[0].substring(0, 100) +
                      (record.plaintext[0].length > 100
                        ? `${record.plaintext[0].substring(0, 100)}...`
                        : '')}
                  </>
                )}
              </Box>
            </Container>
            {record.plaintext[0] ? (
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
            ) : (
              <div>Nothing {record.plaintext[0].length}</div>
            )}
          </Grid>
        ) : (
          <Grid item xs={9}>
            <Box
              bgcolor="#f4f4f4"
              padding={1}
              border={0}
              color={'black'}
              borderColor={'lightgray'}
              borderRadius={1}
              Content
              Not
              Available
            >
              <Typography color={'black'} variant="expanderButton">
                Content Not Available
              </Typography>
            </Box>
          </Grid>
        )}
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
    </Item>
  );
}
