import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Button,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import theme from '../../styles/theme';
import { makeStyles,createStyles } from '@mui/styles';
import {Theme} from '@mui/material/styles';
import React, { useDebugValue, useState } from 'react'
import PDFViewer from './PDFViewer';
import { CircularProgress} from '@material-ui/core';
import _ from 'lodash';
import {IFile,IFiles,IEISDoc} from '../Interfaces';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

interface IStyles {
  centered: {
    textAlign: string
  }
}
interface IProps {
  files: IFiles,
  onPDFListFileSelect: ()=>{}
}

const useStyles = makeStyles((theme: Theme) => createStyles({
         root:{
            backgroundColor : '#f9f9f9',
         },
         centered: {
           textAlign: 'center',
         },
         button: {
           margin: theme.spacing(1),
         },
         input: {
           display: 'none',
         },
         pdfViewer: {
           height: '100%',
           width: '100%',
         },
       }));

export default function AvailablePDFsList(props : IProps) {

  const onPDFListFileSelect : (number)=>{} = props.onPDFListFileSelect;

  const files:IFiles = props.files;
//  const eisDoc: IEISDoc = file.eisdoc;
  const classes = useStyles(theme);  
//  const eisDoc: IEISDoc;
  return (
    <>
      <Paper>
        <Grid container>
          <Grid item xs={12} textAlign={'center'} classes={classes.centered} padding={2}>
            <Typography variant="h4">Related Files</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <List sx={{
              padding:1,
            }}>
              {(files && files.length) && files.map((file: IFile, idx:number) => (
                <ListItem key={file.id}>
                  <Typography>
                    <Button onClick={()=>onPDFListFileSelect(file.id)} variant="text">
                      {file.filename}
                    </Button>
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}