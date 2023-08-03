import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
// const [fullWidth, setFullWidth] = React.useState(true);
// const [maxWidth, setMaxWidth] = React.useState('md');
// import SearchContext from './SearchContext';
//https://codesandbox.io/s/pdf-view-l3i46?file=/src/Components/DrawArea.js
//https://react-pdf-viewer.dev/examples/
import axios from 'axios';
import { useCallback, useEffect, useRef } from 'react';
import Globals from '../globals';

export default function MultiPDFViewer(props) {
  //  console.log("🚀 ~ file: PDFViewerDialog.jsx ~ line 25 ~ PDFViewerDialog ~ props", JSON.stringify(props))
  //const {id,record} = props
  //Hard Code for Demo
  const record = {
    title: "Test Record"
  }

  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  //  const { isOpen, onDialogClose,fileName } = props;
  const [files, setFiles] = useState([]);
  let _mounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const samplePDF = 'https://arxiv.org/pdf/quant-ph/0410100.pdf';
  function onDocumentLoadSuccess({ numPages }) {
    //console.log('onDocumentLoadSuccess', numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }
  //value is null to trigger the effect when it is loaded
  const getId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(`file: MultiPDFViewer.jsx:43 - id - urlParams:`, urlParams);
    const process_id = urlParams.get('process_id');
    console.log(`file: MultiPDFViewer.jsx:44 - id - process_id:`, process_id);
    return process_id;
  };
  

  // useEffect(() => {
  //   _mounted.current = true;
  //   console.log(`Mounted `, _mounted);
  //   () => {
  //     console.log('cleaning up mounted check after useEffect');
  //     _mounted.current = false;
  //   };
  // }, [_mounted]);

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    //console.log('handleFullWidth', event.target.checked);
    setFullWidth(event.target.checked);
  };

  let process_id = null;

  const getFilesById = (process_id) => {
    console.log("🚀 ~ file: PDFViewerDialog.jsx:72 ~ getFilesById ~ process_id:", process_id)
    let url = Globals.currentHost + `test/get_process_full?processId=${process_id}`;
   
    console.log(`file: MultiPDFViewer.jsx:80 - getFilesById - url:`, url);
    axios
      .get(url)
      .then((response) => {
        console.log(`file: MultiPDFViewer.jsx:81 - .then - response:`, response);
        console.log('getFiles data', response.data);
        setFiles(response.data);
      })
      .catch((e) => {
        console.error(`Failed to get a list of files for process_id ${process_id}.With an Exception`, e.message);
        
      })
  };

  useEffect(() => {
    // if(_mounted.current === false){
    //   return;
    // }
    const process_id = getId();
    console.log(`file: MultiPDFViewer.jsx:96 - useEffect - process_id:`, process_id);
    console.log('useEffect', process_id);
    const files = getFilesById(process_id)
    console.log("🚀 ~ file: PDFViewerDialog.jsx:90 ~ useEffect ~ files:", files, "process_id", process_id)

  }, [process_id]);

  //const {searchState,setSearchState} = useContext(SearchContext);
  const { isOpen, onDialogClose, docId, docTitle } = props;
  return (
    <Container sx={{
      backgroundColor: '#fff',
      border: 1,
      marginTop: '125px'
    }}>
      <Paper border={1} elevation={1} backgroundColor="#fff">

        {/* <Typography variant="h4" sx={{ my: 2 }}>
            {docTitle}
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            {id}
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            {docId}
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
          {record.title}
          </Typography> */}
        <Grid Container>
          <Grid item xs={12}>
            {(files).map((file, index) => {
              return (
                file.filenames.map((filename, idx) => {
                  return (
                    <Typography key={filename}>
                      {filename}
                    </Typography>
                  )
                }))
            })}            
                
                { JSON.stringify(files[0]) }
  </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}