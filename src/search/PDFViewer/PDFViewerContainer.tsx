import {
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { CircularProgress } from '@mui/material';
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
  const {currentFile} = props;
 // fileUrl = '/docs/EisDocuments-249854_Draft/summary.pdf'
 if(currentFile){
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
          alignContent={'center'}
					id='pdf-viewer-container-grid-item'
          >
					<PDFViewer
            file={currentFile}
						fileUrl={currentFile.zipPath}
					/> 

				</Grid>
			</Grid>
		</Paper>
	);
          }
          else{
            return(
              <Paper>
                <Grid container display={'flex'} alignContent={'center'} justifyContent={'center'} height={50} width={'100%'}>
                <CircularProgress/>
                </Grid>
              </Paper>
            )
          }
}
