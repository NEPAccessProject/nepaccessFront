import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Typography
} from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import theme from '../../styles/theme';
// import PDFViewer from '../../examples/PDFViewer/index.jsx';
// const [fullWidth, setFullWidth] = React.useState(true);
// const [maxWidth, setMaxWidth] = React.useState('md');
// import SearchContext from './SearchContext';
//https://codesandbox.io/s/pdf-view-l3i46?file=/src/Components/DrawArea.js
//https://react-pdf-viewer.dev/examples/
import axios from 'axios';
import { useEffect, useRef } from 'react';
import Globals from '../../globals';
import AvailablePDFsList from '../PDFViewer/AvailablePDFsList';
import PDFContainer from '../PDFViewer/PDFContainer';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

const useStyles = makeStyles((theme) => ({
	centered: {},
	link: {
		fontSize: '0.9em',
		color: '#4007a2',
		cursor: 'pointer',
		borderRadius: 0,
		'&:hover': {
			textDecoration: 'underline',
			//backgroundColor: theme.palette.grey[200],
			//      boxShadow: '0px 1px 1px rgba(0.5, 0.5, 0.5, 0.5)',
			//      cursor: 'pointer',
			// '& .addIcon': {
			//color: 'purple',
			// },
		},
	},
	item: {
		//margin: 5,
		padding: 5,
		border: 0,
		borderColor: '#ccc',
		borderRadius: 1,
		'&:hover': {
			backgroundColor: theme.palette.background,
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
	// textAlign: 'center',
	color: theme.palette.text.secondary,
	elevation: 1,
	border: 0,
	borderRadius: 1,
}));

export default function PDFViewerDialog(props) {
	//    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

//	let { record, isOpen, onDialogClose } = props;
const queryParams = useParams();
console.log('🚀 ~ file: PDFViewerDialog.jsx:88 ~ PDFViewerDialog ~ queryParams:', queryParams);
	const params = new URLSearchParams(window.location.search)
	console.log('all params:', params.getAll())
  //Strictly for debugging so I can test it without props
  const record = props.record || {
    id: 5970,
    title: 'Mock Record Title',
    processId: 1003943  
  }
  const isOpen = props.isOpen || params.get('isOpen');
  const id = record.id;
  const processId = record.processId;
  const onDialogClose = //props.onDialogClose || 
  (evt)=>{ console.log('onDialogClose evt',evt);
  }
  //let { id, processId } = record;

//  const { q,id } = useParams();
  console.log('🚀 ~ file: PDFViewerDialog.jsx:88 ~ PDFViewerDialog ~ q,processId,id:', q,processId,id);

	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [fullWidth, setFullWidth] = React.useState(true);
	const [maxWidth, setMaxWidth] = React.useState('md');
	const [files, setFiles] = useState([]);
	const [currentEisDoc, setCurrentEisDoc] = useState({});
	const [currentFileIndex, setCurrentFileIndex] = useState(0);
	const [currentFile, setCurrentFile] = useState({});

	const [hasWarning, setHasWarning] = useState("");
	const [hasError, setHasError] = useState("");
	const [hasInfo, setHasInfo] = useState("");
	const [hasSuccess, setHasSuccess] = useState("");
  const [message,setMessage] = useState("");

	let _mounted = useRef(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const samplePDF = 'https://arxiv.org/pdf/quant-ph/0410100.pdf';

	const classes = useStyles(theme);
	const getFilesById = async (id = 0) => {
		console.log('🚀 ~ file: PDFViewerDialog.jsx:111 ~ getFilesById ~ id:', id);
		if (_mounted.current !== true) {
			return;
		}
		let url = Globals.currentHost + `file/nepafiles?id=${id}`;
		try {
			const response = await axios.get(url);
			//remove all non pdf files
			const files = response.data.filter(
				(file) =>
					file.filename.slice(
						file.filename.lastIndexOf('.'),
						file.filename.length,
					) === '.pdf',
			);
			//setFiles(files);
			return files;
		} catch (e) {
			console.error(
				`Failed to get a list of files for id ${id}.With an Exception`,
				e,
			);
			return [];
		}
	};
	const getProcessByProcessId = async (processId = 0) => {
    setMessage('Loading Files');
    setHasInfo(true);

		console.log(
			'🚀 ~ file: PDFViewerDialog.jsx:132 ~ getProcessByProcessId ~ id:',
			processId,
		);
		if (_mounted.current !== true) {
			return;
		}
		let url =
			Globals.currentHost + `test/get_process_full?processId=${processId}`;
		try {
			const files = [];
			const response = await axios.get(url);
			const data = response.data;

			return data;
		} 
    catch (e) {
			console.error(
				`Failed to get a list of files for id ${processId}.With an Exception`,
				e,
			);
      setHasError(true)
      setMessage('Failed to get a list of files for id ${processId}.With an Exception')

			return [];
		}
	};

	useEffect(() => {
    if(!isOpen){
      return;
    }
		_mounted.current = true;
		return () => {
			_mounted.current = false;
		};
	}, [isOpen]);

	//[TODO] Only for testing longer load times and the spinner

  useEffect(async()=>{
    if(!_mounted.current){
      return;
    }
    async function getFiles(){
			const data = await getProcessByProcessId(processId);    
      data.map((item,idx)=>{
        const doc = item.doc;
        const filenames = item.filenames;

        // filenames.push({
        //   id: doc.id,
        //   processId: doc.processId,
        //   folder: doc.folder,
        //   filenames: _filenames
        // })

        files.push({
          ...doc,
          size: doc.size ? Math.round(doc.size / 1024 / 1024 ) : 'N/A' ,
          filename: doc.filename,
          filenames: filenames
        })
        const currentFile = files.filter((file)=>file.processId === processId && file.id === id);
        if(!currentFile && files){
          setCurrentFile(files[0])
        }
        else {
          <Snackbar open={true} autoHideDuration={6000} onClose={()=>setHasError(false)}>
          <Alert severity="error">'Unable to Preview File, no files were found'</Alert>
        </Snackbar>
        }
        return files;
      });
    }
      const _files =  await getFiles();
      console.log("🚀 ~ file: PDFViewerDialog.jsx:201 ~ useEffect ~ _files:", _files)

      const currentFile = files.filter((file)=>file.processId === processId);
      console.log("🚀 ~ file: PDFViewerDialog.jsx:203 ~ useEffect ~ currentFile:", currentFile)
      setCurrentFile(currentFile);			
  },[processId,id])


	useEffect(() => {
		if (_mounted.current === false) {
			return;
		}
	}, [currentFile]);

	function onDocumentLoadSuccess({ numPages }) {
		//console.log('onDocumentLoadSuccess', numPages);
		setIsLoaded(true);
    setHasInfo(true)
    setMessage("Document Loaded Successfully")
		setNumPages(numPages);
	}
	const handleMaxWidthChange = (event) => {
		setMaxWidth(
			// @ts-expect-error autofill of arbitrary value is not handled.
			event.target.value,
		);
	};
	const onLoadNextFile = (evt) => {
		if (currentFileIndex !== files.length) {
			setCurrentFileIndex(currentFileIndex + 1);
			setCurrentFile(files[currentFileIndex]);
		} else {
			console.warn(
				`Cannot get next file the index ${currentFileIndex} is at ${files.length} `,
			);
		}
		evt.preventDefault();
	};
	const onLoadPreviousFile = (evt) => {
		if ((currentFileIndex) => 0) {
			//[TODO][REFACTOR]
			setCurrentFileIndex(currentFileIndex - 1);
			setCurrentFile(files[currentFileIndex - 1]);
		} else {
			console.warn('File Index Already 0 disable the button');
		}
		evt.preventDefault();
	};
	const onFileLinkClicked = (evt, id) => {
		const file = files.filter((file) => file.id === id);

		if (!file) {
			// Hmm we could retain the current file as a fallback or set to empty.
			//setCurrentFile({});
			console.warn('No file  was found');
			return;
		} else {
			const idx = currentFileIndex + 1;
			console.log('Updated currentFileIndex', idx);
			setCurrentFileIndex(idx);
			setCurrentFile(files[idx]);
		}
	};

	// const Alert = React.forwardRef(function Alert(props, ref) {
	// 	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
	// });


	const _onFileLinkClicked = (evt, fileId) => {
		console.log(
			'🚀 ~ file: PDFViewerDialog.jsx:233 ~ PDFViewerDialog ~ files are:',
			files,
		);
		const selectedFile = files.filter((file) => file.id === fileId);
		console.log(
			'🚀 ~ file: PDFViewerDialog.jsx:236 ~ PDFViewerDialog ~ selectedFile:',
			selectedFile,
		);
		if (selectedFile) {
			console.log(
				'🚀 ~ file: PDFViewerDialog.jsx:237 ~ PDFViewerDialog ~ selectedFile:',
				selectedFile,
			);
			setCurrentFile(selectedFile[0]);
		}
	};

  const handleAlertClose = (evt) =>{
    setHasError(false);
    setHasInfo(false);
    setHasSuccess(false);
    setHasWarning(false);
    setMessage("");
    evt.preventDefault();
  }
	const onBackdropClicked = (evt) => {
		onDialogClose(evt);
	};

	//Files take a while to load, debouncing handlers
	//[TODO] Not a fan of having to manually set more than one session var for one action, files are required hence eisdoc is well
	return (
		<Box sx={{}}>
			<Dialog
				id='pdf-viewer-dialog'
				//open={isOpen}
				open={isOpen}
				fullScreen
        maxWidth='lg'
				maxHeight='lg'
//				minWidth='md'
	//			minHeight='md'
				//height={'100vh'}
				//      maxWidth={lg}
				onClose={onDialogClose}>
				<DialogContent>
					<DialogTitle>
						<Grid
							marginTop={5}
							container
							display={'flex'}
							justifyContent={'flex-end'}
							alignItems={'center'}>
							<IconButton onClick={(evt) => onDialogClose(evt)}>
								<Typography fontWeight={'bold'} fontSize={'medium'}>
									X
								</Typography>
							</IconButton>
						</Grid>
					</DialogTitle>
					<DialogContentText id='pdf-viewer-dialog-content'>
						{files && files.length === 0 ? (
							<Paper
								elevation={1}
								className={classes.centered}
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									minHeight: 640,
									minWidth: 800,
									height: '80%',
									width: '80%',
								}}>
								{/* <Box height={600} width={600} border={0} display={'absolute'} top={'50%'} left={'50%'}>
                <CircularProgress />
                </Box> */}
							</Paper>
						) : (
							<Paper elevation={0} marginTop={110}>
								<Grid
									container
									id='pdf-file-list-grid-container'
									//                justifyContent=''
									// rowGap={1}
									// columnSpacing={1}
									//   flex={1}
								>
									<Grid
										item
										xs={2}
										//                  className={classes.centered}
										borderColor='#ccc'
										borderStyle='dashed'
										id='pdf-file-list-grid-item'
										justifyContent='flex-start'
										alignItems='flex-start'>
										<AvailablePDFsList
											{...props}
											files={files}
											onFileLinkClicked={(evt) =>
												_onFileLinkClicked(evt, currentFile.id)
											}
										/>
									</Grid>
									<Grid
										container
										xs={10}
										justifyContent='flex-end'
										alignItems='flex-end'
										className={classes.centered}
										id='pdf-viewer-grid-container'>
										<Grid item xs={12} id='pdf-viewer-title-grid-item'>
											<Typography textAlign='center' variant='h3'>
												{currentFile.eisdoc && currentFile.eisdoc.title
													? currentFile.eisdoc.title
													: 'N/A'}
											</Typography>
										</Grid>

										<Grid container xs={12} flex={1} id='button-grid-container'>
											<Grid
												item
												xs={6}
												display='flex'
												flex={1}
												paddingTop={1}
												paddingBottom={1}
												justifyContent={'center'}
												alignItems={'center'}
												id='previous-button-grid-item'>
												<Button
													variant='outlined'
													disabled={currentFileIndex === 0}
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
													disabled={
														currentFileIndex === (files && files.length)
													}
													color='primary'
													onClick={onLoadNextFile}>
													Next File
												</Button>
											</Grid>
										</Grid>

										<Grid container xs={12} id='pdf-viewer-grid-item-container'>
											{/* {JSON.stringify(files)} */}
											<Grid item xs={12}>
												<Typography>
													Current File ID: {currentFile.id} Process ID{' '}
													{currentFile.processId}{' '}
												</Typography>

												<Typography>
													# Files {files && files.length ? files.length : 'N/A'}
												</Typography>
												<Typography>
													Filename : {currentFile.fileName}
												</Typography>
												    
                            {hasError && message && <Snackbar open={hasError} autoHideDuration={6000} onClose={handleAlertClose}>
                              <Alert onClose={(evt)=>handleAlertClose(evt)} severity="success" sx={{ width: '100%' }}>
                                This is a success message! {message}
                              </Alert>
                            </Snackbar>
                          }
                          { hasInfo && message &&
												    <Snackbar open={hasInfo} autoHideDuration={6000} onClose={()=>setHasError(false)}>
                              <Alert  severity="error">This is an error message! {message}</Alert>
                            </Snackbar>
                          }
                          { hasWarning && message &&
                            <Snackbar open={hasWarning} autoHideDuration={6000} onClose={()=>setHasWarning(false)}>
                            <Alert severity="warning">This is a warning message! {message}</Alert>
                            </Snackbar>
                          }
                          { hasInfo &&
                            <Snackbar open={hasInfo} autoHideDuration={6000} onClose={()=>setHasInfo(false)}>
                            <Alert severity="info">{message}</Alert>
                            </Snackbar>
                          }
                          { hasSuccess &&
                            <Snackbar open={hasSuccess} autoHideDuration={6000} onClose={()=>setHasSuccess(false)}>
                            <Alert severity="success">{message}</Alert>
                            </Snackbar>
                          }
												<PDFContainer {...props} file={currentFile} />
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Paper>
						)}
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</Box>
	);
}
