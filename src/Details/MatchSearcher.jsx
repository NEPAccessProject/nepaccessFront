import React from 'react';

import "react-datepicker/dist/react-datepicker.css";

require('lodash');

class MatchSearcher extends React.Component {

    constructor(props) {
        super(props);
		this.state = {
            id: 0,
            matchPercent: 50,
            searcherClassName: '',
            matchPercentError: '',
            matchType: 'advanced'
		};
        this.debouncedSearch = _.debounce(this.props.search, 300);
		// this.onKeyUp = this.onKeyUp.bind(this);
    }

    sanePercent = (percent) => { 
        let result = false;
        if(!Number.isNaN(parseFloat(percent)) && Number.isFinite(percent) && (percent/100) < 1.01 && (percent/100) > 0.00){
            result = true;
            this.setState({
                matchPercentError: ''
            });
        } else {
            this.setState({
                matchPercentError: 'Invalid percentage'
            });
        }
        return result;
    }

    checkChange = (evt) => {
        let _type = 'basic';
        if(evt.target.checked) {
            _type = 'advanced';
        }
        this.setState({
            matchType: _type
        }, () => {
            this.debouncedSearch(this.state);
        })
    }
    
    onChange = (evt) => {
        // console.log(this.sanePercent(Number.parseInt(evt.target.value)));
        if(this.sanePercent(Number.parseInt(evt.target.value))){
            this.setState( 
            { 
                [evt.target.name]: evt.target.value
            }, () => {
                this.debouncedSearch(this.state);
            });
        }
    }

    // Can either just make the form a div or use this to prevent Submit default behavior
	submitHandler(e) { e.preventDefault(); }
    
    render () {

        let similarityTooltip = "A lower match percentage yields more results.";
        return (
            <form className="titleMatchForm" onSubmit={this.submitHandler}>
                {/* <Tooltip 
                size="small"
                title={similarityTooltip}>
                    <svg className="cursor-default no-select" id="tooltip2" width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M31.1311 16.5925C31.1311 24.7452 24.4282 31.3772 16.1311 31.3772C7.83402 31.3772 1.1311 24.7452 1.1311 16.5925C1.1311 8.43982 7.83402 1.80774 16.1311 1.80774C24.4282 1.80774 31.1311 8.43982 31.1311 16.5925Z" fill="#E5E5E5" stroke="black" strokeWidth="2"/>
                                            </svg>
                                            <span id="tooltip2Mark" className="cursor-default no-select">?</span>
                </Tooltip> */}
                
                <div className="checkbox-container">
                    <input id="matchCheckbox" className="checkbox" type="checkbox" defaultChecked="true" 
                            onChange={this.checkChange} />
                    <label htmlFor="matchCheckbox" className="checkbox-label">
                        Compare state; lead agency; type; and date, for stricter results
                    </label>
                </div>
                <label className="matchSearchLabel" htmlFor="matchSearchPercent">
                    Title similarity tool
                </label>
                <input id="matchSearchPercent" type="range" min="10" max="100" step="1" value={this.state.matchPercent} 
                        name="matchPercent" autoFocus onChange={this.onChange} />
                    {this.state.matchPercent}%
                <div><span>
                    {similarityTooltip}
                </span></div>
            </form>
        )
    }

    componentDidMount() {
        console.log("From props: ", this.props.id);
        this.setState({
            matchPercent: this.props.matchPercent,
            id: this.props.id
        }, () => {
            this.debouncedSearch(this.state);
        });
    }
}

export default MatchSearcher;