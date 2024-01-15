import React from 'react';
import Select from 'react-select';
import Globals from './globals';

const sortOptions = [ 
    { value: 'relevance', label: 'Relevance' },
    { value: 'title', label: 'Title'},
    { value: 'agency', label: 'Lead Agency'},
    { value: 'registerDate', label: 'Date'},
    { value: 'state', label: 'State'},
    // { value: 'documentType', label: 'Type'}
];

const sortOrderOptions = [ 
    { value: true, label: '^'},
    { value: false, label: 'v' }
];

export default class ResultsHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sort: { value: 'relevance', label: 'Relevance' },
            order: { value: true, label: '^'}
        }
    }

    onSortChange = (value_label, event) => {
        if(event.action === "select-option"){
            this.setState({
                sort: value_label
            }, () => {
                this.props.sort(this.state.sort.value, this.state.order.value);
            });
        }
    }
    
    onSortOrderChange = (value_label, event) => {
        if(event.action === "select-option"){
            this.setState({
                order: value_label
            },() => {
                this.props.sort(this.state.sort.value, this.state.order.value);
            });
        }
    }

    showDownloadButton = () => {
        if(Globals.curatorOrHigher()) {
            return <label className="link export" onClick={this.props.download}>
                Export search results
            </label>;
        } else if(localStorage.role) { // logged in?
            return <label className="link export" onClick={this.props.exportToSpreadsheet}>
                Export search results
            </label>;
        }
    }

    render () {

        return (
            <div className="results-bar">
                    <div className="options-container">
                        <div className="sort-container inline-block">
                            <label className="dropdown-text" htmlFor="post-results-dropdown">
                                Sort by:
                            </label>
                            <Select id="post-results-dropdown" 
                                className={"multi inline-block"} classNamePrefix="react-select" name="sort" 
                                // styles={customStyles}
                                options={sortOptions} 
                                onChange={this.onSortChange}
                                value={this.state.sort}
                                placeholder={this.state.sort.label}
                            />
                            <Select id="post-results-dropdown-order" 
                                className={"multi inline-block"} classNamePrefix="react-select" name="sortOrder" 
                                // styles={customStyles}
                                options={sortOrderOptions} 
                                onChange={this.onSortOrderChange}
                                value={this.state.order}
                                placeholder={this.state.order.label}
                            />
                        </div>
                        
                        <div id="results-bar-checkbox" className="checkbox-container inline-block">
                            <input id="post-results-input" type="checkbox" name="showContext" className="sidebar-checkbox"
                                    checked={this.props.showContext} 
                                    onChange={this.props.onCheckboxChange}
                                    disabled={this.props.snippetsDisabled}  />
                            <label className="checkbox-text no-select" htmlFor="post-results-input">
                                Show text snippets
                            </label>
                        </div>
                        {this.showDownloadButton()}
                    </div>

                </div>
        )
    }
    

}