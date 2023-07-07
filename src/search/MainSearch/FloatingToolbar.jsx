import * as React from 'react';
import { Viewer,Worker,ProgressBar,RenderError } from '@react-pdf-viewer/core';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";


const FloatingToolbar = ({ fileUrl }) => {
    const toolbarPluginInstance = toolbarPlugin();
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
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Worker workerUrl={workerUrl}><Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} /></Worker>
            </div>
        </div>
    );
};

export default FloatingToolbar;