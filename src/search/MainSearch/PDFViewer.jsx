import * as React from 'react';
import { OpenFile, Viewer, Worker } from '@react-pdf-viewer/core';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

//[TODO][Feature Request] - Feiz would like to see if we can highlight the section in the PDF where the most relevant / first snippet that is displayed is focused and highlighted
import { highlightPlugin, Trigger } from '@react-pdf-viewer/highlight';
// Import styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

const PDFViewer = (props) => {
    //    const {fileUrl} = props;
    const fileUrl = 'example.pdf'
    const thumbnailPluginInstance = thumbnailPlugin({

    });
    const defaultLayoutPluginInstance = defaultLayoutPlugin(
        {}
    );

    const toolbarPluginInstance = toolbarPlugin({
    });
    const { Toolbar } = toolbarPluginInstance;

    return (
        
                <>
                {/* [TODO][Feature Request] - The Toolbar should be fixed and should be visible as you scroll */}
                    <Toolbar />  
                    <Worker workerUrl={workerUrl}>
                        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                    </Worker>
                </>
    );
};

export default PDFViewer;