import React from 'react';
import axios from 'axios';

import Globals from './globals.jsx';

export default class AdminEmailer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            emailSubject: "",
            emailBody: "",
            emails: "",
            sendValue: "",
            
            response: "",
            error: "",
            count: 0,
            admin: false,
            disabled: false
        }
    }

    checkAdmin = () => {
        let checkUrl = new URL('user/checkAdmin', Globals.currentHost);

        axios({
            url: checkUrl,
            method: 'POST'
        })
        .then(response => {
            let responseOK = response.data && response.status === 200;

            if (responseOK) {
                this.setState({ admin: true });
            } else {
                this.setState({ admin: false });
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ admin: false });
        })
    }

    copyResults = () => {
        const el = this.textArea
        // let textToCopy = el.innerText;
        let textToCopy = el.innerHTML;
        if(navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('copied');
            });
        } else {
            console.log('unsupported');
        }
    }

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value }, () => {
            // console.log(this.state);
        });
    }
    onChangeDummy = () => {
        // do nothing
    }
    onEmailsChange = (evt) => {
        let str = evt.target.value;
        let _count = 0;
        let warning = "";
        let lines = str.split(/\r?\n/);
        let commas = str.split(',');

        if(lines.length > commas.length) {
            _count = lines.length;
            if(commas.length > 1) {
                warning = "WARNING: CHECK INPUT: Unexpected commas found, they will be replaced with lines before send and count doesn't reflect this";
            }
        } else {
            _count = commas.length;
            if(lines.length > 1) {
                warning = "WARNING: CHECK INPUT: Unexpected lines found, they will be replaced with commas before send and count doesn't reflect this";
            }
        }

        this.setState({ 
            emails: str,
            count: _count,
            error: warning
        });
    }

    sendAll = () => {
        if(!(this.state.sendValue === "SEND")) {
            console.log("SEND not found in input");
            return;
        }
        
        document.body.style.cursor = 'wait';

        this.setState({
            response: "",
            emailError: '', 
            networkError: '', 
            disabled: true 
        });

        const el = this.state.emails;
        const emailArray = splitByCommaOrNewline(el);

        for (let i = 0; i < emailArray.length; i++) {
            setTimeout(() => {
                this.sendEmail(emailArray[i]).then(rslt => {
                    if(i === (emailArray.length - 1)) {
                        this.setState({
                            disabled: false
                        }, () => {
                            console.log("Completely finished");
                            document.body.style.cursor = 'default';
                        })
                    }
                });
            }, 15000 * i); // 15 second delay
        }

    }

    sendEmail = async (emailAddress) => {
        console.log("Sending email to " + emailAddress);
        
        let sendUrl = new URL('admin/send_email', Globals.currentHost);
        let datum = {subject: this.state.emailSubject, body: this.state.emailBody, recipientEmail: emailAddress};

        const response = await axios({ 
            method: 'POST',
            url: sendUrl,
            data: datum
        }).then(response => {
            console.log(response);
            let responseOK = response && response.status === 200;
            let rsp = this.state.response + response.data + "\n";
            if (responseOK) {
                this.setState({ 
                    response: rsp,
                    disabled: false 
                });
                return true;
            } else {
                this.setState({ 
                    response: rsp,
                    disabled: false 
                });
                return false;
            }
        });

        return response;
    }

    render() {
        return (
            <div>
                <div className="note">
                    Emailer
                </div>
                <div id="admin-files-content">
                    

                    <div>
                        <label className="block bold" htmlFor="emailSubject">Email subject</label>
                        <input type="text" name="emailSubject"
                                value={this.state.emailSubject} onChange={this.onChange} />
                    </div>

                    <div>
                        <label className="block bold" htmlFor="emailBody">Email body</label>
                        <textarea name="emailBody"
                                rows={10}
                                cols={100}
                                value={this.state.emailBody} onChange={this.onChange} />
                    </div>


                    <div>
                        <label className="block bold" htmlFor="emails">Recipient Emails separated by commas or newlines go here</label>
                        <textarea name="emails"
                                rows={10}
                                cols={100}
                                value={this.state.emails} onChange={this.onEmailsChange} />
                    </div>

                    <label>{this.state.error}</label>

                    <div>
                        <label># items detected: {this.state.count}</label>
                    </div>
                    
                    <div>
                        <button 
                                className="button"
                                disabled={this.state.disabled}
                                onClick={this.sendAll}>
                            Send emails
                        </button>
                    </div>

                    <div>
                        <label className="block bold" htmlFor="response">Server Response</label>
                        <textarea 
                                className="server-response"
                                ref={(textarea) => this.textArea = textarea}
                                id="response" value={this.state.response} onChange={this.onChangeDummy} />
                    </div>

                    <div>
                        <button className="button" onClick={this.copyResults}>
                            Copy results to clipboard
                        </button>
                    </div>

                    <div>
                        <label>Type SEND here to confirm use:</label>
                        <input type="text" name="sendValue"
                                value={this.state.sendValue} onChange={this.onChange} />
                    </div>


                    <br />
                    <hr />
                    <br />

                </div>
            </div>);
    }

    componentDidMount() {
        this.checkAdmin();
    }

    componentDidUpdate() {
    }
}

function splitByCommaOrNewline(str) {
    if(!str) {
        console.log("Nothing here");
        return [];
    }

    let lines = str.split(/\r?\n/);
    let commas = str.split(',');
    if(lines.length > commas.length) {
        str = str.replaceAll(/,/g,'\n');
        lines = str.split(/\r?\n/);
        console.log("lines detected", lines);
        return lines;
    } else {
        str = str.replaceAll(/\r?\n/g,',');
        commas = str.split(',');
        console.log("commas detected", commas);
        return commas;
    }
}