import {
  Button,
  Box,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import theme from '../../styles/theme';
//import {InboxIcon,MailIcon} from '@mui/icons-material'
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles, withStyles } from '@mui/styles';
import Axios from 'axios';
import fileDownload from 'js-file-download';
import React, { useEffect } from 'react';
import SearchContext from '../SearchContext';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

  resultItem: {
    mt: 2,
    mb: 2,
    pl: 0,
    pr: 0,
    "&:hover": {
      //           backgroundColor: theme.palette.grey[200],
      boxShadow: "0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)",
      cursor: "pointer",
      "& .addIcon": {
        color: "purple",
      },
    },
  }
}));
const styles = {
  link: {
    border: 1,
    fontSize: 10,
    lineHeight: 12,
    textDecoration: 'underline',
    color: 'open sans',
  },
};
const AvailablePDFsList = (props) => {
  console.log(`file: AvailablePDFsList.jsx:44 ~ AvailablePDFsList ~ props:`, props);
  const _mounted = React.useRef(false);

  useEffect(() => {
    _mounted.current = true;
    return () => {
      _mounted.current = false;
    };
  });

  const {
    filenames,
    onFileLinkClicked,
    record,
    currentFile,
  } = props;
  console.log(
    `file: AvailablePDFsList.tsx:73 ~ AvailablePDFsList ~ props:`,
    props,
  );
  const ctx = React.useContext(SearchContext);
  const classes = useStyles(theme);
  const zipPath = record.zipPath;
  function onDownloadZip(url, filename) {
    Axios.get(url, {
      responseType: 'blob',
    }).then((res) => {
      fileDownload(res.data, filename);
    });
  }
  if (!filenames) {
    return (
      <Paper>
        <Grid
          container
          justifyContent='center'
          alignContent={'center'}>
          <Typography variant='h4'>Loading...</Typography>
          <CircularProgress />
        </Grid>
      </Paper>
    );
  } else
    return (
      <>

        {filenames.map((filename) => {
          return (
            <Box item xs={12} key={filename} border={1} paddingLeft={2} margin={0} justifyContent={'center'} alignContent={'flex-start'}  >
              <Typography className={styles.link}
                style={styles.link}>
                {filename}
              </Typography>
            </Box>
          )
        })}
        <Grid
          item
          xs={12}>
          <Button
            fullWidth={true}
            variant='contained'
            onClick={() =>
              onDownloadZip(
                record.zipPath,
                record?.title,
              )
            }>
            Download All {record.zipPath}
          </Button>
        </Grid>
      </>
    );
}

function FileList(props) {
  console.log(`file: AvailablePDFsList.jsx:149 ~ FileList ~ props:`, props);
  const { currentFile, files } = props;
  const classes = useStyles(theme);
  return (
    <List id='available-files-list'>
      {files.map((file) => {
        return (
          <ListItem key={file.id}>
            {file.filenames.map((filename) => {
              return (
                <Box key={filename}>
                  <Button>
                    <Typography style={styles.link}>
                      {currentFile.filename === filename
                        ? `${filename} - **`
                        : filename}
                    </Typography>
                  </Button>
                </Box>
              );
            })}
            <Button>
              <Typography style={styles.link}>{file.title}</Typography>
            </Button>
          </ListItem>
        );
      })}
    </List>
  );
}
export default AvailablePDFsList;
