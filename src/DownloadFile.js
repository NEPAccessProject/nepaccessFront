import React from 'react';
import axios from 'axios';
import './User/login.css';
import Globals from './globals.js';
import { Button, Snackbar } from '@mui/material'
import LoginModal from './User/LoginModal.js';
import Notifications from './Notifications';
import theme from './styles/theme';
export default class DownloadFile extends React.Component {

  // Receives needed props from React-Tabular instance in SearchResults.js
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
    this.showNotifications(`Calling ${_url} with dataForm:`,"info")
    axios({
      url: _url,
      method: 'POST',
      data: dataForm
    }).then(response => {
      // let responseOK = response && response.status === 200;
      console.log(response.status);
    }).catch(error => {
      console.error(error);
      this.showNotifications(error, "error")
    })
  }

  downloadNepaFile = (_filename, _id) => {
    console.log(`file: DownloadFile.js:61 ~ DownloadFile ~ _filename,_id:`, _filename, _id);
    const FileDownload = require('js-file-download');

    // Indicate download
    this.setState({
      downloadText: 'Downloading...',
      downloadClass2: 'disabled_download'
    });

    let getRoute = Globals.currentHost + 'file/download_nepa_file';
    console.log(`Getting file from ${getRoute} for file ${_filename}`);

    this.showNotifications(`Getting file from ${getRoute} for file ${_filename}`,"info")

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
          this.setState({
            downloadText: 'File not found',
            downloadClass2: 'disabled_download'
          });
          this.showNotifications('File not found', 'error');
        } else if (error.response && error.response.status === 403) {
          this.setState({
            downloadPreText: <LoginModal message="Session expired: Please click here to login again" />,
            downloadClass: 'document-download',
            downloadClass2: ''
          });
          this.showNotifications('Session expired: Please click here to login again','error');
        } else {
          this.setState({
            downloadText: 'Server may be down for maintenance, please try again later',
            downloadClass2: 'disabled_download'
          });
          this.showNotifications('Server may be down for maintenance, please try again later','error');
        }
      });
  }

  // TODO: Cell resets to default state if parent re-renders, preserve the fact it was downloaded
  // at least until user reloads the page or navigates?  This was working before, but got more complex with process view
  // TODO: reset download link if canceled
  // these could be very difficult to figure out for low payoff, however
  download = (filenameOrID, isFolder) => {
    try{
      console.log(`Downloading filename or id ${filenameOrID} isFolder ${isFolder}`);
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
          this.showNotifications('Done','success');
          this.logInteraction(true);
        }

        // verified = response && response.status === 200;
      })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            this.setState({
              downloadText: 'File not found',
              downloadClass2: 'disabled_download'
            });
            this.showNotifications('File not found','error');
          } else if (error.response && error.response.status === 403) {
            this.setState({
              downloadPreText: <LoginModal message="Session expired: Please click here to login again" />,
              downloadClass: 'document-download',
              downloadClass2: ''
            });
            this.showNotifications('Session expired: Please click here to login again','error');
          } else {
            this.setState({
              downloadText: 'Server may be down for maintenance, please try again later',
              downloadClass2: 'disabled_download'
            });
            this.showNotifications('Server may be down for maintenance, please try again later','error');
          }

        }

        );
      }
      catch(e){
        console.log(`file: DownloadFile.js:219 ~ DownloadFile ~ e:`, e);
        showNotifications(`An error occurred: ${e.message}`,'error');
      }
  }

  showNotifications = (message,messageType) => {
    return(
      <Notifications message={message} messageType={messageType} open={true} />
    )
  }

  handleLoginClick = () => {
    this.props.history.push('/login');
  }

  render() {
    //[TODO][CRITICAL] Remove only for testing!!!
    /// localStorage.role = "ADMIN";
    if (localStorage.role === undefined) {
      const msg =  (`Please <a href="/login" target='_blank' rel='noopener noreferrer'>log in</a> to download files." or <a className="not-logged-in" href='register' target='_blank' rel='noopener noreferrer'>register</a> to download files.`)

      return (
        <>
        <Notifications message={msg} messageType='error'/>
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
          <Button border={3} fullWidth color="primary" variant='contained' className={this.state.downloadClass2} onClick={() => { this.downloadNepaFile(propFilename, propID) }}>
              Download
           </Button>
          {/* <span className="propFilename">??? {propFilename}</span> */}
        </>
        );
      }
      else if (propFilename) {
        console.log(`file: DownloadFile.js:270 ~ DownloadFile ~ render ~ propFilename:`, propFilename);
        return (<>
          {this.state.downloadPreText}
          <Notifications message="Test error message" messageType='error' />
          <Button
            color="primary"
            variant='contained'
            className={this.state.downloadClass}
            onClick={() => { this.download(propFilename, false) }}>
            316 - {this.state.downloadText} {sizeText} {this.state.progressValue}
          </Button>
          <span className="propFilename"> {propFilename}</span>
        </>
        );
      } else if (propID) {
        // folder downloads are zipped on demand and should therefore display as .zip
        let innerText = this.props.innerText;
        if (innerText && innerText.length > 4 && innerText.substr(-4).toLowerCase() !== '.zip') {
          innerText += ".zip";
        }

        return (
          <>
            {this.state.downloadPreText}
            <Button color="primary" variant='contained' className={this.state.downloadClass} onClick={() => { this.download(propID, true) }}>
              332 - {this.state.downloadText} <b>{innerText.replaceAll(' ', '_')}</b> - {sizeText} {this.state.progressValue}
            </Button>
            {this.showNotifications(`${this.state.downloadText} - ${this.state.progressValue}}`,'info')}
          </>
        );
      } else {
        this.showNotifications(`Returning File Name ${propFilename}`,'info');
        return propFilename;
      }
    }
    else {
      return (
        <Notifications message="Test error message" messageType='error' />
      );
    }
  }
}