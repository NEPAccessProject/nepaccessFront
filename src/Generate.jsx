import React from 'react';
import axios from 'axios';
import './User/login.css';
import Globals from './globals.jsx';


import DocumentText from './DocumentText.jsx';

class Generate extends React.Component {
    state = {
        users: [], // Naming should mirror Generate POJO on backend
        shouldSend: false,
        admin: false
    }

    constructor(props){
        super(props);
        this.generate = this.generate.bind(this);
        this.csvChange = this.csvChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.test = this.test.bind(this);
        this.fixAbbrev = this.fixAbbrev.bind(this);
    }

    checkAdmin = () => {
        let checkUrl = new URL('user/checkAdmin', Globals.currentHost);
        axios({
            url: checkUrl,
            method: 'POST'
        }).then(response => {
            console.log("Response", response);
            console.log("Status", response.status);
            let responseOK = response.data && response.status === 200;
            if (responseOK) {
                this.setState({
                    admin: true
                });
            } else {
                console.log("Else");
            }
        }).catch(error => {
            //
        })
    }

    csvChange(event){
        let text = event.target.value;
        const jsonArray = csvToJSON(text);
        this.setState({users: jsonArray}, () => {
          console.log("Users: ");
          console.log(this.state.users);
        });
    }

    handleRadioChange(event){
        let sendStatus = false;
        if(event.target.value === "send" && event.target.checked){
            sendStatus = true;
        }
        this.setState({
            shouldSend: sendStatus
        }, () =>{
            console.log(this.state.shouldSend);
        });
    }

    generate(){
        let generateUrl = new URL('user/generate', Globals.currentHost);
        console.log(this.state);

        axios({
            url: generateUrl,
            method: 'POST',
            data: this.state
          }).then(response => {
            console.log(response)
          }).catch(error => {
            console.log(error);
          })
    }

    render() {
        if(this.state.admin) {
            return (
                <div id="main">
                    <textarea cols='60' rows='20' name="csvText" onChange={this.csvChange} />
                    <ul>
                    <li>
                        <label>
                            <input  type="radio"
                                    value="send"
                                    checked={this.state.shouldSend}
                                    onChange={this.handleRadioChange}>
                            </input>
                            Send an email to each user with credentials
                        </label>
                    </li>
                    <li>
                        <label>
                            <input  type="radio"
                                    value="noSend"
                                    checked={!this.state.shouldSend}
                                    onChange={this.handleRadioChange}>
                            </input>
                            Do not send an email to each user with credentials
                        </label>
                    </li>
                    </ul>
                    <br /><br />
                    <button className="button" onClick={this.generate}>Generate accounts</button>
                    
                    <br /><br /><br />
                    <button className="button" onClick={() => this.fixAbbrev()}>Fix agency abbreviations</button>
                    
                    <br /><br /><br />
                    <button className="button" onClick={() => this.test('EisDocuments-89324.zip')}>Test file download stream</button>
                    <br /><br /><br />
                    <button className="button" onClick={() => this.testBulkImport()}>Test bulk import</button>
                    <br /><br /><br />
                    <DocumentText />
                </div>
            )
        } else {
            return <div id="main">401</div>
        }
    }
    
    fixAbbrev() {
        let fixUrl = new URL('test/fix_abbrev', Globals.currentHost);
        axios({
            url: fixUrl,
            method: 'POST'
        }).then(response => {
            let responseOK = response && response.status === 200;
            console.log("OK?",responseOK);
            if(response){
                console.log("Response",response.data);
            }
        }).catch(error => {
            console.error(error);
        })
    }

    testBulkImport() {
      console.log("Activating bulk test for " + Globals.currentHost);

      axios.get((Globals.currentHost + 'file/bulk'),{
        responseType: 'blob'
      })
      .then((response) => {
        console.log("Activating bulk import");
        console.log(response);
        // verified = response && response.status === 200;
      })
      .catch((err) => { // This will show exceptions, will also fire if server down
        console.log(err);
      });
      
    }

    
    test(_filename) {
      console.log("Activating test for " + Globals.currentHost);
      const FileDownload = require('js-file-download');

      axios.get((Globals.currentHost + 'file/downloadFile'),{
        params: {
          filename: _filename
        },
        responseType: 'blob'
      })
      .then((response) => {
        console.log("Activating FileDownload");
        FileDownload(response.data, _filename);
        // verified = response && response.status === 200;
      })
      .catch((err) => { // This will catch a 403 from the server from a malformed/expired JWT, will also fire if server down
        console.log(err);
      });
      
    }

    componentDidMount = () => {
        try {
            this.checkAdmin();
        } catch(e) {
            console.error(e);
        }
    }

}

export default Generate;

//var csv is the CSV text with headers
function csvToJSON(csv){

    console.log(csv);

    var lines=csv.split(/\r?\n/);
  
    var result = [];
  
    var headers=lines[0].split(",");
    // .match(/("[^"]+"|[^,]+)/g);
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
        // .match(/("[^"]+"|[^,]+)/g);
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
    
    return result; //JavaScript object
    // return JSON.stringify(result); //JSON (you don't want this with axios, you might with fetch)
  }