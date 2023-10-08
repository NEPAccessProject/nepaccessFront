import React, { useContext } from 'react';
import { Dialog, DialogContext, DialogContent, DialogTitle, DialogContentText, DialogActions, Grid, Box, Typography, IconButton } from '@mui/material';
export default function AvailableFilesDialog(props) {
  const { isOpen, onDialogClose } = props;
  return (

    <Dialog open={isOpen}>
      <Grid container={true} spacing={1}>
        <Grid item xs={11} flexDirection="row" flexWrap={'nowrap'} alignItems={'center'} alignContent={'center'} justifyContent={'center'} >
          <Box paddingLeft={2}><Typography fontSize={'large'} fontWeight={'bold'}>Available Files</Typography></Box>
        </Grid>
        <Grid item xs={1} justifyContent={'center'}>
          <IconButton onClick={onDialogClose}><Typography fontSize={'medium'}>X</Typography></IconButton>
        </Grid>
      </Grid>
      <DialogContent>

        <DialogContentText>
          <Grid container={true} spacing={1}>
            <Grid item xs={12}>
              {/* [TODO] need a dynamic value for doc count */}
              Currently the site contains 7279 Draft or Final Environmental Impact Statements from: 1976-2023. More files are being added continuously.
              <a href='/available-documents'>Available files</a>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
