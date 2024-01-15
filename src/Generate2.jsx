import React from 'react';
import axios from 'axios';
import './User/login.css';
import Globals from './globals.jsx';


export default class Generate2 extends React.Component {
    state = {
        users: [], // Naming should mirror Generate POJO on backend
        shouldSend: false,
        admin: false,
        result: "",
        resultJSONString: ""
    }

    constructor(props){
        super(props);
        this.generate = this.generate.bind(this);
        this.csvChange = this.csvChange.bind(this);
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

    generate(){
        let generateUrl = new URL('user/generate2', Globals.currentHost);
        console.log("Generate based on this state",this.state);

        axios({
            url: generateUrl,
            method: 'POST',
            data: this.state.users
        }).then(response => {
            console.log("Response",response)
            this.setState({
                result: JSONToCSV(response.data),
                resultJSONString: JSON.stringify(response.data)
            });
        }).catch(error => {
            console.log("Error",error);
        })
    }

    


    copyResults = () => {
        const el = this.textArea
        let textToCopy = el.innerHTML;
        if(navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('copied');
            });
        } else {
            console.log('unsupported');
        }
    }

    copyResultsJSON = () => {
        const el = this.textArea2
        let textToCopy = el.innerHTML;
        if(navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('copied');
            });
        } else {
            console.log('unsupported');
        }
    }

    render() {
        if(this.state.admin) {
            return (
                <div className="content padding">
                    <div>
                        <span>
                            Expects CSV format contents, i.e.
                        </span>
                            <span className="block">username,password,email</span>
                            <span className="block">testusername,,test@test.test</span>
                            <span className="block">testusername2,,test2@test.test</span>
                    </div>
                    <textarea cols='60' rows='20' name="csvText" onChange={this.csvChange} />
                    <br /><br />
                    <button className="button" onClick={this.generate}>Generate accounts</button>
                    <br />

                    <div>
                        <span>
                            CSV server response
                        </span>
                    </div>
                    <textarea ref={(textarea) => this.textArea = textarea}
                                name="result" value={this.state.result} readOnly />
                    <br />

                    <button className="button"
                                onClick={this.copyResults}>Copy results to clipboard</button>
                    <div>
                        <span>
                            JSON server response
                        </span>
                    </div>
                    <textarea ref={(textarea2) => this.textArea2 = textarea2} 
                                name="resultJSONString" value={this.state.resultJSONString} readOnly />
                    <br />
                    
                    <button className="button"
                                onClick={this.copyResultsJSON}>Copy results to clipboard</button>

                    <div>
                        <span>
                            If blank password in csv line:  Account was not created due to invalid/duplicate username or email address.
                        </span>
                    </div>
                    
                    
                </div>
            )
        } else {
            return <div className="content">401</div>
        }
    }

    componentDidMount = () => {
        try {
            this.checkAdmin();
        } catch(e) {
            console.error(e);
        }
    }

}

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
    
    console.log(result);
    return result; //JavaScript object
    // return JSON.stringify(result); //JSON (you don't want this with axios, you might with fetch)
}

function JSONToCSV(json){
    let fields = Object.keys(json[0]);
    let replacer = function(key, value) { return value === null ? '' : value } 

    let csv = json.map(function(row){
        return fields.map(function(fieldName){
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
    });

    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');

    return csv;
}