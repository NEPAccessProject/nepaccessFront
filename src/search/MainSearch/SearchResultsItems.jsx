import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useContext, useState } from 'react';
import theme from '../../styles/theme';
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

const useStyles = (theme) => ({
  centeredContent: {
  verticalAlign: 'center',
        textAlign: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        justifyItems: 'center',
        border: 1,
        borderColor:"black",
  },
  autocomplete: {},
});

const sortByDate = (a, b) => {
  if (a.record && a.record.commentDate && b.record && b.record.commentDate) {
    return a.commentDate > b.commentDate;
  } else if (a.commentDate && a.commentDate) {
    return a.commentDate > b.commentDate;
  }
};
export default function SearchResultItems(props) {
  const { showContext } = useContext(SearchContext);
  const classes = useStyles(theme);

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
                <SearchResultItem record={record} />
                <Divider/>
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
  const classes= useStyles(theme);
  
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
      className={classes.centeredContent}
      xs={12}
      border={1}
      sx={{
        marginTop: 2,
        marginBottom: 2,
        elevation: 0,
      }}
    >
      <>
        {/* <Typography variant="searchResultSubTitle" padding={2}>
          {documentType} - {title}
        </Typography> */}
      </>
        <Grid
          item
          id="year-box"
          display={'flex'}
          xs={1}
          borderColor={'#lightgray'}
          border={1}
          classes={classes.centeredContent}
        >
          <Typography
            id="year-typography"
            sx={{
              alignContent: 'center',
              justifyItems: 'center',
              border: 0,
              borderColor: '#ccc',
            }}
            fontWeight={'bold'}
          >
            {year ? year : 'N/A'}
          </Typography>
          </Grid>

        <Grid
          item
          id="status-box"
          display={'flex'}
          xs={1}
          borderColor={'darkgray'}
          border={1}
          className={classes.centeredContent}
        >
          <Typography
            id="status-typography"
            sx={{
              alignContent: 'center',
              justifyItems: 'center',
              border: 0,
              borderColor: '#ccc',
            }}
            fontWeight={'bold'}
          >
            {documentType}
          </Typography>
        </Grid>
        <Grid
          display={'flex'}
          container
          id="button-grid-container"
          xs={7}
          flex={1}
          border={0}
          className={classes.centeredContent}
        >
          Text goes here
          <RenderSnippets record={record}/>
        </Grid>
        <Grid
          display={'flex'}
          container
          id="button-grid-container"
          xs={3}
          flex={1}
          border={0}
          className={classes.centeredContent}
        >
          <Grid
            id="preview-button-grid-item"
            item
            display={'flex'}
            xs={6}
            className={classes.centeredContent}           
            border={0}
          >
            <PDFViewerDialog
              id="preview-button-grid-item"
              record={record}
              isOpen={isPDFViewOpen}
              onDialogClose={(evt) => closePDFPreview(id, evt)}
            />
            <Button onClick={(evt) => openPDFPreview(id, evt)} color={'secondary'}>
              Preview
            </Button>
          </Grid>
          <Grid
            id="preview-button-grid-item"
            item
            display={'flex'}
            xs={6}
            className={classes.centeredContent}
            border={0}
          >
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
                //             width: '80%',
                alignSelf: 'center',
                justifySelf: 'center',
              }}
            >
              Download
            </Button>
          </Grid>
        </Grid>
      </Grid>
  );
}

export function RenderSnippets(props){
    const { record } = props;
    const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const { seachState, setSearchState, showContext } = useContext(SearchContext);
    record.plaintext.push("placeholder text");
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
  return (
    <>
    
        <Box className={'search-result-item-container'}>
          <Box padding={1}>
            {isContentExpanded && record.plaintext[0] && record.plaintext[0].length >= 100 ? (
              <div dangerouslySetInnerHTML={convertToHTML(record.plaintext[0])} />
            ) : record.plaintext[0] && record.plaintext[0].length >= 100 ? (
              `${record.plaintext[0].substring(0, 100)}...`
            ) : (
              <div></div>
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
            {!isContentExpanded && record.plaintext[0] && record.plaintext[0].length >= 100 ? (
              <Typography variant="expanderButton">Click to see more...</Typography>
            ) : (
              <Typography variant="expanderButton">Click to see less...</Typography>
            )}
          </Box>
        ) : (
          <></>
        )}
    </>
  );
}
