import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ProgressBar, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '../../../index.css';

const data = [{ "doc": { "id": 2707, "title": "Copper Flat Copper Mine", "documentType": "Draft", "commentDate": "2016-03-04", "registerDate": "2015-12-04", "agency": "Bureau of Land Management", "department": null, "cooperatingAgency": null, "state": "NM", "county": "NM: Sierra", "filename": "EisDocuments-183750.zip", "commentsFilename": "CommentLetters-183750.zip", "folder": "EisDocuments-183750", "size": 108162924, "link": null, "notes": null, "status": null, "subtype": null, "summaryText": null, "noiDate": null, "draftNoa": null, "finalNoa": null, "firstRodDate": null, "isFast41": false, "processId": 2000251, "action": "Mineral Resource Extraction", "decision": "Project" }, "filenames": ["Copper Flat Copper Mine Draft EIS Volume 1.pdf", "Copper Flat Copper Mine Draft EIS Volume 2 Part 1.pdf", "Copper Flat Copper Mine Draft EIS Volume 2 Part 2.pdf"] }, { "doc": { "id": 14842, "title": "Copper Flat Copper Mine", "documentType": "Final", "commentDate": null, "registerDate": "2019-04-19", "agency": "Bureau of Land Management", "department": null, "cooperatingAgency": null, "state": "NM", "county": "NM: Sierra", "filename": "EisDocuments-268557.zip", "commentsFilename": "CommentLetters-268557.zip", "folder": "EisDocuments-268557", "size": 128767681, "link": null, "notes": null, "status": null, "subtype": null, "summaryText": null, "noiDate": null, "draftNoa": null, "finalNoa": null, "firstRodDate": null, "isFast41": false, "processId": 2000251, "action": "Mineral Resource Extraction", "decision": "Project" }, "filenames": ["Copper Flat Copper Mine Final EIS Volume 2 Appendices_Part 1.pdf", "Copper Flat Copper Mine Final EIS Volume 2 Appendices_Part 2.pdf", "Copper Flat Copper Mine Final EIS Volume 2 Appendices_Part 3.pdf", "Copper Flat Final EIS.pdf"] }];

const PDFViewer = (props) => {
    //[TODO] VERFIY THAT BUTTON THAT OPENS THIS IS ONLY ACCESSIBLE TO Logged in
    console.log('DATA???', data[0])
    const processId = props.processId || 2000251;
    const _mounted = React.useRef(false);
    const [state, setState] = useState({
        currentFile: data && data[0].filenames[0], //[TODO] defaulting the filename arbitarly so needs new logic
        currentFileIndex: 0,
        numPages: 0,
        pageNumber: 1,
        filenames: data,
        maxWidth: 'lg',
        errorMessage: '',
        infoMessage: '',
        warningMessage: '',
        filters: {

        }
    })
    const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

        useEffect(() => {
            console.log('Mount PDFViewer');
            _mounted.current = true;
            return (() => {
                console.log('Unmount PDFViewer');
                _mounted.current = false
            })
        },[])

        useEffect(() => {
            if(!_mounted.current) return;
            async () => {
                const data = await fetch("http://localhost:8080/test/get_process_full?processId=2000251");
                //    console.log('DATA IS',data);    
                setState(() => {
                    //[TODO] only for protypeing purposes
                    console.log("🚀 ~ file: PDFViewer.jsx:47 ~ useEffect ~ data:", data.filenames)
                    return {
                        ...state,
                        filenames: data.filenames ? data.filenames : [],
                        doc: data.doc,
                    }
                })
            }            
        },[processId])

    const allFilenames = []
    const onZipFileDownload = (filename,id) => {
        console.log('Trying to download zip file with filename', filename);
            fetch(`https://bighorn.sbs.arizona.edu:8443/nepaBackend/file/downloadFolder?filename=${id}&id=${i}`)
    }

    data.forEach((item, index) => {
        item.filenames.forEach((filename, index) => {
            allFilenames.push(filename)
        })
    });
    const onShowNewFileByName = (filename) => {
        console.log(`onShowNewFileByName ~ Setting Filename to:`, filename);
        setState({
            ...state,
            currentFile: filename,
        })
    }
    // const {filenames,doc} = data; // [TODO] Switch to state!
    // console.log(`PDFViewer ~ filenames,doc:`, filenames,doc);
    console.log('STATE:', state);
    return (
        <Paper elevation={1} style={{
            minHeight: '100%',
            marginTop: '102px'
        }}>
                <Container disableGutters maxWidth="xl">
                        <Grid flex={1} style={{ display: 'flex' }} container spacing={2}>
                            <Grid xs={3}>
                                {data && data.map((item, index) => {
                                    return (
                                        <Box key={item.id}>
        
                                            {/* <h3>{item.doc.title}</h3> */}
                                            <Paper elevation={1}>
                                                <DisplayPDFsByProcess 
                                                    onZipFileDownload={onZipFileDownload} 
                                                    onShowNewFileByName={onShowNewFileByName} 
                                                    data={item} 
                                                />
                                            </Paper>
                                        </Box>
        
                                    )
                                }
                                )}
                            </Grid>
                            <Grid xs={12} flex={1}>
                                <>
                                        <h2 style={{padding:2,textAlign:'center'}}>
                                            {state.currentFile}
                                        </h2>
                                        {data && data.map((item,index) => {
                                            return(
                                                <ul>
                                                    <li><b>Process ID:</b> {item.doc.id}</li>
                                                    <li><b>ID:</b> {item.doc.id}</li>
                                                    <li><b>Title:</b> {item.doc.title}</li>
                                                    <li><b>Status:</b> {item.doc.status}</li>
                                                    <li>
                                                        <b>Document Type:</b>
                                                        {item.doc.documentType}
                                                    </li>
                                                    <li><b># of Files:</b> {item.filenames.length}  </li>
                                                    <li><b>Folder Name:</b> {item.doc.folder}</li>
                                                    <li><b>Zip Folder:</b> {item.doc.filename} </li>
                                                    <li><b>Register Date:</b> {item.doc.registerDate}</li>
                                                    <li><b>Comment Date: </b> {item.doc.commentDate}</li>
                                                    <li><b>Size:</b>{item.doc.size}</li>
                                                </ul>
                                            )
                                        })}                                                
                                         <PDFViewerDisplay data={data} path={state.currentFile} />
                                </>
                            </Grid>
                    </Grid>
                </Container>
        </Paper>
    )

}
export default PDFViewer;

