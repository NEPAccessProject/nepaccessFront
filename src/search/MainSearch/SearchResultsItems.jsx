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
const handleDownloadClick = (id) => {
  console.log('handleDownloadClick', id);
};
export default function SearchResultItems(props) {
  const { status, id, title, content, link, resultsText } = props;
  return (
    <>
      <Box>
        <Typography p={2} pl={4} variant="searchResultTitle">
          <a href={'https://www.nepaccess.org/record-details?id=' + id}>{`${status} ${title}`}</a>
        </Typography>

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
                {content}
              </Box>
            </Container>
          </Grid>
          <Grid item xs={2}>
            <Button color="primary" onClick={handleDownloadClick(id)} 
              sx={{
                width: '100%'
              }}
            >
              Download
            </Button>
            <Button color={"secondary"}
              sx={{
                width: '100%',
                mt:1
              }}
            > Preview </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
