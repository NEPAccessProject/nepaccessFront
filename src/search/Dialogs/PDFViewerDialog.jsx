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
import { makeStyles } from '@mui/styles';
import React, { useDebugValue, useState } from 'react';
import PDFViewer from '../PDFViewer';
// import PDFViewer from '../../examples/PDFViewer/index.jsx';
// const [fullWidth, setFullWidth] = React.useState(true);
// const [maxWidth, setMaxWidth] = React.useState('md');
// import SearchContext from './SearchContext';
//https://codesandbox.io/s/pdf-view-l3i46?file=/src/Components/DrawArea.js
//https://react-pdf-viewer.dev/examples/
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import Globals from '../../globals';
import AvailableDocuments from '../PDFViewer/PDFViewer';
import PDFContainer from '../PDFViewer/PDFContainer';
import AvailablePDFsList from '../PDFViewer/AvailablePDFsList';
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

export default function PDFViewerDialog(props) {
  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  //[TODO] set processId to props after testing
  //  const {processId} = props;
  //[TODO][CRITICAL] this is hardcode for testing
  const processId = props.processId || 78;
  //params.processId || query.processId;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  //  const { isOpen, onDialogClose,fileName } = props;
  const [files, setFiles] = useState([]);
  const [currentEisDoc, setCurrentEisDoc] = useState({});
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState({});
  let _mounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const samplePDF = 'https://arxiv.org/pdf/quant-ph/0410100.pdf';
  const classes = useStyles(theme);
  useEffect(() => {
    _mounted.current = true;
    return () => {
      console.log('Component PDF Dialog is unmounted');
      _mounted.current = false;
    };
  }, []);
  const getFilesById = async (processId = 0) => {
    if (_mounted.current !== true) {
      return;
    }
    let url = Globals.currentHost + `file/nepafiles?id=${processId}`;
    try {
      const response = await axios.get(url);
      //remove all non pdf files
      const files = response.data.filter(
        (file) =>
          file.filename.slice(file.filename.lastIndexOf('.'), file.filename.length) === '.pdf',
      );
      console.log('TLL: getFilesById -> filtered = ' + files);
      //setFiles(files);
      return files;
    } catch (e) {
      console.error(`Failed to get a list of files for id ${processId}.With an Exception`, e);
      return [];
    }
  };
	//[TODO] Only for testing longer load times and the spinner
	//  const bouncedGetFilesById = _.debounce(getFilesById, 1000);

  useEffect(() => {
    if (_mounted.current !== true) {
      return;
    }
    async function getFiles() {
      const files = await getFilesById(processId);
      console.log('116 useffect got files', files);
      setFiles(files);
      if (files.length > 0) {
        console.log('Setting Current File to ', files[0]);
        setCurrentFileIndex(0);
      }
    }
    getFiles();
    return () => {
      console.log('PDF Viewer Dialog UnMounted, reseting results');
      setFiles(null);
    };
  }, []);

  useEffect(()=>{
    if(_mounted.current === false){
      return
    }
    console.log(`FIREING EFFECT for currentFile change`)
  },[currentFile])

  function onDocumentLoadSuccess({ numPages }) {
    //console.log('onDocumentLoadSuccess', numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }
  const onDialogClose = (evt) => {
    console.log('onDialogClose placeholder', evt);
  };
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
      console.warn(`Cannot get next file the index ${currentFileIndex} is at ${files.length} `);
    }
    evt.preventDefault();
  };
  const debouncedOnLoadNextFile = _.debounce(onLoadNextFile)
  const onLoadPreviousFile = (evt) => {
    if ((currentFileIndex) => 0) {
      //[TODO][REFACTOR]
      setCurrentFileIndex(currentFileIndex - 1);
      setCurrentFile(files[currentFileIndex- 1]);
    } else {
      console.warn('File Index Already 0 disable the button');
    }
    evt.preventDefault();
  };
  const handleFullWidthChange = (event) => {
    //console.log('handleFullWidth', event.target.checked);
    setFullWidth(event.target.checked);
  };

  const onFileLinkClicked = (evt, id) => {
    console.log(`🚀 ~ file: PDFViewerDialog.jsx:176 ~ onFileLinkClicked ~ evt, id:`, evt, id);

    const file = files.filter((file) => file.id === id);

    console.log(`Filtered file for ${id}`, file);
    if (!file) {
      // Hmm we could retain the current file as a fallback or set to empty.
      //setCurrentFile({});
      console.warn('No file  was found')
      return;
    }
    else {
      const idx = currentFileIndex + 1;
      console.log('Updated currentFileIndex',idx);
      setCurrentFileIndex(idx);
      setCurrentFile(files[idx])
    }
  };
  //Files take a while to load, debouncing handlers
    const onLoadNextFileDebounced = _.debounce(onLoadNextFile,500);
    const onLoadPreviousFileDebounced = _.debounce(onLoadPreviousFile,500);
    const onFileLinkClickedDebounced = _.debounce(onFileLinkClicked,500)
  //[TODO] Not a fan of having to manually set more than one session var for one action, files are required hence eisdoc is well
  return (
    <Dialog
      id='pdf-viewer-dialog'
      //open={isOpen}
      open={true}
			//      fullScreen={true}
      maxWidth='xl'
      width='xl'
			//height={'100vh'}
			//      maxWidth={lg}
      onClose={onDialogClose}>
      <DialogContent>
        <DialogTitle>
          <Grid container>
            <Grid
              item
              xs={2}
              display='flex'
              alignSelf={'flex-end'}
              justifyContent={'flex-end'}
              id='icon-button-grid-item'>
              <IconButton onClick={(evt) => onDialogClose(evt)}>
                <Typography
                  fontWeight={'bold'}
                  fontSize={'medium'}>
                  X
                </Typography>
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContentText id='pdf-viewer-dialog-content'>
          {files && files.length === 0 ? (
            <Paper
              elevation={1}
              className={classes.centered}
              sx={{
                border: 0,
								position: 'absolute',
								top: '50%',
								left: '50%',
								height: '80%',
								width: '80%',
              }}>
              <CircularProgress />
            </Paper>
          ) : (
              <Paper elevation={0}>
                <Grid
                  id="pdf-file-list-grid-container"
                  justifyContent=''
                  container
                  rowGap={1}
                  columnSpacing={1}
                  border={0}>
                  <Grid
                    item
                    xs={2}
                    className={classes.centered}
                    border={0}
                    borderColor='#ccc'
                    id='pdf-file-list-grid-item'>
                    <AvailablePDFsList
                      {...props}
                      files={files}
                      onFileLinkClicked={onFileLinkClickedDebounced}
                    />
                  </Grid>
                  <Grid
                    container
                    xs={10}
                    className={classes.centered}
                    border={0}
                    borderColor={'#ccc'}
                    id="pdf-viewer-grid-container"
                    >
                    <Grid item xs={12}>
                      <Grid flex={1} item xs={3}>Current Index: {currentFileIndex}</Grid>
                      <Grid flex={1} item xs={3}>Current File: {currentFile.filename}</Grid>
                      <Grid flex={1} item xs={3}>Current id: {(currentFile.eisdoc) ? currentFile.eisdoc.id : "No file loaded"}</Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      borderBottom={1}
                      borderColor={'#ccc'}
                      id='pdf-viewer-title-grid-item'>
                      <Typography
                        textAlign={'center'}
                        variant='h6'>
                        {currentFile && currentFile.eisdoc ? currentFile.eisdoc.title : '0'}
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      xs={12}
                      flex={1}
                      id='button-grid-container'>
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
                          disabled={(!files || files.length) === 0}
                          onClick={onLoadPreviousFileDebounced}>
                          Previous File
                        </Button>
                      </Grid>
                      <Grid
                        item
                        display='flex' 
                        flex={1}
                        border={0}
                        justifyContent={'center'}
                        alignItems={'center'}
                        id='next-button-grid-item'>
                        <Button
                          variant='outlined'
                          disabled={currentFileIndex === (files && files.length)}
                          color='primary'
                          onClick={onLoadNextFile}>
                          Next File
                        </Button>
                      </Grid>
                    </Grid>
                    
                    <Grid
                      item
                      xs={12}
                      border={1}
                      //borderColor={'#ccc'}
                      id='pdf-viewer-grid-item-container'>
                      {/* <b> Current File at index {currentFileIndex} ?</b>
                      {JSON.stringify(currentFile)} 
                      <Divider/> */}
                      {/* {JSON.stringify(files)} */}
                      <PDFContainer
                        {...props}
                        file={currentFile}
                      /> 
                  </Grid>
                  </Grid>
              </Grid>
            </Paper>
          )}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

// Event handler function that fires when sidebar link is clicked and set the currentEisDoc to corresponding eisdoc

// Function to retrive data from api https://paleobiodb.org/data1.2/occs/list.json?&interval_id=16&show=all&datainfo and display the results

// export function PDFContainer(props) {
//   console.log(`🚀 ~ file: PDFViewerDialog.jsx:298 ~ PDFContainer ~ props:`, props);

//   const { file } = props;
//   if(!file){
//     console.error('PDF Container did not received file props, exiting!');
//     return;
//   }
//   const { eisdoc } = file;
//   const fileURL = 'docs\\' + file.filename;
//   console.log(`!!! - Line 378 - FILE URL!`,fileURL);
// //  const classes = useStyles(theme);
//   return (
//     <Paper
//       elevation={1}
//       id='pdf-container-viewer'
//       sx={{}}>
//       <Grid
//         container
//         spacing={2}
//         id='pdf-container-grid-container'>
//         <Grid
//           item
//           xs={12}
//           id='pdf-viewer-container-grid-item'
//             // alignSelf={'centered'}
//           >
//           <PDFViewer
//             {...props}
//             file={file}
//             fileURL={fileURL}
//           />
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// }

// export function AvailableFilesList(props) {
//   const { files, onFileLinkClicked } = props;
//   const classes = useStyles(theme);

//   return (
//     <>
//         <Grid container>
//         <Grid
//           item
//           xs={12}
//           textAlign={'center'}
//           className={classes.centered}
//           padding={2}>
//           <Typography variant='h4'>Related Files</Typography>
//           <Divider />
//           </Grid>
//         <Grid
//           item
//           xs={12}>
//           <List
//             border={0}
//             p={0}
//             sx={12}
//             borderBottom={1}
//             backgroundColor= '#bbb'
//             >
//             {files &&
//               files.length &&
//               files.map((file, idx) => (
//                 <ListItem key={file.id}>

//                   <a onClick={(evt) => onFileLinkClicked(evt, file.id)}
//                     className={classes.link}
//                     href={file.url}
//                     target='_blank'
//                     rel='noopener noreferrer'>               
//                       {file.filename}
//                   </a>
//                 </ListItem>
//               ))}
//             </List>
//           </Grid>
//       </Grid>
//     </>
//   );
// }
