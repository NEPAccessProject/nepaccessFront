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
  Container,
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
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';

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
//  const eisDoc: IEISDoc = file.eisdoc;
  const classes = useStyles(theme);
//  const eisDoc: IEISDoc;
  return (
		<>
			<Paper sx={{
      }}>
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
            <Divider/>
<Container>
              <Button name="download" id="download-zip-button">
                      Download All
              </Button>
</Container>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
}

interface IDrawerProps {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	onFileLinkClicked;
	window?: () => Window;
	files: IFiles;
}
export function ResponsiveDrawer(props: IDrawerProps) {
	const { window, files,onFileLinkClicked } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = (evt) => {
    console.log('onDrawerOpen Place holder evt', evt);
    evt.preventDefault();
    setMobileOpen(!mobileOpen);
	};
  const onDrawerOpen=(evt)=>{
    evt.preventDefault();
    console.log('onDrawerOpen Place holder evt',evt);
  }
 const drawerWidth = 250;

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				{files.map((file, index) => (
					<ListItem
						key={file.id}
						disablePadding>
						<ListItem key={file.id}>
							<Typography>
								<Button
									onClick={() => onFileLinkClicked(file.id)}
									variant='text'>
									{file.filename}
								</Button>
							</Typography>
						</ListItem>
						{/* <ListItemButton>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton> */}
					</ListItem>
				))}
			</List>
			<Divider />
			<List>
				{['All mail', 'Trash', 'Spam'].map((text, index) => (
					<ListItem
						key={text}
						disablePadding>
						<ListItemButton>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: 'flex',border:0, margintTop:25 }}>
			<CssBaseline />
			<AppBar
				position='sticky'
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
				}}>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}>
						<MenuIcon />
					</IconButton>
					<Typography
						variant='h6'
						noWrap
						component='div'>
						Responsive drawer
					</Typography>
				</Toolbar>
			</AppBar>
			<Box
				component='nav'
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label='mailbox folders'>
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Drawer
					container={container}
					variant='temporary'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}>
					{drawer}
				</Drawer>
				<Drawer
					variant='permanent'
					sx={{
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
					open>
					{drawer}
				</Drawer>
			</Box>
		</Box>
	);
}