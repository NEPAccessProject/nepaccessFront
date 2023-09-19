import {
	Button,
	CircularProgress,
	Divider,
	Grid,
  List,
	ListItem,
	Paper,
	Typography,
} from '@mui/material';
import theme from '../../styles/theme';
//import {InboxIcon,MailIcon} from '@mui/icons-material'
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import Axios from 'axios';
import fileDownload from 'js-file-download';
import React, { useEffect } from 'react';
import { IFile, IFiles } from '../Interfaces';
import SearchContext from '../SearchContext';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

interface IStyles {
	centered: {
		textAlign: string;
	};
}
interface IProps {
	files: IFiles;
	currentFile: IFile;
	onFileLinkClicked: any; //[TODO][REFACTOR] Set to proper type (React.MouseEvent<React.HTMLElement>:evt,number) => {};
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: '#f9f9f9',
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
		currentFile: {
			textDecoration: 'underline',
		},
		pdfViewer: {
			height: '100%',
			width: '100%',
		},
	}),
);

export default function AvailablePDFsList(props: IProps) {
	const _mounted = React.useRef(false);

	useEffect(() => {
		_mounted.current = true;
		return () => {
			_mounted.current = false;
		};
	});

	const { currentFile, files, onFileLinkClicked } = props;
	const ctx = React.useContext(SearchContext);
	const classes = useStyles(theme);
	const zipPath: string = currentFile?.zipPath;

	function onDownloadZip(url: string, filename: string) {
		Axios.get(url, {
			responseType: 'blob',
		}).then((res) => {
			fileDownload(res.data, filename);
		});
	}
	return (
		<>
			<Paper>
				<Grid container>
					<Grid
						item
						xs={12}
						textAlign={'center'}
						classes={classes.centered}
						padding={2}>
						<Typography variant='h4'>{files.length} Related Files </Typography>
						<Typography>{currentFile?.title}</Typography>
						<Divider />
					</Grid>
					<Grid item xs={12}>
              {files.map((file:any)=>{
                return(
                    <List>
                      <b>
                      {file.filenames.length}
                      </b>
                        {file.filenames.map((filename:any)=>{
                          return(
                          <ListItem>
                              (
                                <Button onClick={()=>onDownloadZip(file.zipPath,file.title)}>{filename.filename}</Button>
                              )
                          </ListItem>
                          )
                          })}
                      <ListItem>
                        <Button onClick={()=>onFileLinkClicked(file)}>{file.title}</Button>
                      </ListItem>
                    </List>
                )
                })
              }
					</Grid>
				</Grid>
			</Paper>
		</>
	);
}
