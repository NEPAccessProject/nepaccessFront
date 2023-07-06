import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

import samplePDF from './example.pdf';
import { pdfjs } from 'react-pdf';
import { Box,Container } from '@mui/material';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
export default function PDFReaderExample(props) {

  const {fileName} = props;  
  const [numPages, setNumPages] = useState(null);

  useEffect(()=>{
    props.pageChange(pageNumber);    
  })

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber=1;
  }

  return (
    <Container>
      <Box marginTop={25}>
        <Document
          file={samplePDF}
          options= {{workerSrc: '/pdf.worker.js'}}
          onLoadSuccess={onDocumentLoadSuccess}
          onSourceError={(err) => console.log(err)}
          onSourceSuccess={() => console.log("SUCCESS")}
          onLoadError={()=>console.log("ERR")}
        >
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ),
          )}
        </Document>
      </Box>
    </Container>
  );
}
