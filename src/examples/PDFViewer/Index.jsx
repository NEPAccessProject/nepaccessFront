import * as React from 'react';
import { OpenFile, Viewer, Worker } from '@react-pdf-viewer/core';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

const PDFViewerExample = (props) => {
    //    const {fileUrl} = props;
    const fileUrl = './example.pdf'
    const toolbarPluginInstance = toolbarPlugin({
        getFilePlugin: {
            fileNameGenerator: (OpenFile) => {
                // `file.name` is the URL of opened file
                const fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
                return `a-copy-of-${fileName}`;
            },
        },
        searchPlugin: {
            keyword: 'PDF',
        },
        selectionModePlugin: {
            selectionMode: SelectionMode.Text,
        },
    });
    const { Toolbar } = toolbarPluginInstance;

    return (
        <div
            className="rpv-core__viewer"
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    padding: '4px',
                }}
            >
                <Toolbar />
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#eeeeee',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        padding: '4px',
                    }}
                >
                    <h2>Toolbar??</h2>
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
                                ShowSearchPopover,
                                Zoom,
                                ZoomIn,
                                ZoomOut,
                            } = props;
                            return (
                                <>
                                    <div style={{ padding: '0px 2px' }}>
                                        <ShowSearchPopover />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <ZoomOut />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <Zoom />
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
                <h2>Worker</h2>
                <Worker workerUrl={workerUrl}>
                    <h2>Viewer</h2>
                    <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
                </Worker>
            </div>
        </div>
    );
};

export default PDFViewerExample;