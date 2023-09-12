import {
  Grid,
  Paper,
  Typography
} from '@mui/material';
import React from 'react';
import { IFile } from '../Interfaces';
import PDFViewer from './PDFViewer';

interface IProps {
    file: IFile
    currentFile: IFile;
}

export default function PDFContainer(props:IProps) {
//  console.log(`🚀 ~ file: PDFViewerDialog.jsx:298 ~ PDFContainer ~ props:`, props);
  // const eisDoc: IEISDoc = file.eisdoc;
  // const classes = useStyles();
  const {file} = props;
  const {eisdoc} = file;
  console.log("🚀 ~ file: PDFContainer.tsx:35 ~ PDFContainer ~ props:", props)
  if(!file) return (<div>File not found</div>);
  const fileUrl = `/docs/${file.filename}`;
  console.log(`🚀 ~ file: PDFContainer.tsx:36 ~ PDFContainer ~ fileUrl:`, fileUrl);
  return (
		<Paper
			elevation={1}
			id='pdf-container-paper'
			sx={{}}>
			<Grid
				container
				spacing={2}
				id='pdf-container-grid-container'>
				<Grid
					item
					xs={12}
					id='pdf-viewer-container-grid-item'
          >
            <Typography>File ID: {file.id}</Typography>
            <Typography>Process ID: {file.eisdoc.processId}</Typography>
            <Typography>Folder: {file.folder}</Typography>
            <Typography>Filename: {file.folder}</Typography>
            <Typography>File Path: {fileUrl}</Typography>
            <Typography>Title: {(eisdoc.title) ? eisdoc?.title : "N/A"}</Typography>
            <Typography>Notes: {(eisdoc.notes) ? eisdoc?.notes : "N/A"}</Typography>
					<PDFViewer
						{...props}
            
            file={file}
						fileUrl={'../../assets/example.pdf'}
					/> 
				</Grid>
			</Grid>
		</Paper>
	);
}
