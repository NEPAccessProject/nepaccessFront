import React from 'react';
import axios from 'axios';

import Globals from './globals.jsx';

export default class DeleteAll extends React.Component {
    
    state = {
        deleteList: [],
        response: "",
        admin: false
    }

    deleteAll = () => {
        const deleteUrl = new URL('admin/delete_all', Globals.currentHost);
        const dataForm = new FormData();
        dataForm.append('deleteList', this.state.deleteList);

        axios({
            url: deleteUrl,
            method: 'POST',
            data: dataForm
        }).then(_response => {
            const rsp = _response.data;
            this.setState({
                response: rsp 
            });
        }).catch(error => { 
            console.error(error);
            this.setState({ response: error });
        })
    }

    onChange = (evt) => {
        console.log("DeleteAll: onChange",evt.target.value);
        this.setState({ [evt.target.name]: evt.target.value });
    }

    render() {
        if(this.props.admin) {
            return (
                <div>
                    <h3>Bulk delete tool</h3>
                    <div className="instructions"><span className="bold">
                        Instructions: 
                        Expects COMMA delimited list of IDs to delete e.g. 1,2,3,4
                    </span></div>
                    
                    <div><span>
                        IDs to delete:
                    </span></div>

                    <textarea name="deleteList" onInput={this.onChange} onChange={this.onChange}></textarea>

                    <button onClick={this.deleteAll} >Delete records</button>
                    
                    <div><span>
                        Server response
                    </span></div>

                    <textarea className="server-response" readOnly value={this.state.response}></textarea>
                </div>
            );
        } else {
            return <div>401</div>
        }

        
    }

    componentDidMount = () => {
    }
}