import {
  Grid,
  Paper
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
					alignSelf={'centered'}
          padding={2}
          >
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
