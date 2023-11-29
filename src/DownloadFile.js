import React from 'react';
import axios from 'axios';
import './User/login.css';
import Globals from './globals.js';
import { Button, Snackbar, Alert } from '@mui/material'
import LoginModal from './User/LoginModal.js';
import theme from './styles/theme';
import { makeStyles, withStyles } from '@mui/material';
import SearchContext from './search/SearchContext';
export default class DownloadFile extends React.Component {

  // Receives needed props from React-Tabular instance in SearchResults.js
  static contextType = SearchContext;
  constructor(props) {

    super(props);
    this.state = { // Each and every download link via <DownloadFile /> has its own state
      progressValue: null,
      downloadPreText: null,
      downloadText: '',
      downloadClass: 'document-download',
      downloadClass2: '',
      message: ''
    };
  }
  componentDidMount() {
    const ctx = this.context;
    this.onSetNotification = this.context.onSetNotification;
    //    console.log(`file: DownloadFile.js:28 ~ DownloadFile ~ componentDidMount ~ ctx:`, ctx);
  }

  /** Log download */
  logInteraction = (downloadedAll) => {
    const _url = new URL('interaction/set', Globals.currentHost);
    const dataForm = new FormData();

    // DownloadFile component shows up in both main results and details page, so SearchResult includes .results=true prop
    if (this.props.results) {
      dataForm.append('source', "RESULTS");
    } else {
      dataForm.append('source', "DETAILS");
    }

    if (downloadedAll) {
      dataForm.append('type', "DOWNLOAD_ARCHIVE");
    } else {
      // individual file OR epa comments archive.
      // Can differentiate if important but even the distinction between single file/all is just a bonus already.
      dataForm.append('type', "DOWNLOAD_ONE");
    }

    if (this.props.recordId) {
      dataForm.append('docId', this.props.recordId);
    } else {
      dataForm.append('docId', this.props.id); // TODO: May not have this every time unfortunately, need to clean up outside logic
    }

    console.log(`Calling ${_url} with dataForm:`, dataForm);
    //this.props.onSetNotification(`Calling ${_url} with dataForm:`, "info")
    axios({
      url: _url,
      method: 'POST',
      data: dataForm
    }).then(response => {
      // let responseOK = response && response.status === 200;
      console.log(response.status);
    }).catch(error => {
      console.error(error);
    })
  }

