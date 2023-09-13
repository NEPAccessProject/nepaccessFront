import {
  Button,
  Divider,
  Grid,
  ListItem,
  Paper,
  Typography
} from '@mui/material';
import theme from '../../styles/theme';
//import {InboxIcon,MailIcon} from '@mui/icons-material'
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import Axios from 'axios';
import fileDownload from 'js-file-download';
import React from 'react';
import { IFile, IFiles } from '../Interfaces';
import SearchContext from '../SearchContext';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

interface IStyles {
	centered: {
		textAlign: string;
	};
}
interface IProps {
	files: IFiles;
  currentFile: IFile;
	onFileLinkClicked: any; //[TODO][REFACTOR] Set to proper type (React.MouseEvent<React.HTMLElement>:evt,number) => {};
  
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: '#f9f9f9',
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
	}),
);


export default function AvailablePDFsList(props: IProps) {
	console.log("🚀 ~ file: AvailablePDFsList.tsx:67 ~ AvailablePDFsList ~ props:", props)
	const {files = [],currentFile ,onFileLinkClicked} = props;
  const ctx = React.useContext(SearchContext);
	const classes = useStyles(theme);

  if(!files || !files.length) {
  return (<>  
    <Typography variant='h4'>No Files Found</Typography>
    
  </>);
  }
 if(!currentFile) {
    return (<>  
      <Typography variant='h4'>No File Selected</Typography>
      
    </>);
 }


	//  const eisDoc: IEISDoc = file.eisdoc;
  const downloadLink = `${files[0].folder}${files[0].filename}`;
  
  
  function onDownloadZip(url: string, filename: string) {
      Axios.get(url, {
        responseType: 'blob',
      }).then(res => {
        fileDownload(res.data, filename);
      });
    }
	//  const eisDoc: IEISDoc;

  return (
		<>
			<Paper sx={{}}>
				<Grid container>
					<Grid
						item
						xs={12}
						textAlign={'center'}
						classes={classes.centered}
						padding={2}>
						<Typography variant='h4'>#{files.length} Related Files</Typography>
						<Typography variant='h6'>
							Selected File ID {currentFile.id}{' '}
						</Typography>
						<Divider />
					</Grid>
					<Grid item xs={12}>
						{files &&
							files.length &&
						files.map((file: any, idx: number) => (
								<ListItem key={file.id}>
									<Typography
										textAlign={'left'}
										display={'block'}
										variant={'caption'}>
                      {/* {`${file.relativePath}/${file.filename}`} */}
                      
												<>
													<Typography
														key={file.id - file.filename}
														textAlign='left'
                            justifyContent={'flex-start'}
                            >
														<Button
															sx={{ width: '100%', border:0, padding:0,margin:0 }}
															color='primary'
															onClick={(evt) =>
																onFileLinkClicked(evt, idx, file)
															}
															variant={currentFile.id === file.id ? 'outlined' : 'text'
															}>
															{file.filename}
														</Button>
													</Typography>
												</>
									</Typography>
								</ListItem>
							))}
						<Divider />
						<Grid item xs={12}>
							<Button
								name='download'
								variant='contained'
								color='primary'
								id='download-zip-button'
                onClick={() => onDownloadZip(downloadLink, `${(currentFile?.folder) ? currentFile.folder : ""}/${currentFile.filename}`)}
								sx={{
									width: '100%',
                  borderRadius:0
								}}>
								  Download All - {downloadLink}
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
}

