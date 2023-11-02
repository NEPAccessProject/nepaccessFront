import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Snackbar,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import React, { useState } from 'react';
import theme from '../../styles/theme';
import AvailablePDFsList from './AvailablePDFsList';
//https://react-pdf-viewer.dev/examples/
import axios from 'axios';
import fileDownload from 'js-file-download';
import { useEffect } from 'react';
import Globals from '../../globals';
import PDFViewerContext from './PDFViewerContext';
import { PageNavButtons } from '../Dialogs/PageNavButtons';
import PDFViewer from './PDFViewer';

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

export default function PDFViewerContainer(props) {
  useEffect(() => {
    _mounted.current = true;
    return () => {
      _mounted.current = false;
    }
  })
  const ctx = React.useContext(PDFViewerContext);
  const { record, isOpen, onDialogClose } = props;
  let { id, processId, filenames } = record;

  //  const { q,id } = useParams();
  const _mounted = React.useRef(false);

  const [state, setState] = useState({
    currentFile: record.filenames[0],
    currentFileIndex: 0,
    numPages: 0,
    pageNumber: 1,
    files: [],
    maxWidth: 'md',
    errorMessage: '',
    infoMessage: '',
    warningMessage: '',
    //    filenames: [],
  });


  function onDownloadZip(url, filename) {
    axios.get(url, {
      responseType: 'blob',
    }).then(res => {
      fileDownload(res.data, filename);
    });
  }

  const classes = useStyles(theme);


  const getProcessByProcessId = async (processId = 0) => {
    console.log(`file: PDFViewerDialog.jsx:121 ~ getProcessByProcessId ~ processId:`, processId);
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
      console.log(`file: PDFViewerDialog.jsx:172 ~ getProcessByProcessId ~ response:`, response);
      let data = response.data;

      let files = data.map((file) => {
        console.log('FILE KEYS', Object.keys(file));
        //              file.filenames.map((filename, idx) => { filenames.push(filename) });
        const filenames = file.filenames.map((name, idx) => {
          console.log('NAME!!', name);
          return {
            id: idx,
            filename: name,
            //path: `/docs/${file.doc.folder}/${name}`,
          }
        })
        console.log('FILENAMES', filenames);
        return {
          ...file,
          title: file.doc.title,
          filenames: filenames,
          size: file.doc.size ? Math.round(file.doc.size / 1024 / 1024) : 'N/A',
          //zipPath: `/doc/${file.doc.folder}/${file.doc.filename}`,
        }
      })
      console.log('FILES !!!', files);
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
  }, []);

  async function getFiles() {
    const data = await getProcessByProcessId(processId);
    console.log(`🚀 ~  188 - file: PDFViewerDialog.jsx:198 ~ getFiles ~ data:`, data);
    const names = []

    let allFiles = [];

    const files = data.map((f, idx) => {
      const doc = f.doc;
      // const filenames =  file.filenames.map((name, idx) => {
      //   return {
      //     id: idx,
      //     filename: name.filename,
      //     path: `/docs/${doc.folder}/${name.filename}`,
      //   }
      // });
      f.filenames.forEach((filename, idx) => {
        //console.log('FILENAME',filename)
        const _file = {
          ...filename,
          id: doc.id,
          processId: doc.processId,
          path: `/docs/${doc.folder}/${filename.filename}`,
          relativePath: doc.relativePath,
          zipPath: `/doc/${doc.folder}/${doc.filename}`,
        }
        allFiles.push(_file)
      });
      var filenames = new Set(allFiles);
      console.log(`file: PDFViewerDialog.jsx:211 ~ files ~ filenames:`, filenames);


      const file = {
        ...doc,
        ...f,
        files: allFiles,
        filePath: `/docs/${f.doc.folder}/${doc.filename}`,
        title: doc.title,
        size: doc.size ? Math.round(doc.size / 1024) : 'N/A',
        zipPath: `/docs/${doc.folder}/${doc.filename}`,

      }
      console.log(`file: PDFViewerDialog.jsx:217 ~ FILE ~ rtn:`, file);
      return file;
    })
    console.log('PDFVIEWERDialog 220 - FILES', files);
    return files;
  }
  useEffect(() => {
    if (!_mounted.current) {
      return;
    }
    getFiles().then((files) => {
      //console.log(`file: PDFViewerDialog.jsx:220 ~ getFiles ~ files:`, files);
      // let currentFile = filenames.filter(file => file.processId === record.processId && file.id === record.id) || filenames[0];
      // console.log(`file: PDFViewerDialog.jsx:222 ~ getFiles ~ currentFile:`, currentFile);

      // if (currentFile && Array.isArray(currentFile) && currentFile.length > 0) {
      //   currentFile = currentFile[0];
      // }
      // else {
      //   currentFile = files ? files[0] : null;
      // }

      const currentFile = state.currentFile ? state.currentFile : filenames[0];
      console.log(`file: PDFViewerDialog.jsx:232 ~ getFiles ~ currentFile:`, currentFile);
      setState((prevState => {
        return {
          ...prevState,
          files,
          currentFile, //[TODO][REFACTOR] making the first file the default untill user selects otherwise
          filenames,
        }, () => {
          console.log(`UPDATED STATE???`, state)
        }
      })
      );

    })
      .catch((err) => {
        console.error(`!!!! ERRROR file: PDFViewerDialog.jsx:284 ~ useEffect ~ err:`, err);
      })
    //return files;
  }, []);


  function onDocumentLoadSuccess({ numPages }) {
    setState({ ...state, infoMessage: '', errorMessage: '', warningMessage: '', numPages });
    //console.log('onDocumentLoadSuccess', numPages);
  }
  const handleMaxWidthChange = (event) => {
    setState({ ...state, maxWidth: event.target.value })
  };
  const onLoadNextFile = (evt) => {
    if (state.currentFileIndex !== state.files.length) {
      const idx = state.currentFileIndex + 1;

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
      const currentFile = state.files[currentFileIndex];
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

  const onAlertDialogClose = (evt) => {
    setState((prevState) => {
      return {
        ...prevState,
        infoMessage: '',
        errorMessage: '',
      }

    });


  };

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
            filenames={filenames}
            currentFile={state.currentFile}
            record={record}
            onFileLinkClicked={onFileLinkClicked}
            onDownloadZip={onDownloadZip}
          />
        </Grid>
        <Grid
          container
          xs={9}
          className={classes.centered}
          alignContent={'flex-start'}
          id='pdf-viewer-grid-container'>
          <Grid item xs={12}
            id='pdf-viewer-title-grid-item'>
          </Grid>

          <Grid container xs={12} flex={1} id='page-nav-button-grid-container'>
            <PageNavButtons
              files={filenames}
              currentFileIndex={state.currentFileIndex}
              onFileLinkClicked={onFileLinkClicked}
              onLoadPreviousFile={onLoadPreviousFile}
              onLoadNextFile={onLoadNextFile}
            />
          </Grid>
          <Divider />
          <Grid item flex={1} xs={12} justifyContent={'center'} >
            {state.currentFile ?
              (
                <PDFViewer
                  file={state.currentFile}
                  record={record}
                />)
              :
              (
                <><pre>
                  {JSON.stringify(state, null, '\t')}
                </pre>
                </>
              )
            }
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}