  downloadNepaFile = (_filename, _id) => {
    console.log(`file: DownloadFile.js:61 ~ DownloadFile ~ _filename,_id:`, _filename, _id);
    //this.props.onSetNotification(`Starting File Downoad for ${_filename}`, 'info');
    const FileDownload = require('js-file-download');

    // Indicate download
    this.setState({
      downloadText: 'Downloading...',
      downloadClass2: 'disabled_download'
    });

    let getRoute = Globals.currentHost + 'file/download_nepa_file';
    console.log(`Getting file from ${getRoute} for file ${_filename}`);

    //    this.props.onSetNotification(`Getting file from ${getRoute} for file ${_filename}`, "info")

    axios.get(getRoute, {
      params: {
        filename: _filename,
        id: _id
      },
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => { // Show progress if available
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');

        if (totalLength !== null) { // Progress as percent, if we have total
          this.setState({
            progressValue: '(' + Math.round((progressEvent.loaded * 100) / totalLength) + '% downloaded)'
          });
        } else if (progressEvent.loaded) { // Progress as MB
          this.setState({
            progressValue: '(' + (Math.round(progressEvent.loaded / 1024 / 1024)) + 'MB downloaded)'
          });
        }
        // else progress remains blank
      }
    }).then((response) => {

      // Indicate download completed as file is saved/prompted save as (depending on browser settings)
      if (response) {
        this.setState({
          downloadText: 'Done'
        });
        FileDownload(response.data, _filename);

        this.logInteraction(false);
      }

      // verified = response && response.status === 200;
    })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          //Although we are duplicating functionality for now untill the refactor on how we display error/info messages
          //    this.props.onSetNotification('File not found', 'error');
          this.setState({
            downloadText: 'File not found',
            downloadClass2: 'disabled_download'
          });

          //    this.props.onSetNotification('File not found', 'error');
        } else if (error.response && error.response.status === 403) {
          //    this.props.onSetNotification('File not found', 'error');

          this.setState({
            downloadPreText: <LoginModal message="Session expired: Please click here to login again" />,
            downloadClass: 'document-download',
            downloadClass2: ''
          });
          //    this.props.onSetNotification('Session expired: Please click here to login again', 'error');
        } else {
          //    this.props.onSetNotification('File not found', 'error');

          this.setState({
            downloadText: 'Server may be down for maintenance, please try again later',
            downloadClass2: 'disabled_download'
          });
          //    this.props.onSetNotification('Server may be down for maintenance, please try again later', 'error');
        }
      });
  }

  // TODO: Cell resets to default state if parent re-renders, preserve the fact it was downloaded
  // at least until user reloads the page or navigates?  This was working before, but got more complex with process view
  // TODO: reset download link if canceled
  // these could be very difficult to figure out for low payoff, however
  download = (filenameOrID, isFolder) => {
    console.log(`file: DownloadFile.js:158 ~ DownloadFile ~ filenameOrID, isFolder:`, filenameOrID, isFolder);
    try {
      //console.log(`Downloading filename or id ${filenameOrID} isFolder ${isFolder}`);
      const FileDownload = require('js-file-download');
      // Indicate download
      this.setState({
        downloadText: `Downloading ${isFolder ? 'folder' : 'file'} ${filenameOrID}`,
        downloadClass: 'disabled_download'
      });

      let _filename = filenameOrID;
      if (isFolder) { // folder case handles this on download if _filename===null
        _filename = null;
      }

      let getRoute = Globals.currentHost + 'file/downloadFile';
      if (isFolder) {
        getRoute = Globals.currentHost + 'file/downloadFolder';
      }
      console.log(`Getting file from ${getRoute} for file ${filenameOrID}`);
      axios.get(getRoute, {
        params: {
          filename: filenameOrID,
          id: filenameOrID
        },
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => { // Show progress if available
          const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');

          if (isFolder && !_filename) { // multi-file case, archive filename needs to be extracted from header
            // filename is surrounded by "quotes" so get that and remove those
            let fileInfo = progressEvent.target.getResponseHeader('content-disposition');
            if (!fileInfo) {
              return null; // Never mind
            }
            let fileInfoName = fileInfo.split("filename=");

            // set filename for saving from backend, sans quotes
            _filename = fileInfoName[1].substr(1, fileInfoName[1].length - 2);
          }

          if (totalLength !== null) { // Progress as percent, if we have total
            this.setState({
              progressValue: '(' + Math.round((progressEvent.loaded * 100) / totalLength) + '% downloaded)'
            });
          } else if (progressEvent.loaded) { // Progress as MB
            this.setState({
              progressValue: '(' + (Math.round(progressEvent.loaded / 1024 / 1024)) + 'MB downloaded)'
            });
          }
          // else progress remains blank
        }
      }).then((response) => {

        // Indicate download completed as file is saved/prompted save as (depending on browser settings)
        if (response) {
          this.setState({
            downloadText: 'Done'
          });
          FileDownload(response.data, _filename);
          //    this.props.onSetNotification('Done', 'success');
          this.logInteraction(true);
        }

        // verified = response && response.status === 200;
      })
        .catch((error) => {
          console.error(`Error Downloading File : DownloadFile.js:224 ~ DownloadFile ~ error:`, error);
          if (error.response && error.response.status === 404) {
            this.setState({
              downloadText: 'File not found',
              downloadClass2: 'disabled_download'
            });
            //    this.props.onSetNotification('File not found', 'error');
          } else if (error.response && error.response.status === 403) {
            this.setState({
              downloadPreText: <LoginModal message="Session expired: Please click here to login again" />,
              downloadClass: 'document-download',
              downloadClass2: ''
            });
            //    this.props.onSetNotification('Session expired: Please click here to login again', 'error');
          } else {
            this.setState({
              downloadText: 'Server may be down for maintenance, please try again later',
              downloadClass2: 'disabled_download'
            });
            //    this.props.onSetNotification('Server may be down for maintenance, please try again later', 'error');
          }

        }

        );
    }
    catch (e) {
      console.error(`Error Occured while attempting to download folder`, e);
      onSetNotification(`An error occurred: ${e.message}`, 'error');
    }
  }

  handleLoginClick = () => {
    this.props.history.push('/login');
  }

  render() {
    //[TODO][CRITICAL] Remove only for testing!!!
    /// localStorage.role = "ADMIN";
    // { this.props.onSetNotification('File not found', 'error') }
    <>
      {/* <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transitionDuration={{ enter: 100, exit: 500 }}
        open={true}
        autoHideDuration={3000}>
        <Alert severity={'error'}>
          This is a Message
        </Alert>
      </Snackbar> */}
    </>

    if (localStorage.role === undefined) {
      const msg = (`Please <a href="/login" target='_blank' rel='noopener noreferrer'>log in</a> to download files." or <a className="not-logged-in" href='register' target='_blank' rel='noopener noreferrer'>register</a> to download files.`)
      //{ this.props.onSetNotification(msg, 'warn') }
      return (
        <>
          {/* <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transitionDuration={{ enter: 100, exit: 500 }}
            open={open}
            autoHideDuration={3000}>
            <Alert severity={'info'}>
              This is a Message
            </Alert>
          </Snackbar> */}
        </>
      )

    }
    else if (this.props) {
      let cellData = null;
      let propFilename = null;
      let propID = null;
      if (this.props.cell) { // filename/cell data from React-Tabulator props
        cellData = this.props.cell._cell.row.data;
        // console.log(cellData);
        if (this.props.downloadType === "Comments") {
          propFilename = cellData.commentsFilename;
        }
        else if (cellData.id && cellData.folder) {
          propID = cellData.id;
        }
        else if (this.props.downloadType === "EIS") {
          propFilename = cellData.filename;
        }
      }
      else if (this.props.downloadType && this.props.downloadType === "Folder") { // from record details page
        propID = this.props.id;
      }
      else if (this.props.filename) { // filename only
        // console.log("Filename only?: " + this.props.filename);
        propFilename = this.props.filename;
      }

      let sizeText = "";
      if (this.props.size) {
        sizeText = this.props.size + "MB";
      }

      if (this.props.downloadType && this.props.downloadType === "nepafile") {
        propID = this.props.id;
        return (<>
          {this.state.downloadPreText}
          <Button border={1}
            fullWidth
            color="primary"
            variant='contained'
            //className={this.state.downloadClass2}
            onClick={() => { this.downloadNepaFile(propFilename, propID) }}>
            Download
          </Button>
          <span className="propFilename">??? {propFilename}</span>
        </>
        );
      }
      else if (propFilename) {
        return (<>
          {this.state.downloadPreText}
          <Button
            color="primary"
            fullWidth
            variant='contained'
            //className={this.state.downloadClass}
            onClick={() => { this.download(propFilename, false) }}>
            Download
            {this.state.downloadText} {sizeText} {this.state.progressValue}
          </Button>
          {/* <span className="propFilename"> {propFilename}</span> */}
        </>
        );
      } else if (propID) {
        console.log(`file: DownloadFile.js:322 ~ DownloadFile ~ render ~ propID:`, propID);
        // folder downloads are zipped on demand and should therefore display as .zip
        let innerText = this.props.innerText;
        if (innerText && innerText.length > 4 && innerText.substr(-4).toLowerCase() !== '.zip') {
          innerText += ".zip";
        }

        return (
          <>
            {this.state.downloadPreText}
            <Button
              color="primary"
              fullWidth
              variant='contained'
              //className={this.state.downloadClass}
              onClick={() => { this.download(propID, true) }}>
              {this.state.downloadText} <b>{innerText.replaceAll(' ', '_')}</b> - {sizeText} {this.state.progressValue}
            </Button>
            {/* {this.props.onSetNotification(`${this.state.downloadText} - ${this.state.progressValue}}`, 'info')} */}
          </>
        );
      } else {
        // this.props.onSetNotification(`Returning File Name ${propFilename}`, 'info');
        return (
          <>
            Unable to download {propFilename}
          </>
        )
      }
    }
    else {
      return (
        <></>
        // <Notifications message="Test error message" messageType='error' />
      );
    }
  }
}