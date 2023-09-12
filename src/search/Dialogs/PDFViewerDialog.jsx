import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Typography
} from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import theme from '../../styles/theme';
import AvailablePDFsList from '../PDFViewer/AvailablePDFsList';
import PDFContainer from '../PDFViewer/PDFContainer';
import SearchContext from '../SearchContext';

//https://react-pdf-viewer.dev/examples/
import axios from 'axios';
import { useEffect, useRef } from 'react';
import Globals from '../../globals';
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
  const ctx = useContext(SearchContext);
  const { state, setState } = ctx;
  const params = new URLSearchParams(window.location.search)
  //Strictly for debugging so I can test it without props
  const record = props.record || {
    id: 15993,
    title: 'Mock Record Title',
    proceess: 1004685
  }
  const isOpen = props.isOpen || params.get('isOpen');
  const id = record.id;
  const processId = record.processId;
  //let { id, processId } = record;

  //  const { q,id } = useParams();
  console.log('🚀 ~ file: PDFViewerDialog.jsx:88 ~ PDFViewerDialog ~ q,processId,id:', processId, id);
  
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
  const [message, setMessage] = useState("");

  let _mounted = useRef(false);
  const onDialogClose = //props.onDialogClose || 
    (evt) => {
      console.log("🚀 ~ file: PDFViewerDialog.jsx:112 ~ PDFViewerDialog ~ evt:", evt)
      setState({ ...state, isOpen: false });
    }

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
      files = response.data.filter(
        (file) =>
          file.filename.slice(
            file.filename.lastIndexOf('.'),
            file.filename.length,
          ) === '.pdf',
      );

      return files;
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
    if (!isOpen) {
      return;
    }
    _mounted.current = true;
    return () => {
      _mounted.current = false;
    };
  }, [isOpen]);

  //[TODO] Only for testing longer load times and the spinner

  async function getFiles() {
    const data = await getProcessByProcessId(processId);
    data.map((item, idx) => {
      const doc = item.doc;
      const names = item.filenames.map((filename, idx) => {
        return {
          id: idx,
          filename: filename,
          path: `/docs/${doc.folder}/${filename}`
        }
      })
      const filenames = names;
      files.push({
        ...doc,
        size: doc.size ? Math.round(doc.size / 1024 / 1024) : 'N/A',
        filename: doc.filename,
        filenames: filenames
      })
      const currentFile = files.filter((file) => file.processId === processId && file.id === id);
      if (!currentFile && files) {
        console.log('Defaulting to first file in the list', files[0]);

      }
      else {
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setHasError(false)}>
          <Alert severity="error">'Unable to Preview File, no files were found'</Alert>
        </Snackbar>
      }
      setFiles(files);
      return files;
    });
  }
  useEffect(() => {
    if (!_mounted.current) {
      return;
    }

    async function getFilesFromAPI() {
      const files = await getFilesById(id);
      console.log("🚀 ~ file: PDFViewerDialog.jsx:232 ~ getFilesFromAPI ~ files:", files)
      const currentFile = files.filter((file) => file.processId === processId);
      console.log("🚀 ~ file: PDFViewerDialog.jsx:203 ~ useEffect ~ currentFile:", currentFile)
      setCurrentFile(files[0]);
      setFiles(files);
      console.log("🚀 ~ file: PDFViewerDialog.jsx:232 ~ files:", files)

    }
    getFilesFromAPI()
      .then(res => {
        console.log("🚀 ~ file: PDFViewerDialog.jsx:241 ~ useEffect ~ res:", res)
      })
      .catch(err => console.error(err))

  }, [])


  useEffect(() => {
    if (_mounted.current === false) {
      return;
    }
  }, [currentFile]);

  function onDocumentLoadSuccess({ numPages }) {
    //console.log('onDocumentLoadSuccess', numPages);
    setHasSuccess(true);
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

  const handleAlertClose = (evt) => {
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
        //fullScreen
        maxWidth='lg'
        maxHeight='lg'
        //				minWidth='md'
        //			minHeight='md'
        //height={'100vh'}
        //      maxWidth={lg}
        onClose={onDialogClose}>
        <DialogContent>
          
          <DialogContentText id='pdf-viewer-dialog-content'>
          <DialogTitle>
            <Grid
              marginTop={10}
              container
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'center'}>
              <IconButton onClick={(evt) => onDialogClose(evt)}>
                <Typography fontWeight={'bold'} fontSize={'large'}>
                  X
                </Typography>
              </IconButton>
            </Grid>
          </DialogTitle>
            <Divider />
            <h3>FILES #{files.length}</h3>
            <Divider />
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
            ) :
              (
                <Paper elevation={0} marginTop={110}>
                  <Grid
                    container
                    id='pdf-file-list-grid-container'
                  //                justifyContent=''
                  rowGap={1}
                  columnSpacing={1}
                    flex={1}
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
                        currentFile={currentFile}
                        onFileLinkClicked={onFileLinkClicked}
                      />
                    </Grid>
                    <Grid
                      container
                      xs={9}
                      justifyContent='flex-end'
                      alignItems='flex-end'
                      className={classes.centered}
                      id='pdf-viewer-grid-container'>
                      <Grid item xs={12} id='pdf-viewer-title-grid-item'>
                      </Grid>

                      <Grid container xs={12} flex={1} id='button-grid-container'>
                        <PageNavButtons
                          files={files}
                          currentFileIndex={currentFileIndex}
                          onFileLinkClicked={onFileLinkClicked}
                          onLoadPreviousFile={onLoadPreviousFile}
                          onLoadNextFile={onLoadNextFile}
                        />
                      </Grid>

                      <Grid container xs={12} id='pdf-viewer-grid-item-container'>
                        <Grid margin={2} item xs={12}>
                          {hasError && message && <Snackbar open={hasError} autoHideDuration={6000} onClose={handleAlertClose}>
                            <Alert onClose={(evt) => handleAlertClose(evt)} severity="success" sx={{ width: '100%' }}>
                              This is a success message! {message}
                            </Alert>
                          </Snackbar>
                          }
                          {hasInfo && message &&
                            <Snackbar open={hasInfo} autoHideDuration={6000} onClose={() => setHasError(false)}>
                              <Alert severity="error">This is an error message! {message}</Alert>
                            </Snackbar>
                          }
                          {hasWarning && message &&
                            <Snackbar open={hasWarning} autoHideDuration={6000} onClose={() => setHasWarning(false)}>
                              <Alert severity="warning">This is a warning message! {message}</Alert>
                            </Snackbar>
                          }
                          {hasInfo &&
                            <Snackbar open={hasInfo} autoHideDuration={6000} onClose={() => setHasInfo(false)}>
                              <Alert severity="info">{message}</Alert>
                            </Snackbar>
                          }
                          {hasSuccess &&
                            <Snackbar open={hasSuccess} autoHideDuration={6000} onClose={() => setHasSuccess(false)}>
                              <Alert severity="success">{message}</Alert>
                            </Snackbar>
                          }
                          <PDFContainer {...props} file={files[0]} />
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

export function PageNavButtons(props) {
  const { currentFileIndex, files, onFileLinkClicked, onLoadPreviousFile, onLoadNextFile } = props;
  const classes = useStyles(theme);

  return (
    <>


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
    </>
  )
}
