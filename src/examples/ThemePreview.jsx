import { AppBar, Toolbar,Paper, Typography, IconButton } from "@material-ui/core";
import { Toys } from "@mui/icons-material";
import React from "react";
import {MenuIcon} from "@mui/icons-material"

export default function ThemePreview(props){

    return (
        <>
        <Paper xs={{
            marginTop: 100,
            border: 1,
        }}>
            
            <AppBar color="primary" position="static">
                <Toolbar
                    color="secondary"
      >
        <IconButton>
            
        </IconButton>              
    
                </Toolbar>
    
            </AppBar>
            <Paper>
                <Typography variant="h1" color="primary">Heading 1,</Typography>
                <Typography color="secondary" variant="h4">
                      Heading 4 Containers
                    </Typography>
    
                      <Typography color="secondary" variant="h5">
                      Heading 5 Containers
                    </Typography>
    
                    <Typography color="secondary" variant="h6">
                      Heading 6 Containers
                    </Typography>
            </Paper>
        </Paper>
        </>
    )
}