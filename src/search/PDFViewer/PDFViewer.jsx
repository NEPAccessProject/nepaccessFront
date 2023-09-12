import { Paper } from '@mui/material';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
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
   
  return (

    <>
      <Paper sx={{
        padding: 2,
      }}>
            Loading file : {fileUrl}
            <Worker workerUrl={workerUrl}>
              <Viewer
                initialPage={2}
                fileUrl={fileUrl}
              />
            </Worker>
      </Paper>
    </>
    //     </div>
    // </div>
  );
}
export default PDFViewer;