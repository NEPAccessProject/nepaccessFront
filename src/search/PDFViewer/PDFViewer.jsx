import { Paper, Snackbar, Typography } from '@mui/material';
import { Alert } from '@mui/material/';

import { ProgressBar, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { useState } from 'react';

const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";


//[TODO][REFACTOR] need to break this into two components.  One as container responsible for get and handling the file and display component that just takes that as an arg
const PDFViewer = (props) => {
  console.log(`🚀 ~ file: PDFViewer.jsx:12 ~ PDFViewer ~ props:`, props);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarning] = useState("");


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
        <Snackbar open={infoMessage} autoHideDuration={2000} onClose={() => setErrorMessage("")}>
          <Alert severity="info">{infoMessage}</Alert>
        </Snackbar>
      </>
    )
  };
  const handleDocumentLoad = (evt) => {
    console.log(`handleDocumentLoad - Number of pages: ${evt.doc.numPages}`);
    setSuccessMessage(`Document ${file.title} loaded`)
  };
  const onErrorRender = (err) => {
    setErrorMessage(`Error loading PDF! ${err.name} ${err.message}`)
  }
  const onPageRender = (page) => {
    console.log("🚀 ~ file: PDFViewer.jsx:76 ~ onPageRender ~ page:", page)
    setInfoMessage(`Loading page ${page}`)
  }

  return (


    <>
      <Paper sx={{
        padding: 4,
        backgroundColor: 'lightblue',
      }}>

            <Snackbar open={infoMessage && infoMessage.length} autoHideDuration={6000} onClose={() => setInfoMessage("")}>
              <Alert severity="info">Loading {file.filename} - {infoMessage}</Alert>
            </Snackbar>

            <Snackbar open={errorMessage && errorMessage.length} autoHideDuration={6000} onClose={() => setErrorMessage("")}>
              <Alert severity="error">{errorMessage}</Alert>
            </Snackbar>

            <Typography variant="h4">{file.title}</Typography>

            <Typography variant="h5">Filename {file.filename}</Typography>
            <Typography variant="h5">File ID: {file.id}</Typography>
            <Typography variant="h5">Process ID: {file.processId}</Typography>
            <Typography variant="h5">fileUrl: {fileUrl}</Typography>

            <h2>Worker??</h2>
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
      </Paper>
    </>
    //     </div>
    // </div>
  );
};

export default PDFViewer;