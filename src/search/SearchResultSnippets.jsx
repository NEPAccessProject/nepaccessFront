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
  const { hideText, hidden, showContext } = state;
  const _mounted = useRef(false);
  const maxSnippetLength = 255;
  function convertToHTML(content) {
    return { __html: content };
  }

  useEffect(() => {
    _mounted.current = true
    return (() => {
      _mounted.current = false
    })
  })
  return (
    //Loop through each snippet and render it
    // record.plaintext.map((text, idx) => {
    //     <>
          <Box key={record.id}>
            <Snippets key={record.id} showContext={showContext} text={record.plaintext[0]} record={record} />
          </Box>
        // </>
  );
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
  const { text="", record, showContext } = props;
  const { id, processId } = record;
  const { state, setState } = useContext(SearchContext);
  //  console.log("🚀 ~ file: SearchResultsItems.jsx:343 ~ RenderSnippets ~ record:", record)
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { hideText, hidden } = state;
 const maxSnippetLength = 255;
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
  else if (showContext) {
    return (
      <Grid display={'flex'} xs={12} id="grid-snippet-container" container>
        {snippet && (
          <Grid item xs={12} display={'flex'}  id="grid-snippet-snippet-box">
            <Typography variant='textSnippet' padding={2}>
                {!isContentExpanded && snippet.length >= maxSnippetLength ? snippet.slice(0, maxSnippetLength) : snippet}
                {isContentExpanded && snippet}
            </Typography>
          </Grid>
        )}

        {snippet.length && snippet.length >= maxSnippetLength && (
          <Grid item xs={12} display={'flex'} id="grid-snippet-expand-box" width={'100%'}>
            <Button
              id="grid-snippet-expand-button"
              fullWidth={true}
              variant='contained'
              color="primary"
              onClick={(evt) => toggleContentExpansion(evt, id)}
              sx={{
                width:'100%',
                borderRadius: 0,
              }}
            >
              Click to See {isContentExpanded ? 'Less' : 'More'}
            </Button>
          </Grid>
        )}
      </Grid>
    )
  }
  else {
    return (
      <Box>
        NOTHING????
      </Box>)
  }
}