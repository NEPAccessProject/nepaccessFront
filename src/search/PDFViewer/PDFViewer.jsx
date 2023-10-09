import { Container, Grid, Typography } from '@mui/material';
import { ProgressBar, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import React, { useEffect } from 'react';
import PDFViewerContext from './PDFViewerContext';

const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";


//[TODO][REFACTOR] need to break this into two components.  One as container responsible for get and handling the file and display component that just takes that as an arg
const PDFViewer = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  console.log(`🚀 ~ file: PDFViewer.jsx:12 ~ PDFViewer ~ props:`, props);
  const { file, fileUrl } = props;

  //const path = file.filenames[0].path;
  const path = "/docs/EisDocument-UOFA-02048/040070/040070_0001-cprs.pdf";

  //const ctx = React.useContext(SearchContext)
  const ctx = React.useContext(PDFViewerContext)
  const _mounted = React.useRef(false);
  const { state, setState } = ctx;
  Object.keys(file).forEach((key) => {
    console.log(`file: PDFViewer.jsx:15 ~ PDFViewer ~ key`, key, file[key])
  })

  useEffect(() => {
    _mounted.current = true;
    console.log(`file: PDFViewer.jsx:23 ~ useEffect ~ _mounted.current:`, _mounted.current);
    setState({
      ...state,
      infoMessage: `Loading document ${file.title}...`,
      errorMessage: '',
    })

    return (() => {
      _mounted.current = false
    })
  }, [])

  try {
    return (
      <>
      PATH: {file.path}
        <Grid item flex={1} style={{ height: '100%' }} alignContent={'flex-start'} border={0}  >
          <h5>Current File</h5>
          {path}
          <Worker workerUrl={workerUrl}>
            <Viewer
              initialPage={2}
              fileUrl={path}
              plugins={[toolbarPlugin]}
              renderLoader={(percentages) => (
                <div style={{ width: '240px' }}>
                    <ProgressBar progress={Math.round(percentages)} />
                </div>
            )}
            
            />
          </Worker>
        </Grid>
      </>
      //     </div>
      // </div>
    );
  }
  catch (err) {
    return (<>
      <Container>
        <Typography variant='warning'>
          Failed to Load PDF! {err.message}
        </Typography>
      </Container>
    </>
    )
  }
}
export default PDFViewer;