import React from 'react'
import {Input,Select} from '@mui/material'
//import Grid from '@mui/material/Grid'; // Grid version 1
import Grid from '@mui/material/Unstable_Grid2';


export default function GridV2() {

return(    
<>
    <h3>Auto Layout</h3>
    <Grid container spacing={3}>
      <Grid xs>
        <Item>xs</Item>
      </Grid>
      <Grid xs={6}>
        <Item>xs=6</Item>
      </Grid>
      <Grid xs>
        <Item>xs</Item>
      </Grid>
    </Grid>
    <h3>Variable Width Content</h3>
</>
)
}