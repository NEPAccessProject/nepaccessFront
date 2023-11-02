import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Snackbar,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import React, { useState } from 'react';
import theme from '../../styles/theme';
import AvailablePDFsList from '../PDFViewer/AvailablePDFsList';
//https://react-pdf-viewer.dev/examples/
import axios from 'axios';
import fileDownload from 'js-file-download';
import { useEffect } from 'react';
import Globals from '../../globals';
import PDFViewerContainer from '../PDFViewer/PDFViewerContainer';
import PDFViewerContext from '../PDFViewer/PDFViewerContext';
import { PageNavButtons } from './PageNavButtons';

export const useStyles = makeStyles((theme) => ({
  centered: {},
  link: {
    fontSize: '0.9em',
    color: '#4007a2',
    cursor: 'pointer',
    borderRadius: 0,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  item: {
    //margin: 5,
    padding: 5,
    borderRadius: 1,
    '&:hover': {
      boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.5)',
      cursor: 'pointer',
      '& .addIcon': {
        color: 'purple',
      },
    },
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 1,
}));

//Function adds two numbers

export default function PDFViewerDialog(props) {
  useEffect(() => {
    _mounted.current = true;
    return () => {
      _mounted.current = false;
    }
  })
  const ctx = React.useContext(PDFViewerContext);
  const { record, isOpen, onDialogClose } = props;
  //  const { q,id } = useParams();
  const _mounted = React.useRef(false);
  return (
      <Box sx={{ marginTop: 20 }}>
        <Dialog
          id='pdf-viewer-dialog'
          open={isOpen}
          //fullScreen
          maxWidth='lg'
          maxHeight='lg'
          onClose={(evt) => onDialogClose(evt)}>
          <DialogContent>

            <DialogContentText id='pdf-viewer-dialog-content'>
              <DialogTitle>
                <Grid
                  container
                  display={'flex'}
                  justifyContent={'flex-end'}
                  alignItems={'center'}>
                  <IconButton onClick={(evt) => onDialogClose(evt)}>
                    <Typography fontWeight={'bold'} fontSize={'large'}>
                      X
                    </Typography>
                  </IconButton>
                </Grid>
              </DialogTitle>
              <PDFViewerContainer {...props}/>
              <Divider />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Box>
  );
}


