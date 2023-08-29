import { Viewer, Worker } from '@react-pdf-viewer/core';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import * as React from 'react';
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";


//[TODO][REFACTOR] need to break this into two components.  One as container responsible for get and handling the file and display component that just takes that as an arg
const PDFViewer = (props) => {
  console.log(`🚀 ~ file: PDFViewer.jsx:12 ~ PDFViewer ~ props:`, props);

  //const {fileUrl,file} = props;
  const {file,fileUrl} = props

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

    return (
        
                
                <>
                  <Grid container flexGrow={1}>
                    <Grid item xs={12} alignItems='center' justifyContent='center'>
                        <Typography variant="h5">{file.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                    <Worker workerUrl={workerUrl}>
                      <Viewer fileUrl={fileUrl}
                plugins={[Toolbar]} 
                        />
                    </Worker>
                    </Grid>
                  </Grid>
                </>
        //     </div>
        // </div>
    );
};

export default PDFViewer;