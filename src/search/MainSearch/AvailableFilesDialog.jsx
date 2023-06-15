import React from 'react';
import {
  Dialog,
  DialogContext,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Grid,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
export default function AvailableFilesDialog(props) {
  return (
    <Dialog open={props.isOpen} onClose={props.onDialogClose}>
      <Grid container={true} spacing={1}>
        <Grid
          item={true}
          xs={11}
          flexDirection="row"
          flexWrap={'nowrap'}
          alignItems={'center'}
          alignContent={'center'}
          justifyContent={'center'}
        >
          <Box paddingLeft={2}>
            <Typography fontSize={'large'} fontWeight={'bold'}>
             
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={11}>
          <b>TITLE GOES HERE</b>
        </Grid>
        <Grid item={true} xs={1}>
          X
        </Grid>
      </Grid>
      <DialogContent>
        <DialogContentText>
          CONTENT GOES HERE
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
