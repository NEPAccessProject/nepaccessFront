import { Box, Dialog, DialogContent, DialogContentText, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
export default function SearchTipsDialog(props) {
            const {isOpen,onDialogClose} = props;
            return (
              <Dialog open={isOpen}>
              <Grid container spacing={1}>
                      <Grid item xs={11} flexDirection="row" flexWrap={'nowrap'} alignItems={'center'} alignContent={'center'} justifyContent={'center'} >
                        <Box paddingLeft={2}><Typography fontSize={'large'} fontWeight={'bold'}>Search word Connectors</Typography></Box>
                      </Grid>
                      <Grid item xs={1} justifyContent={'center'}>
                        <IconButton onClick={onDialogClose}><Typography fontSize={'medium'}>X</Typography></IconButton>
                      </Grid>
                    </Grid>
                <DialogContent>
                
                  <DialogContentText>
                  <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <b>AND</b>
                      </Grid>
                      <Grid item xs={10}>
                        This is the default. <b>all</b> words you enter must be found together to return a
                        result.
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <b>AND</b>
                      </Grid>
                      <Grid item xs={10}>
                        This is the default. <b>all</b> words you enter must be found together to return a
                        result.
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <b>OR</b>
                      </Grid>
                      <Grid item xs={10}>
                        (all caps) to search for <b>any</b> of those words.
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <b>NOT</b>
                      </Grid>
                      <Grid item xs={10}>
                        (all caps) to search to <b>exclude</b>words or a phrase.
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <b>{'" "'}</b>
                      </Grid>
                      <Grid item xs={10}>
                        Surround words with quotes (" ") to search for an exact phrase.
                      </Grid>
                    </Grid>
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            ) 
          }
 