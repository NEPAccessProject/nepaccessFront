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
    record: IFile;
}

export default function PDFViewerContainer(props:IProps) {

  console.log(`🚀 ~ file: PDFViewerDialog.jsx:298 ~ PDFContainer ~ props:`, props);
  // const classes = useStyles();
  const {file} = props;
  let fileUrl = `/docs/${file.folder}/${file.filename}`;
  fileUrl = '/docs/EisDocuments-249854_Draft/summary.pdf'
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
          <Typography variant={'h4'}>PROPS FILE?</Typography>
            PATH: {file.path}
            FILE URL {fileUrl}
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
