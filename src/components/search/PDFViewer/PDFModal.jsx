import {
    Alert,
    Box,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Snackbar,
    IconButton,
    Paper,
    Typography
  } from '@mui/material';
  import PDFViewer from './PDFViewer';
const PDFModal = (props) => {
  console.log(`PDFModal ~ props:`, props);
  const { open, processId = 2000251 } = props;
  return (<>
    <Dialog id="pdf-viewer-dialog" style={{marginLeft:'5%', marginRight:'5%'  }} open={true} fullScreen>
        <DialogContent>

                <DialogTitle>
                    <Grid
                        container
                        display={'flex'}
                    >
                        <IconButton onClick={(evt) => onDialogClose(evt)}>x</IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            PDF Viewer
                        </Typography>
                    </Grid>
                </DialogTitle>
                <DialogContentText id='pdf-viewer-dialog-content'>
                    <PDFViewer processId={processId} />
            </DialogContentText>
        </DialogContent>
    </Dialog>
  </>)
}

export default PDFModal;