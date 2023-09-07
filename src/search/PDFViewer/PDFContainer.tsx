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

interface IProps {
    file: IFile
    currentFile: IFile;
}

export default function PDFContainer(props:IProps) {
//  console.log(`🚀 ~ file: PDFViewerDialog.jsx:298 ~ PDFContainer ~ props:`, props);
  // const eisDoc: IEISDoc = file.eisdoc;
  // const classes = useStyles();
  const {file} = props;
  console.log("🚀 ~ file: PDFContainer.tsx:35 ~ PDFContainer ~ props:", props)
  if(!file) return (<div>File not found</div>);
  const fileUrl = `/docs/${file.filename}`;
  console.log(`🚀 ~ file: PDFContainer.tsx:36 ~ PDFContainer ~ fileUrl:`, fileUrl);
  return (
		<Paper
			elevation={1}
			id='pdf-container-viewer'
			sx={{}}>
			<Grid
				container
				spacing={2}
				id='pdf-container-grid-container'>
				{/* <Grid xs={12} item className={classes.centered} id="pdf-container-grid-item" >
          <Grid container flex={1} alignItems={'flex-start'} id="pdf-docs-grid-container">
            {file.filename && <Grid item lg={3} md={4} xs={6} className={classes.item}><Paper>File: {file.filename}</Paper></Grid>}
            {file.status && <Grid item lg={3} md={4} xs={6} className={classes.item}><Paper>Status: {file.status}</Paper></Grid>}
            {file.alignItems && <Grid item lg={3} md={4} xs={6}><Paper className={classes.item}>Decision: {file.decision}</Paper></Grid>}
            {file.agency && <Grid item lg={3} md={4} xs={6}><Paper className={classes.item}>Agency: {file.agency}</Paper></Grid>}
            {(eisdoc && eisdoc.notes) && <Grid item lg={3} md={4} xs={6}><Paper className={classes.item} >Notes: {eisdoc.notes}</Paper></Grid>}
            {(eisdoc && eisdoc.summaryText) && <Grid item lg={3} md={4} xs={6}><Paper className={classes.item} >Summary: {eisdoc.summaryText}</Paper></Grid>}
          </Grid>
        </Grid> */}
				<Grid
					item
					xs={12}
					id='pdf-viewer-container-grid-item'
					alignSelf={'centered'}>
					<PDFViewer
						{...props}
            file={file}
						fileUrl={fileUrl}
					/>
				</Grid>
			</Grid>
		</Paper>
	);
}
