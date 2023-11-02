import {
	Button,
  Box,
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
	filenames: [any];
  record: IFile;
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

	const { filenames, onFileLinkClicked,record } = props;
	const ctx = React.useContext(SearchContext);
	const classes = useStyles(theme);
	const zipPath: string = record.zipPath;
  console.log('PDFVIEWER ~ zipPath',zipPath);
	function onDownloadZip(url: string, filename: string) {
		Axios.get(url, {
			responseType: 'blob',
		}).then((res) => {
			fileDownload(res.data, filename);
		});
	}
  if(!filenames) {
  return(
  <Paper>
    <Grid container justifyContent='center' alignContent={'center'}>
      <Typography variant='h4'>Loading...</Typography>
        <CircularProgress />
    </Grid>
  </Paper>
  )
}
  else
    return (
      <>
        <Paper id='available-pdfs-root-paper-container'>
          <Grid container id='available-pdfs-list-grid-container'>
            <Grid
              item
              xs={12}
              textAlign={'center'}
              classes={classes.centered}
              padding={2}>
              <Typography variant='h4'>{filenames.length} Files </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} id='available-pdfs-list-file-list-grid'>
            {filenames.map((filename: string) => {
							return <Box key={filename}><Button>{filename}</Button></Box>;
						})}

            </Grid>
            <Grid item xs={12}>
              <Button
                variant='contained'
                onClick={() =>
                  onDownloadZip(record.zipPath, record?.title)
                }>
                Download All {record.zipPath}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
}

function FileList(props) {
	const {currentFile, files} = props;
	return (
		<List id='available-files-list'>
			{files.map((file: IFile) => {
				return (
					<ListItem key={file.id}>
						{file.filenames.map((filename: string) => {
							return <Box key={filename}><Button>{currentFile.filename === filename ? `${filename} - **` : filename }</Button></Box>;
						})}
						<Button>{file.title}</Button>
					</ListItem>
				);
			})}
		</List>
	);
}
