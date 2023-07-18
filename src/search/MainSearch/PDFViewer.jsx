import * as React from 'react';
import { OpenFile, Viewer, Worker } from '@react-pdf-viewer/core';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';
import { toolbarPlugin, ToolbarSlot, ToolBar } from '@react-pdf-viewer/toolbar';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Box } from '@material-ui/core';
//[TODO][Feature Request] - Feiz would like to see if we can highlight the section in the PDF where the most relevant / first snippet that is displayed is focused and highlighted
import { highlightPlugin, Trigger } from '@react-pdf-viewer/highlight';
// Import styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

const PDFViewer = (props) => {
    const {file,id} = props;
    //    const {fileUrl} = props;
    const fileUrl = 'example.pdf'
    const thumbnailPluginInstance = thumbnailPlugin({

    });
    const defaultLayoutPluginInstance = defaultLayoutPlugin(
        {
            //sidebarTabs: true,

        }
    );

    const toolbarPluginInstance = toolbarPlugin({
    });

    const { Toolbar } = toolbarPluginInstance;

    return (

        <>
            <div
                style={{
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        left: '50%',
                        position: 'absolute',
                        transform: 'translate(-50%, 0)',
                        zIndex: 1,
                        border:1
                    }}
                >
                    {/* Render the toolbar */}
                    <FloatingToolbar fileUrl={fileUrl} toolbarPluginInstance={toolbarPluginInstance} />
                </div>
                {/* [TODO][Feature Request] - The Toolbar should be fixed and should be visible as you scroll */}
                <Worker workerUrl={workerUrl}>
                    <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
                </Worker>
            </div>

        </>
    );
};

export default PDFViewer;

export function FloatingToolbar(props) {
    const { fileUrl,toolbarPluginInstance } = props;
    const { Toolbar } = toolbarPluginInstance;

    return (
        <div
            className="rpv-core__viewer"
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                height: '100%',
                position: 'relative',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '2px',
                    bottom: '16px',
                    display: 'flex',
                    left: '50%',
                    padding: '4px',
                    position: 'absolute',
                    transform: 'translate(-50%, 0)',
                    zIndex: 1,
                }}
            >
                <Toolbar>
                    {(props) => {
                        const {
                            CurrentPageInput,
                            Download,
                            EnterFullScreen,
                            GoToNextPage,
                            GoToPreviousPage,
                            NumberOfPages,
                            Print,
                            ZoomIn,
                            ZoomOut,
                        } = props;
                        return (
                            <>
                                <div style={{ padding: '0px 2px' }}>
                                    <ZoomOut />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    <ZoomIn />
                                </div>
                                <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                    <GoToPreviousPage />
                                </div>
                                <div style={{ padding: '0px 2px', width: '4rem' }}>
                                    <CurrentPageInput />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    / <NumberOfPages />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    <GoToNextPage />
                                </div>
                                <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                    <EnterFullScreen />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    <Download />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    <Print />
                                </div>
                            </>
                        );
                    }}
                </Toolbar>
            </div>
        </div>
    );
};