import { Alert, Box, Snackbar } from '@mui/material';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import React, { useEffect, useState } from 'react';
import SearchContext from '../SearchContext';
const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";


//[TODO][REFACTOR] need to break this into two components.  One as container responsible for get and handling the file and display component that just takes that as an arg
const PDFViewer = (props) => {
  console.log(`🚀 ~ file: PDFViewer.jsx:12 ~ PDFViewer ~ props:`, props);
  const {file,fileUrl} = props;
  const ctx = React.useContext(SearchContext)
  const {state,setState} = ctx;
  console.log("🚀 ~ file: PDFViewer.jsx:19 ~ PDFViewer ~ state:", state)
  //const {errorMessage,warningMessage,infoMessage,setInfoMessage,setErrorMessage,setWarningMessage} = state;
  state.infoMessage = `Loading file : ${fileUrl}`


  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [warningMessage, setWarningMesage] = useState("");
  const _mounted = React.useRef(false);
  
  useEffect(() => {
    _mounted.current = true;
    return (() => {
      _mounted.current = false
    })
  },[])

  //const {fileUrl,file} = props;

  console.log(`🚀 ~ file: PDFViewer.jsx:17 ~ PDFViewer ~ fileUrl:`, fileUrl);   
  return (

    <>
            <Snackbar open={infoMessage.length} autoHideDuration={3000} onClose={() => setInfoMessage("")}>
              <Alert severity="info">{infoMessage}</Alert>
          </Snackbar>
          <Snackbar open={warningMessage.length} autoHideDuration={3000} onClose={() => setWarningMesage("")}>
              <Alert severity="warning">{warningMessage}</Alert>
          </Snackbar>
          <Snackbar open={errorMessage.length} autoHideDuration={3000} onClose={() => setErrorMessage("")}>
              <Alert severity="error">{errorMessage}</Alert>
          </Snackbar>


            <Box>
              Loading file : {fileUrl}
              <Worker workerUrl={workerUrl}>
                <Viewer
                  initialPage={2}
                  fileUrl={fileUrl}
                  plugins={[toolbarPlugin]}
                  onDocumentLoad={(doc) => {
                    console.log('PDFViewer - onDocument Load args',doc)
                    setInfoMessage(`Document is loaded (total pages: ${doc.numPages})`);
                  }}
                  renderError={(error) => {
                    setErrorMessage(error.message)
                  }}
                  // renderPage={(props) => {
                  //   setSuccessMessage(`Page ${props.pageNumber} is rendered`);
                  //   return (
                  //     <>
                  //      <Snackbar open={successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage("")}>
                  //           <Alert severity="info">{JSON.stringify(props)}</Alert>
                  //       </Snackbar>
                  //     </>
                  //   )
                  // }}
                />
              </Worker>
            </Box>
    </>
    //     </div>
    // </div>
  );
}
export default PDFViewer;