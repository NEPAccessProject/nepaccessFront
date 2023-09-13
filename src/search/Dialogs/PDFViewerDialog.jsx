import {
  Alert,
  Box,
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
import React, { useState } from 'react';
import theme from '../../styles/theme';
import AvailablePDFsList from '../PDFViewer/AvailablePDFsList';
//https://react-pdf-viewer.dev/examples/
import axios from 'axios';
import fileDownload from 'js-file-download';
import { useEffect } from 'react';
import Globals from '../../globals';
import PDFViewerContainer from '../PDFViewer/PDFViewerContainer';
import PDFViewerContext from '../PDFViewer/PDFViewerContext';
import SearchContext from '../SearchContext';
import { PageNavButtons } from './PageNavButtons';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

export const useStyles = makeStyles((theme) => ({
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
    borderRadius: 1,
    '&:hover': {
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
  color: theme.palette.text.secondary,
  elevation: 1,
  borderRadius: 1,
}));

//Function adds two numbers

export default function PDFViewerDialog(props) {
  console.log("🚀 ~ file: PDFViewerDialog.jsx:73 ~ PDFViewerDialog ~ props:", props)
  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  const {onDialogClose} = props;
   
  //	let { record, isOpen, onDialogClose } = props;
  const ctx = React.useContext(SearchContext);
  console.log("🚀 ~ file: PDFViewerDialog.jsx:73 ~ PDFViewerDialog ~ ctx:", ctx)
//  const { state, setState } = ctx;
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
  const _mounted = React.useRef(false);

  const [state,setState] = useState({
    currentFile: {},
    currentFileIndex: 0,
    numPages:0,
    pageNumber:1,
    files:[],
    maxWidth:'md',
    errorMessage:'',
    infoMessage: '',
    warningMessage: '',
  });

  
  function onDownloadZip(url, filename) {
    axios.get(url, {
      responseType: 'blob',
    }).then(res => {
      fileDownload(res.data, filename);
    });
  }

  const classes = useStyles(theme);

  const getFilesById = async (id = 0) => {
    if (_mounted.current !== true) {
      return;
    }
    console.log('🚀 ~ file: PDFViewerDialog.jsx:111 ~ getFilesById ~ id:', id);
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
    setState({
      ...state,
      infoMessage: `TEST - Retrieving files for processId ${processId}`,
    })

    if (_mounted.current !== true) {
      return;
    }
    let url =
      Globals.currentHost + `test/get_process_full?processId=${processId}`;
    try {
      const response = await axios.get(url);
      const files = response.data.filter(
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
      setState({
        ...state,
        errorMessage: e.message
      })

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

  // Function calls getFiles() to get a list files then call getFilesById() to get a list of files for a given file.id and merges them

  useEffect(()=>{
    const files = getFiles()
    console.log(`file: PDFViewerDialog.jsx:193 ~ useEffect ~ files:`, files);
  },[])

  async function getFiles() {
    const data = await getProcessByProcessId(processId);
    console.log(`🚀 ~ file: PDFViewerDialog.jsx:198 ~ getFiles ~ data:`, data);

    const files=[];
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
      console.log("🚀 ~ file: PDFViewerDialog.jsx:198 ~ data.map ~ filenames:", filenames)
      files.push({
        ...doc,
        size: doc.size ? Math.round(doc.size / 1024 / 1024) : 'N/A',
        filenames: filenames
      })
      const currentFile = files.filter((file) => {
        const hasCurrent =  file.processId === processId && file.id === record.id;
        console.log(`🚀 ~ file: PDFViewerDialog.jsx:203 ~ useEffect ~ file.processId === processId && file.id === record.id`, file.processId === processId && file.id === record.id)
        console.log("🚀 ~ file: PDFViewerDialog.jsx:207 ~ currentFile ~ hasCurrent:", hasCurrent)
        return hasCurrent;
    });

      if (!currentFile && files) {
        console.log('Defaulting to first file in the list', files[0]);

      }
      else {
        <Snackbar open={true} autoHideDuration={1000} onClose={() => setState({
            ...state,
            errorMessage:''
            })}>
          <Alert severity="error">'Unable to Preview File, no files were found'</Alert>
        </Snackbar>
      }
      setState({...state,files})
      return files;
    });
  }
  useEffect(() => {
    if (!_mounted.current) {
      return;
    }

    async function getFilesFromAPI() {
      const temp = await getFiles();
      console.log(`file: PDFViewerDialog.jsx:247 ~ getFilesFromAPI ~ temp:`, temp);
      const files = await getFilesById(id);
      console.log("🚀 ~ file: PDFViewerDialog.jsx:232 ~ getFilesFromAPI ~ files:", files)
      const currentFile = files.filter((file) => file.processId === processId);
      console.log("🚀 ~ file: PDFViewerDialog.jsx:203 ~ useEffect ~ currentFile:", currentFile)
      setState({...state, currentFile,files });
      console.log("🚀 ~ file: PDFViewerDialog.jsx:232 ~ files:", files)

    }
    try{
      getFilesFromAPI();
    }
    catch(err){
      console.error(`Unexpected error retriving files for processId ${processId}`, err);
    }

  }, [])


  function onDocumentLoadSuccess({ numPages }) {
    setState({...state,infoMessage:'',errorMessage:'', warningMessage:'', numPages });
    //console.log('onDocumentLoadSuccess', numPages);
  }
  const handleMaxWidthChange = (event) => {
    setState({...state,maxWidth: event.target.value})
  };
  const onLoadNextFile = (evt) => {
    if (state.currentFileIndex !== state.files.length) {
      const idx =  state.currentFileIndex + 1;

      setState({
        ...state,
        currentFileIndex: idx,
        currentFile: state.files[idx],
      })
    } else {
      console.warn(
        `Cannot get next file the index ${state.currentFileIndex} - Total Files ${state.files.length} `,
      );
    }
    evt.preventDefault();
  };
  const onLoadPreviousFile = (evt) => {
    if ((currentFileIndex) => 0) {
      //[TODO][REFACTOR]
      const currentFileIndex = state.currentFileIndex - 1;
      const currentFile= state.files[currentFileIndex];
      setState({
        ...state,
        currentFileIndex,
        currentFile
      })
    } else {
      console.warn('File Index Already 0 disable the button');
    }
    evt.preventDefault();
  };
  const onFileLinkClicked = (evt, id) => {
    const file = state.files.filter((file) => file.id === id);

    if (!file) {
      // Hmm we could retain the current file as a fallback or set to empty.
      //setCurrentFile({});
      console.warn('No file  was found');
      return;
    } else {
      const idx = state.currentFileIndex + 1;

      console.log('Updated currentFileIndex', idx);

      setState({
       ...state,
        currentFileIndex: idx,
        currentFile: file[idx],
      })
    }
  };

  // const Alert = React.forwardRef(function Alert(props, ref) {
  // 	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  // });

  const handleAlertClose = (evt) => {
    setState({
      ...state,
      infoMessage: '',
      warningMessage: '',
      errorMessage: '',
    })
    evt.preventDefault();
  }
  const onBackdropClicked = (evt) => {
    props.onDialogClose(evt);
  };

  //Files take a while to load, debouncing handlers
  //[TODO] Not a fan of having to manually set more than one session var for one action, files are required hence eisdoc is well

  //wrap state func(s) into value so we can expand it to add funcs etc.
  const value = {
    state,
    setState
  }
  return (
    <PDFViewerContext.Provider value={value}>
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
        onClose={(evt) => onDialogClose(evt)}>
        <DialogContent>
          
          <DialogContentText id='pdf-viewer-dialog-content'>
          <DialogTitle>
            <Grid
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
           
                <Paper elevation={0} backgroundColor='#ddd'>
                  <Grid
                    container
                    id='pdf-file-list-grid-container'
                    //rowGap={1}
                    //columnSpacing={1}
                    flex={1}
                  >
                      <Grid
                        item
                        xs={3}
                        id='pdf-file-list-grid-item'
                        // justifyContent='flex-start'
                        // alignItems='flex-start'
                        >
                        <AvailablePDFsList
                          {...props}
                          files={state.files}
                          currentFile={state.currentFile}
                          onFileLinkClicked={onFileLinkClicked}
                          onDownloadZip={onDownloadZip}
                        />
                      </Grid>
                    <Grid
                      container
                      xs={9}
                      className={classes.centered}
                      id='pdf-viewer-grid-container'>
                      <Grid item xs={12} 
                        id='pdf-viewer-title-grid-item'>
                      </Grid>

                      <Grid container xs={12} flex={1} id='page-nav-button-grid-container'>
                        <PageNavButtons
                          files={state.files}
                          currentFileIndex={state.currentFileIndex}
                          onFileLinkClicked={onFileLinkClicked}
                          onLoadPreviousFile={onLoadPreviousFile}
                          onLoadNextFile={onLoadNextFile}
                        />
                      </Grid>
                      <Grid item flex={1} xs={12} justifyContent={'center'} >
                        
                        {
                        state.currentFile 
                        ? (
                          <PDFViewerContainer 
                              {...props} 
                              file={state.currentFile} 
                              onDownloadZip={onDownloadZip}
                              eisdoc={state.currentFile.eisdoc}
                            />
                          )
                        : (
                          <>
                            <Typography variant={'h3'}>No File Selected</Typography>
                          </>
                        )
                      }
                        </Grid>
                    </Grid>
                  </Grid>
                  </Paper>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
    </PDFViewerContext.Provider>
  );
}


