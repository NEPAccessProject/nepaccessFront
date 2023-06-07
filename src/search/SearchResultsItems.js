import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  Input,
  Box,
  Divider,
  FormControl,
  Select,
  Autocomplete,
  InputLabel,
  ListItem,
  IconButton,
  TextField,
  Typography,
  Container,
  FormLabel,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

export default function SearchResultItems(props){
    const {status,id,title,description,link,resultsText} = props;
    return (
        <>
        <Box>
        <Grid xs={12} container spacing={1}>
              <Typography variant="searchResultTitle">
                <a href={"https://www.nepaccess.org/record-details?id=" + id}>
                    {title}
                </a>
              </Typography>
            </Grid>

            
            <Container>
              <Box bgcolor="#f4f4f4" padding={1} border={1} borderColor={'lightgray'} borderRadius={1}>
                    
                  Probability That Monthly Flow below Lake Ralph Hall Dam at Bakers Creek Exceeds
                  Channel Pool Volume of 175 ac-ft: 62.2% 73.0%Probability That Monthly Flow at North
                  Sulphur River Gage near Cooper Exceeds Channel Pool Volume of 175 ac-ft: 82.1%
                  83.8%PER- EXCEED-CENTILE ENCEPROBA-BILITY From From From From From From From From From
                  From From FromRiverWare WAM RiverWare WAM RiverWare WAM RiverWare WAM RiverWare WAM
                  RiverWare WAM% % ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon
                  ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon ac-ft/mon1.0% 99.0% 0 0 0 0 0 2 1 3 308 208
                  308 2842.0% 98.0% 0 0 0 0 0 3 5 4 316 310 341 4163.0% 97.0% 0 0 0 0 0 4 11 10 343 378
                  369 4724.0% 96.0% 3 2 1 3 4 9 30 23 350 384 442 5095.0% 95.0% 5 4 1 5 9 16 38 34 394
                  423 527 5907.0% 93.0% 13 8 3 9 22 28 63 57 455 473 720 75110.0% 90.0% 27 17 5 19 45 54
                  114 121 658 587 1,046 1,18015.0% 85.0% 76 48 14 47 115 149 288 364 1,051 1,053 1,740
                  1,91916.2% 83.8% 90 57 18 53 147 175 329 425 1,151 1,201
              </Box>
            </Container>

        </Box>
        </>
    )
}