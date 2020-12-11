import React from 'react';
import Select from 'react-select';

const sortOptions = [ { value: 'relevance', label: 'Relevance' },
    { value: 'title', label: 'Title'},
    { value: 'agency', label: 'Lead Agency'},
    { value: 'registerDate', label: 'Date'},
    { value: 'state', label: 'State'},
    { value: 'documentType', label: 'Type'}
];

export default class ResultsHeader extends React.Component {

    onSortChange = (value_label, event) => {
        if(event.action === "select-option"){
            this.props.sort(value_label.value);
        }
    }

    render () {

        return (
            <div className="results-bar">
                    <h2 id="results-label" className="inline">
                        {/* {((this.props.page*10) - 9) + " - " + this.props.page*10 + " of " + this.props.resultsText} */}
                        {this.props.resultsText}
                    </h2>
                    <div className="checkbox-container inline-block">
                        <input id="post-results-input" type="checkbox" name="showContext" className="sidebar-checkbox"
                                checked={this.props.showContext} 
                                onChange={this.props.onCheckboxChange}
                                disabled={this.props.snippetsDisabled}  />
                        <label className="checkbox-text" htmlFor="post-results-input">
                            Show text snippets
                        </label>
                    </div>
                    <div className="sort-container inline-block">
                        <label className="dropdown-text" htmlFor="post-results-dropdown">
                            Sort by:
                        </label>
                        <Select id="post-results-dropdown" 
                            className={"multi inline-block"} classNamePrefix="react-select" name="sort" 
                            // styles={customStyles}
                            options={sortOptions} 
                            onChange={this.onSortChange}
                            placeholder="Relevance"
                        />
                    </div>
                </div>
        )
    }
    

}