const makeDownloadLink = (doc,filename) => {
    
}
const makePDFPreviewLink = (doc, filename) => {
    const path = `/docs/${doc.folder}/${filename}`;
    console.log(`makePDFPreviewLink ~ path:`, path);
    return path
}


const DisplayPDFsByProcess = (props) => {
    const { data, onShowNewFileByName, onZipFileDownload } = props;
    const { doc, filenames } = data;
    const keys = Object.keys(doc);
    console.log('KEYSSSS!',keys)
    const onShowDocuments = () => {
        setIsFileListOpen(!isFileListOpen);
    }

    const [isFileListOpen, setIsFileListOpen] = useState(false);
    const buttonProps = {
        variant: 'filled',
        color: 'primary',
        size: 'small',
        padding: 0.5,
        textAlign: 'left',
        color: 'primary',
        width: '100%',
    }
    return (
        <Paper elevation={0} justifyContent="flex-start">
            <h3 style={{padding:10,textAlign:'center', borderBottom: '1px solid #ccc'}}>Related Documents</h3>
            <h4 style={{padding:10,borderBottom:'1px solid #ccc'}}>
                {doc.documentType} {doc.registerDate} {doc.title}
            </h4>

            <Box style={{marginBottom:2,textAlign:'center'}}>
                <Button 
                 color="primary"
                 variant="contained" 
                 fullWidth 
 
                    onClick={() => onZipFileDownload(doc.filename)}
                >
                     Download Full EIS as a .ZIP file
                </Button>
            </Box>
            <hr />
            <Button 
                color="primary"
                variant="outlined" 
                fullWidth 
                onClick={() => onShowDocuments(doc.filename)}
            >
                {isFileListOpen ? 'Hide' : 'Show'} Individual Documents
            </Button>
            <Box display={isFileListOpen ? 'block' : 'none'} id="doc-file-list">
                {filenames && filenames.map((filename, index) => {
                    return (
                        <div key={index} sx={{ 
                            padding: 0, 
                            margin: 0, 
                            width: '100%', 
                            border: '1px solid #ccc' ,
                            textAlign: 'left'
                        }}>
                            <Button 
                                fullWidth
                                aria-label={filename} 
                                title={filename} 
                                onClick={() => onShowNewFileByName(filename)} 
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    justifyItems: 'left'
                                }}
                            >
                                {filename && filename.length > 75 ? filename.substr(0, 75) + '...' : filename}

                            </Button>
                        </div>
                    )
                })
                }
            </Box>
        </Paper>
    )
}
const PDFViewerDisplay = (props) => {
    //    const {pdf} = props;
    const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";
    //const path = './testDocs/EisDocuments-183750_Draft/Copper Flat Copper Mine Draft EIS Volume 1.pdf';
    const path = '/docs/03FEIS_chp1tabsfig.pdf'

    return (
        <>
            <Box sx={{display: 'flex', padding: 0, minWidth: '100%', minHeight: '100%' }}>
                <Worker workerUrl={workerUrl}>
                    <Viewer
                        initialPage={2}
                        fileUrl={path}
                        plugins={[toolbarPlugin]}
                        renderLoader={(percentages) => (
                            <div>
                                <ProgressBar progress={Math.round(percentages)} />
                            </div>
                        )}

                    />
                </Worker>
            </Box>
        </>
    )
}