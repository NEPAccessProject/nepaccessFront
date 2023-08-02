import {
    Container,
    Paper,
    Typography
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
  const id = 11052;
  const record = {
    title: "Test Record"
  }

  //    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  //  const { isOpen, onDialogClose,fileName } = props;
  const [files,setFiles] = useState([]);
  let _mounted = useRef(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const samplePDF = 'https://arxiv.org/pdf/quant-ph/0410100.pdf';
  function onDocumentLoadSuccess({ numPages }) {
    //console.log('onDocumentLoadSuccess', numPages);
    setIsLoaded(true);
    setNumPages(numPages);
  }

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

  // useEffect(()=> {
  //   `Getting file list for id ${id}`;
  //    const files = getFilesById(id);
  //    setFiles(files);
  // },[id])

const getFilesById = useCallback((id) => {
   console.log("🚀 ~ file: PDFViewerDialog.jsx:72 ~ getFilesById ~ id:", id)
   let url = Globals.currentHost + `file/nepafiles?id=${id}`;   
   
   axios
    .get(url)
    .then((response)=> {
      console.log('file response')
      console.log('getFiles data',response.data);
      return response.data;
    })
    .catch((e)=>{
        console.error(`Failed to get a list of files for id ${id}.With an Exception`,e)
        return [];
    })
  },[id]);

  useEffect(() => {
    console.log('useEffect Moundted')
    if(_mounted.current === false){
      return;
    }
    console.log('useEffect',id);
    const files = getFilesById(id);
    console.log("🚀 ~ file: PDFViewerDialog.jsx:90 ~ useEffect ~ files:", files)
    setFiles(files);
  },[getFilesById])

  //const {searchState,setSearchState} = useContext(SearchContext);
  const { isOpen, onDialogClose, docId, docTitle } = props;
  return (
    <Paper>
        <h3>PDFS</h3>
          {/* {(files.length) && (files.map((file,idx)=>(
            <span key={idx}>filename : {file}</span>
          )))} */}
          {JSON.stringify(files)}
          <Typography>{record.title}</Typography>
          {/* {isLoaded ? <CircularProgress /> : ( */}
          <Container id="pdf-viewer-document-container">
            {/* <FloatingToolbar/> */}
            <Typography> {record.title} </Typography>
            {(files && files.length) 
              ? files.map((file,idx)=>{
                  return(<span key={idx}>filename : {file}</span>)
              })
               : <></>
            }
           

          </Container>
          </Paper>
  );
}