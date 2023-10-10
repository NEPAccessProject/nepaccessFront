import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import theme from '../styles/theme';
import SearchContext from './SearchContext';
import { common } from '@mui/material/colors';
import { PropTypes, string } from 'prop-types';

const useStyles = withStyles((theme) => ({
  expanderButton: {
    width: '100%',
    padding: 1,
    borderRadius: 0,
    border: 0,
  }
}));


export default function RenderSnippets(props) {
  const {
    record
  } = props;

  //console.log('RenderSnippets props.record', record);
  const { state, setState } = useContext(SearchContext);

  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { hideText, hidden,showContext } = state;
  console.log(`file: SearchResultSnippets.jsx:30 ~ RenderSnippets ~ state:`, state);
  const _mounted = useRef(false);
  function convertToHTML(content) {
    return { __html: content };
  }
  return (
    // useEffect(() => {
    //   console.log('useEffect for content expanded');
    // },[isContentExpanded]);
    record.plaintext.map((text, idx) => {
      return (
        <>
          <Box key={record.id}>
            <Snippets key={record.id} showContext={showContext} text={text} record={record} />
          </Box>
        </>
      )
    }))
}
RenderSnippets.prototypes = {
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    processId: PropTypes.number.isRequired
  }),
  plaintext: PropTypes.arrayOf(PropTypes.string).isRequired
}

function Snippets(props) {
  const { text, record,showContext} = props;
  const { id, processId } = record;
  const { state, setState } = useContext(SearchContext);

  //  console.log("🚀 ~ file: SearchResultsItems.jsx:343 ~ RenderSnippets ~ record:", record)
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { hideText, hidden } = state;

  const _mounted = useRef(false);
  useEffect(() => {
    _mounted.current = true
    return (() => {
    })
  }, [])

  const classes = useStyles(theme);


  /*Originaly the app was designed to render the markup embedded with tags using:
    <div dangerouslySetInnerHTML={convertToHTML(text.slice(0,255))} />
    However, this can either break the page by having an unclosed tag(s) and give a potential XSS vector
*/
  const snippet = text.replace(/<\/?[^>]+(>|$)/g, "");
  //    console.log(`🚀 ~ file: SearchResultSnippets.jsx:65 ~ Snippets ~ snippet:`, snippet);
  function convertToHTML(content) {
    return { __html: content };
  }
  function toggleContentExpansion(evt, id) {
    console.log(`Content Expansion Called for id ${id} evt:`, evt);
    setIsContentExpanded(!isContentExpanded)
  }

  //if there is not text to display, render nothing
  if (!showContext || (!text || text.length === 0)) {
    return (
      <></>
    )
  }
  else {
    return (
      <>
        <Box borderTop={1} borderColor="#ccc">
          {showContext && (snippet.length >= 100  && !isContentExpanded)
            &&
            <Box padding={2}>
              <Typography>{snippet.slice(0, 99)}...</Typography>
              <Box
                id="click-to-see-more-box"
                // onClick={(evt) => toggleContentExpansion(evt, id)}
              > 

                <Button
                  variant='contained'
                  // color="primary"
                  width='100%'
                  onClick={(evt) => toggleContentExpansion(evt, id)}
                  sx={{
                    width: '100%',
                    padding: 1,
                    borderRadius: 0,
                    border: 0,
                  }}
                >
                  Click to See More...
                </Button>
              </Box>
            </Box>
  }
  {showContext && (snippet.length >= 100  && isContentExpanded) && (
            <Box id="click-to-see-less-button-container"
              paddingTop={0}
              paddingBottom={0}
            >
              {snippet}
              <Button
                variant='contained'
                // color='secondary'
                width='100%'
                onClick={(evt) => toggleContentExpansion(evt, id)}
                sx={{
                  width: '100%',
                  padding: 1,
                  borderRadius: 0,
                  border: 0,
                }}
              >
                Click to See Less</Button>
            </Box>
          )}
        </Box>
      </>
    )
  }
}
Snippets.prototypes = {
  text: string,
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    processId: PropTypes.number.isRequired
  })
}