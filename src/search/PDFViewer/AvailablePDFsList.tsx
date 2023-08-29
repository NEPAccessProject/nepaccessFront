import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  Button,
  IconButton,
  Toolbar,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import theme from '../../styles/theme';
//import {InboxIcon,MailIcon} from '@mui/icons-material'
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { makeStyles,createStyles } from '@mui/styles';
import {Theme} from '@mui/material/styles';
import React, { useDebugValue, useState } from 'react'
import PDFViewer from './PDFViewer';
import { CircularProgress} from '@material-ui/core';
import _ from 'lodash';
import {IFile,IFiles,IEISDoc} from '../Interfaces';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

interface IStyles {
  centered: {
    textAlign: string
  }
}
interface IProps {
	files: IFiles;
	onFileLinkClicked: (number) => {};
}

const useStyles = makeStyles((theme: Theme) => createStyles({
         root:{
            backgroundColor : '#f9f9f9',
         },
         centered: {
           textAlign: 'center',
         },
         button: {
           margin: theme.spacing(1),
         },
         input: {
           display: 'none',
         },
         pdfViewer: {
           height: '100%',
           width: '100%',
         },
       }));

export default function AvailablePDFsList(props : IProps) {
  const {onFileLinkClicked,files} =  props;
 const drawerWidth= 150;
//  const eisDoc: IEISDoc = file.eisdoc;
  const classes = useStyles(theme);
//  const eisDoc: IEISDoc;
  return (
		<>
			{/* <Paper>
				<Grid container>
					<Grid
						item
						xs={12}
						textAlign={'center'}
						classes={classes.centered}
						padding={2}>
						<Typography variant='h4'>Related Files</Typography>
						<Divider />
					</Grid>
					<Grid
						item
						xs={12}>
						<List
							sx={{
								padding: 1,
							}}>
							{files &&
								files.length &&
								files.map((file: IFile, idx: number) => (
									<ListItem key={file.id}>
										<Typography>
											<Button
												onClick={() => onFileLinkClicked(file.id)}
												variant='text'>
												{file.filename}
											</Button>
										</Typography>
									</ListItem>
								))}
						</List>
					</Grid>
				</Grid>
			</Paper> */}
      <Paper>

         <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      </Paper>
		</>
	);
}