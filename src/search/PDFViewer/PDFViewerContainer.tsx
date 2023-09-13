import {
  Grid,
  Paper,
  Typography
} from '@mui/material';
import React from 'react';
import { IEISDoc, IFile } from '../Interfaces';
import PDFViewer from './PDFViewer';

interface IProps {
    file: IFile
    currentFile: IFile;
    doc: IEISDoc;
}

export default function PDFViewerContainer(props:IProps) {
  console.log(`🚀 ~ file: PDFViewerDialog.jsx:298 ~ PDFContainer ~ props:`, props);
  // const classes = useStyles();
  const {file,doc} = props;
  console.log("🚀 ~ file: PDFViewerContainer.tsx:19 ~ PDFViewerContainer ~ file:", file)
  console.log("🚀 ~ file: PDFContainer.tsx:35 ~ PDFContainer ~ props:", props)
  const fileUrl = `/docs/${file.folder}/${file.filename}`;
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
            {/* <Typography>File ID: {file.id}</Typography>
            <Typography>Process ID: {file.eisdoc.processId}</Typography>
            <Typography>Folder: {file.folder}</Typography>
            <Typography>Relative Path {file.relativePath}</Typography>
            <Typography>Filename: {file.folder}</Typography>
            <Typography>File Path: {fileUrl}</Typography> */}
            {/* <Typography>Title: {(eisdoc.title) ? eisdoc?.title : "N/A"}</Typography>
            <Typography>Notes: {(eisdoc.notes) ? eisdoc?.notes : "N/A"}</Typography> */}
          <Typography>Start PDF Viewer</Typography>
					<PDFViewer
						{...props}
            
            file={file}
						fileUrl={fileUrl}
					/> 
                    <Typography>END PDF Viewer</Typography>
				</Grid>
			</Grid>
		</Paper>
	);
}
