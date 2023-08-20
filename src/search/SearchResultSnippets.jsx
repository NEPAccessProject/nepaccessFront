import React, { useContext, useState,useRef } from 'react';
import {Box,Button, Container, Grid, Typography } from '@mui/material';
import { makeStyles, withStyles, useStyles } from '@mui/styles';
import theme from '../styles/theme';
import SearchContext from './SearchContext';


export default function RenderSnippets(props) {
    const {
      record
    } = props;
      console.log('RenderSnippets props.record', record);
    const { state, setState } = useContext(SearchContext);
  
  
    //  console.log("🚀 ~ file: SearchResultsItems.jsx:343 ~ RenderSnippets ~ record:", record)
    const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const { hideText, hidden } = state;
    const  _mounted = useRef(false);
    function convertToHTML(content) {
      return { __html: content };
    }
    function toggleContentExpansion(evt, id) {
      //console.log(`toggleContentExpansion id: ${id} evt~ evt`, evt);
      //console.log('Setting isContentExpanded to',!isContentExpanded);
      setIsContentExpanded(!isContentExpanded);
      evt.preventDefault();
    }
    return (
      // useEffect(() => {
      //   console.log('useEffect for content expanded');
      // },[isContentExpanded]);
      record.plaintext.map((text, idx) => {
        return (
          <>
           <Box key={record.id}> <Snippets text={text} /></Box>
          </>
        )
      }))
  }
  
  //priveate function
  function Snippets(props) {
    const { text, hidden, isContentExpanded, id, processId } = props;
    console.log("🚀 ~ file: SearchResultsItems.jsx:462 ~ Snippets ~ props:", props, `Snipets length is ${text.length}`)
    function convertToHTML(content) {
      return { __html: content };
    }
    function toggleContentExpansion(evt, id) {
      console.log(`Content Expansion Called for id ${id} evt:`, evt);
    }
    return (
      <>
        <Box backgroudCcolor="#A2A5A6">
        {text.length > 99
          ? 
            <Box border={0} borderColor={"#ccc"} backgroudColor="#A2A5A6">
              <div dangerouslySetInnerHTML={convertToHTML(text.slice(0,255))} />
              <Box
              id="click-to-see-more-box"
              width={'100%'}
              alignContent={'center'}
              textAlign={'center'}
              justifyContent={'center'}
              onClick={(evt) => toggleContentExpansion(evt, id)}
              bgcolor="#A2A5A6"
              paddingTop={0}
              paddingBottom={0}>
                <Typography variant="expanderButton">
                  <Button Button sx={{
                  fontColor: 'white',
                  color: 'white',
                }}>Click to See More</Button>
                </Typography>
              </Box>
          </Box>
            : 
            <Box width={'100%'}
              backgroundColor="#A2A5A6"
              alignContent={'center'}
              textAlign={'center'}
              justifyContent={'center'}
              onClick={(evt) => toggleContentExpansion(evt,id)}
  
              paddingTop={0}
              paddingBottom={0}>
              <Typography color="white" variant="expanderButton">
                <Button>Click to See Less</Button>
              </Typography>
            </Box>
        }
          </Box>
  
        {/* <Box className={'content-snippets--result-item-container'}>
          <Divider />
          <Box>
            {(text.length > 0)
              &&
              <Box border={1}><div dangerouslySetInnerHTML={convertToHTML(text)} /></Box>
            }
          </Box>
          <Box padding={1}>
            {isContentExpanded && text && text.length <= 100
              &&
              <div dangerouslySetInnerHTML={convertToHTML(text)} />
            }
            {!isContentExpanded && text && text.length >= 100
              && (
                <div dangerouslySetInnerHTML={convertToHTML(text.substring(0, 100) + '...')} />
              ) 
              }
          </Box>
        </Box>
        <Box
          id="click-to-see-more-box"
          width={'100%'}
          alignContent={'center'}
          textAlign={'center'}
          justifyContent={'center'}
          onClick={(evt) => toggleContentExpansion(evt,)}
          bgcolor="#A2A5A6"
          paddingTop={1}
          paddingBottom={1}
        >
          {isContentExpanded && text.length >= 100
            ? 
              <Typography variant="expanderButton">
                Click to See less
              </Typography>
            : 
              <Typography color={'#fff'} variant="expanderButton">Click to to See More...</Typography>
          }
        </Box>
          <Typography align='center'>This document's content is not available - {text.length} </Typography> */}
  
      </>
    )
  }