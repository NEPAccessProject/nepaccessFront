import React, { useState, useEffect } from 'react';
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

export default function SearchResultItems(props){
    const {status,id,title,content,link,resultsText} = props;
    return (
        <>
        <Box>

              <Typography p={2} pl={4} variant="searchResultTitle">
                <a href={"https://www.nepaccess.org/record-details?id=" + id}>
                    {`${status} ${title}`}
                </a>
              </Typography>
            
            <Container>
              <Box bgcolor="#f4f4f4" padding={1} border={1} borderColor={'lightgray'} borderRadius={1}>
                 {content}
              </Box>
            </Container>
        </Box>
        </>
    )
}