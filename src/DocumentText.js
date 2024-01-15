import React from 'react';
import axios from 'axios';
import Globals from './globals.jsx';


class DocumentText extends React.Component {
    state = {
        textId: 0
    }

    handleChange = (event) => {
        let val = event.target.value;
        this.setState({
          textId: val
        });
    }
    
    render(){
        return (
            <div>
                <input type="text" value={this.state.textId} onChange={this.handleChange}></input>
                <button className="button" onClick={() => this.getText(this.state.textId)}>
                    Get DocumentText by ID
                </button>
            </div>
          )
    }

    getText(textId) {
        console.log("Activating text test for " + Globals.currentHost);

        axios.get((Globals.currentHost + 'text/get_by_id'),{
        params: {
            id: textId
        }
        })
        .then((response) => {
            // verified = response && response.status === 200;
            console.log(response);
        })
        .catch((err) => { // Catch a 403 from the server from a malformed/expired JWT, will also fire if server down
            console.log(err);
        });
    }
}

export default DocumentText;