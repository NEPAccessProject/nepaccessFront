import { Divider, Grid, Typography } from '@mui/material';
import React from 'react';

export default function SearchTips(props){
    return(
        <>
        <div id="search-tips-root">
            <Grid container spacing={1}  borderBottom={1} borderColor={'#ccc'}>
              <Grid item xs={12}>
                    <Typography variant='h4'>Search Tips</Typography>
                </Grid>
                <Grid item xs={12} marginBottom={2}>
                <Typography variant='p'>You can improve your search results, by using the various operators below as part of your search. For example a search such as "Tucson AND Water NOT Sahuaro" will return results that have both Tucson and Water in the title and or content. Excluding documents that have Sahuro as part of the title and or content even if there is a match for Tucson and Water. </Typography>
                </Grid>
            </Grid>
          <Grid container id="search-tips-grid-container" justifyContent={'center'} justifyItems={'center'} borderBottom={1} borderColor={'#ccc'}>
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
            <Grid container spacing={1} marginBottom={2}>
              <Grid item xs={2}>
                <b>{'" "'}</b>
              </Grid>
              <Grid item xs={10}>
                Surround words with quotes (" ") to search for an exact phrase.
              </Grid>
            </Grid>
            <Divider/>
          </Grid>
        </div>
        </>
    )
}