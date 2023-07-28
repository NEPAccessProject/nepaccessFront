import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useContext, useState } from 'react';
import PDFViewerDialog from './PDFViewerDialog';
import SearchContext from './SearchContext';
import SearchTips from './SearchTips';
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
  const { showContext } = useContext(SearchContext);
  console.log(
    '🚀 ~ file: SearchResultsItems.jsx:37 ~ SearchResultItems ~ SearchContext:',
    SearchContext,
  );

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
        {result && result.records && result.records.length ? (
          result.records.map((record, idx) => {
            return (
              <Item key={idx} className="search-result-item-container">
                {/* <h2>Passing Record?</h2>
                {JSON.stringify(record)} */}
                <SearchResultItem record={record} />
              </Item>
            );
          })
        ) : (
          <div>
            <Typography>
              No results Found
            </Typography>
            <SearchTips/>

          </div>
        )}
      </Box>
    </>
  );
}

export function SearchResultItem(props) {
  console.log('🚀 ~ file: SearchResultsItems.jsx:46 ~ SearchResultItem ~ props:', props);
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { seachState, setSearchState, showContext } = useContext(SearchContext);

  const onCheckboxChange = (evt) => {
    console.log('Checkbox changed, setting showContext to ', evt.target.checked);
    setSearchState({
      ...searchState,
      showContext: evt.target.checked,
    });
  };

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
  function closePDFPreview(id) {
    setIsPDFViewOpen(false);
  }
  function toggleContentExpansion(id, evt) {
    console.log(
      '🚀 ~ file: SearchResultsItems.jsx:121 ~ toggleContentExpansion ~ evt:',
      evt.name,
      evt.name.value,
    );
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
  const text = record.plaintext || '';
  console.log('🚀 ~ file: SearchResultsItems.jsx:134 ~ SearchResultItem ~ text:', text);
  return (
    <Grid
      container
      id="search-result-item-root-item"
      flex={1}
      flexGrow={1}
      xs={{
        marginTop: 2,
        marginBottom: 2,
        elevation: 0,
      }}
    >
      <Typography variant="searchResultSubTitle" padding={2}>
        {documentType} - {title} - ID {record.id}
      </Typography>
      <Grid
        className={'search-result-item-grid-container'}
        flex={1}
        flexGrow={1}
        display={'flex'}
        container
      >
        <Grid item
          id="year-box"
          display={'flex'}
          xs={1}
          borderColor={'#lightgray'}
          border={0}
          alignItems={'center'}
          justifyContent={'center'}
          sx={{
            verticalAlign: 'center',
            textAlign: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          <Typography
            id="year-typography"
            sx={{
              alignContent: 'center',
              justifyItems: 'center',
              border: 1,
              borderColor: '#ccc',
            }}
            fontWeight={'bold'}
          >
            {year ? year : 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={9} id="search-result-item">
          <Box className={'search-result-item-container'}>
            <Box
              bgcolor="#f4f4f4"
              padding={1}
              border={0}
              borderColor={'lightgray'}
              borderRadius={1}
              paddingTop={1}
              paddingBottom={1}
              sx={{
                border: 1,
                borderColor: '#ccc',
              }}
            >
              {(isContentExpanded && record.plaintext[0] && record.plaintext[0].length >= 100)
              ? (
                  <div dangerouslySetInnerHTML={convertToHTML(record.plaintext[0])} />
              )
              :
                (
                (record.plaintext[0] && record.plaintext[0].length >= 100) 
                  ? (`${record.plaintext[0].substring(0, 100)}...`) 
                  : (<div></div>)
                
              )}
            </Box>
          </Box>
          {record.plaintext[0] && record.plaintext[0].length ? (
            <Box
              id="click-to-see-more-box"
              width={'100%'}
              alignContent={'center'}
              textAlign={'center'}
              onClick={toggleContentExpansion}
              bgcolor="#A2A5A6"
              paddingTop={1}
              paddingBottom={1}
            >
              {(record.plaintext[0] && record.plaintext[0].length >= 100) 
              ? (
                <Typography variant="expanderButton">Click to see more...</Typography>
              ) 
              : (
                <>Something else</>
              )}
            </Box>
          ) : (
            <div>Click to see Less</div>
          )}
        </Grid>
        <Grid item xs={2} alignContent={'flex-end'} justifyContent={'flex-end'}>
          <Button
            color="primary"
            onClick={(evt) => handleDownloadClick(evt, id)}
            sx={{
              width: '90%',
            }}
          >
            Download
          </Button>
          <PDFViewerDialog
            id={id}
            record={record}
            isOpen={isPDFViewOpen}
            onDialogClose={(evt) => closePDFPreview(id, evt)}
          />
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
    </Grid>
  );
}
