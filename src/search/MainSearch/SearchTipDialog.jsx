import React,{useContext} from 'react';
import {Dialog,DialogContext,DialogContent,DialogTitle,DialogContentText,DialogActions,Grid,Box,Typography,IconButton} from '@mui/material';
import SearchContext from './SearchContext';
export default function SearchTipsDialog(props) {
            const {searchState,setSearchState,toggleSearchTipsDialog} = useContext(SearchContext);
            return (
              <Dialog open={props.isOpen}>
              <Grid container={true} spacing={1}>
                      <Grid item={true} xs={11} flexDirection="row" flexWrap={'nowrap'} alignItems={'center'} alignContent={'center'} justifyContent={'center'} >
                        <Box paddingLeft={2}><Typography fontSize={'large'} fontWeight={'bold'}>Search word Connectors</Typography></Box>
                      </Grid>
                      <Grid item={true} xs={1} justifyContent={'center'}>
                        <IconButton onClick={toggleSearchTipsDialog}><Typography fontSize={'medium'}>X</Typography></IconButton>
                      </Grid>
                    </Grid>
                <DialogContent>
                
                  <DialogContentText>
                  <Grid container={true} spacing={1}>
                      <Grid item={true} xs={2}>
                        <b>AND</b>
                      </Grid>
                      <Grid item={true} xs={10}>
                        This is the default. <b>all</b> words you enter must be found together to return a
                        result.
                      </Grid>
                    </Grid>
                    <Grid container={true} spacing={1}>
                      <Grid item={true} xs={2}>
                        <b>AND</b>
                      </Grid>
                      <Grid item={true} xs={10}>
                        This is the default. <b>all</b> words you enter must be found together to return a
                        result.
                      </Grid>
                    </Grid>
                    <Grid container={true} spacing={1}>
                      <Grid item={true} xs={2}>
                        <b>OR</b>
                      </Grid>
                      <Grid item={true} xs={10}>
                        (all caps) to search for <b>any</b> of those words.
                      </Grid>
                    </Grid>
                    <Grid container={true} spacing={1}>
                      <Grid item={true} xs={2}>
                        <b>NOT</b>
                      </Grid>
                      <Grid item={true} xs={10}>
                        (all caps) to search to <b>exclude</b>words or a phrase.
                      </Grid>
                    </Grid>
                    <Grid container={true} spacing={1}>
                      <Grid item={true} xs={2}>
                        <b>{'" "'}</b>
                      </Grid>
                      <Grid item={true} xs={10}>
                        Surround words with quotes (" ") to search for an exact phrase.
                      </Grid>
                    </Grid>
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            ) 
          }
 