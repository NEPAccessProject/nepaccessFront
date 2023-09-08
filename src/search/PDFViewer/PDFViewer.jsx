import { Grid, Paper, Snackbar, Typography } from '@mui/material';
import { Alert } from '@mui/material/';

import { ProgressBar, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { set } from 'lodash';
import { useState } from 'react';

const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";


//[TODO][REFACTOR] need to break this into two components.  One as container responsible for get and handling the file and display component that just takes that as an arg
const PDFViewer = (props) => {
  console.log(`🚀 ~ file: PDFViewer.jsx:12 ~ PDFViewer ~ props:`, props);
  const [hasError, setHasError] = useState("");
  const [hasInfo, setHasInfo] = useState("");
  const [hasSuccess, setHasSuccess] = useState("");
  const [hasWarning, setHasWarning] = useState("");


  //const {fileUrl,file} = props;
  const { file, fileUrl } = props

  console.log(`🚀 ~ file: PDFViewer.jsx:17 ~ PDFViewer ~ fileUrl:`, fileUrl);
  const toolbarPluginInstance = toolbarPlugin({
    getFilePlugin: {
      // fileNameGenerator: (OpenFile) => {
      //     // `file.name` is the URL of opened file
      //     const fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
      //     return `a-copy-of-${fileName}`;
      // },
    },
    searchPlugin: {
      keyword: 'PDF',
    },
    selectionModePlugin: {
      //selectionMode: SelectionMode.Text,
    },
  });
  const { Toolbar } = toolbarPluginInstance;
  const onDocumentLoad = (evt, doc) => {
    console.log('Document loaded:', doc, evt);
    return (
      <>
        <Snackbar open={hasError} autoHideDuration={6000} onClose={() => setHasError(false)}>
          <Alert severity="info">{hasInfo}</Alert>
        </Snackbar>
      </>
    )
  };
  const handleDocumentLoad = (evt) => {
    console.log(`handleDocumentLoad - Number of pages: ${evt.doc.numPages}`);
    setHasSuccess(true)
  };
  const handleDocumentError = (evt) => {
    //    setHasInfo(true);
    return (
      <>
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setHasError(false)}>
          <Alert severity="error">{hasError}</Alert>
        </Snackbar>
      </>
    )
  }
  const onErrorRender = (msg, name) => {
    console.log("🚀 ~ file: PDFViewer.jsx ~ line 54 ~ PDFViewer ~ msg,name", msg, name);
    setHasError(`Error loading PDF! Error message ${msg}`)
    return (
      <>
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setHasError(false)}>
          <Alert severity="error">{hasError}</Alert>
        </Snackbar>
      </>
    )
  }
  const onPageRender = (page) => {
    console.log("🚀 ~ file: PDFViewer.jsx:76 ~ onPageRender ~ page:", page)
    return (
      <>
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setHasInfo(false)}>
          <Alert severity="info">{hasInfo} - { page }}</Alert>
        </Snackbar>
      </>
    )
  }

  return (


    <>
      <Paper sx={{
        padding: 4,
      }}>
        <Grid container flexGrow={1}>
          <Grid item xs={12} alignItems='center' justifyContent='center'>
            <Typography variant="h5">{file.name}</Typography>
          </Grid>

          <Worker workerUrl={workerUrl}>
            <Viewer
              renderError={onErrorRender}
              renderPage={onPageRender}
              onDocumentLoad={handleDocumentLoad}
              renderLoader={(percentages) => (
                <div style={{ width: '240px' }}>
                  <ProgressBar progress={Math.round(percentages)} />
                </div>
              )}
              onDocumentLoad={onDocumentLoad}
              fileUrl={fileUrl}
              plugins={[Toolbar]}
            />
          </Worker>
        </Grid>
      </Paper>
    </>
    //     </div>
    // </div>
  );
};

export default PDFViewer;