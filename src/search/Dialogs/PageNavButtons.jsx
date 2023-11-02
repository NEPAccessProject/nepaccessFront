import { Button, Grid } from '@mui/material';
import React from 'react';
import theme from '../../styles/theme';
import { useStyles } from './PDFViewerDialog';


export function PageNavButtons(props) {
  const { currentFileIndex, files, onFileLinkClicked, onLoadPreviousFile, onLoadNextFile } = props;
  const classes = useStyles(theme);
  return (
    <>

      <Grid container xs={12} flex={1} justifyContent={'center'} alignItems={'flex-start'} id='button-grid-container'>
        <Grid
          item
          alignItems={'center'}
          display='flex'
          flex={1}
          id='previous-button-grid-item'
          justifyContent={'center'}
          paddingBottom={1}
          paddingTop={1}
          xs={6}>
          <Button
            variant='outlined'
            disabled={currentFileIndex === 0 || files.length === 0}
            onClick={onLoadPreviousFile}>
            Previous File
          </Button>
        </Grid>
        <Grid
          item
          display='flex'
          flex={1}
          justifyContent={'center'}
          alignItems={'center'}
          id='next-button-grid-item'>
          <Button
            variant='outlined'
            disabled={(files.length <= 1)}
            color='primary'
            onClick={onLoadNextFile}>
            Next File
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
