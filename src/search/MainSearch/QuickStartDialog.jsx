import React,{useContext} from 'react';
import {Dialog,DialogContext,DialogContent,DialogTitle,DialogContentText,DialogActions,Grid,Box,Typography,IconButton} from '@mui/material';
import SearchContext from './SearchContext';
export default function QuickStartDialog(props) {
            const {isOpen,onDialogClose} = props;
            return (

              <Dialog open={isOpen} sx={{
                backgroundColor: '#8FBC3F'}}>
              <Grid container={true} spacing={1}>
                      <Grid item xs={11} flexDirection="row" flexWrap={'nowrap'} alignItems={'center'} alignContent={'center'} justifyContent={'center'} >
                        <Box paddingLeft={2}>
                          <Typography fontSize={'large'} fontWeight={'bold'}>Quick Start Guide </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={1} justifyContent={'center'}>
                        <IconButton onClick={onDialogClose}><Typography fontSize={'medium'}>X</Typography></IconButton>
                      </Grid>
                    </Grid>
                <DialogContent>
                
                  <DialogContentText>
                    <Box backgroundColor='#8FBC3F'>
                        <Typography color={'white'} fontSize={'xl'}>NEPAccess Quick-Start Guide</Typography>
                    </Box>
                    <Box backgroundColor={'rgb(163, 176, 164)'}>
                      This short interactive demo will  get you quickly working on the site.
                    </Box>
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            ) 
          }
 