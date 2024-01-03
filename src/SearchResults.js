import React from 'react';

import ResultsHeader from './ResultsHeader.js';

import SearchResult from './SearchResult.js';

import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme
import PropTypes from 'prop-types';

import './card.css';

// const _ = require('lodash');

const options = {
    // maxHeight: "100%",           // for limiting table height
    // layoutColumnsOnNewData: true,
    selectable: false,
    tooltips: false,
    // responsiveLayout:"collapse",    //collapse columns that dont fit on the table
    // responsiveLayoutCollapseUseFormatters:false,
    pagination: "local",             //paginate the data
    paginationSize: 10,              //allow 10 rows per page of data
    paginationSizeSelector: [10, 25, 50], // with all the text, even 50 is a lot.
    movableColumns: false,            //don't allow column order to be changed
    resizableRows: false,
    resizableColumns: false,
    layout: "fitColumns",
    invalidOptionWarnings: false, // spams warnings without this
    footerElement: ("<span class=\"tabulator-paginator-replacer\"><label>Results Per Page:</label></span>")
};



class SearchResults extends React.Component {

    downloaded = {};
    _columns = [];
    hidden = new Set();

    constructor(props) {
        super(props);
        this.state = {
            showContext: true,
            hidden: new Set()
        }
        this.my_table = React.createRef();
        window.addEventListener('resize', this.handleResize);

        this._columns = [
            {
                title: "", field: "", formatter: reactFormatter(
                    <SearchResult show={this.state.showContext}
                        saveDownloaded={this.saveDownloaded}
                        checkDownloaded={this.checkDownloaded}
                        hideText={this.hideText}
                        hidden={this.hide} />
                )
            }
        ];
    }

    page = 1;

    hide = (props) => {
        // console.log("Hit",props);
        return this.hidden.has(props);
    }

    hideText = (id) => {
        if (this.hidden.has(id)) {
            this.hidden.delete(id);
            this.setState({ hidden: this.hidden });
        } else {
            this.hidden.add(id);
            this.setState({ hidden: this.hidden });
        }
    }

    /**Giving up on this again for now.  A ton of work would be required to have this AND:
    * automatic result population 
    * mid-search filtering
    * mid-search sorting*/
    // shouldComponentUpdate(nextProps, nextState) {
    //     // console.log("Next state",nextState);
    //     // console.log("Inc props",nextProps);
    //     // console.log("Results",nextProps.results===this.props.results); 
    //     // console.log("Text",nextProps.resultsText===this.props.resultsText,this.props.resultsText,nextProps.resultsText); 
    //     // console.log("searching",nextProps.searching===this.props.searching); 
    //     // console.log("snippets",nextProps.snippetsDisabled===this.props.snippetsDisabled); 

    //     if(nextProps.shouldUpdate)
    //     {
    //         console.log("Component should update");
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // Table needs help to resize its cells if window is resized
    handleResize = () => {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        });
    }

    onPageLoaded = (pageNumber) => {
        if (this.page !== pageNumber) {
            // console.log("#",pageNumber);
            this.page = pageNumber;

            // Scrolling is done by footer at the bottom, so when scrolling pages (of variable height)
            // this will keep the user at the bottom of the page, using a referenced div
            // const pageChanged = this.props.pageChanged;

            try {
                // Probably need to deep clone this but circular structure refuses
                // const currentPageRows = JSON.parse(JSON.stringify(this.my_table.current.table.rowManager.displayRows[1]));
                // const currentPageRows = this.my_table.current.table.rowManager.displayRows[1];


                // const scroll = this.props.scrollToBottom;
                // scroll(currentPageRows);
                this.props.scrollToTop();
            } catch (e) {
                console.error(e);
                // do nothing
            }

            // Too laggy, would be used for showing user which # results they're viewing by page * results per page
            // this.setState({
            //     page: pageNumber
            // });
        }
    }

    onClearFiltersClick = (e) => {
        if (this.my_table && this.my_table.current) {
            const tbltr = this.my_table.current;
            tbltr.table.clearFilter(true);
        }
    }

    onCheckboxChange = (evt) => {
        this.setState({
            showContext: evt.target.checked
        });
    }

    // resetSort = () => {
    //     this.my_table.current.table.setData(this.props.results);
    // }

    updateTable = () => {
        try {
            // Tried to use this to make things better but it seemed to make them worse
            // this.my_table.current.table.blockRedraw();

            let _columns = [];
            if (this.props.results && this.props.results[0]) {
                _columns = [
                    {
                        title: "", field: "", formatter: reactFormatter(<SearchResult
                            show={this.state.showContext}
                            saveDownloaded={this.saveDownloaded}
                            checkDownloaded={this.checkDownloaded}
                            hideText={this.hideText}
                            hidden={this.hide} />)
                    }
                ];
            }
            this.my_table.current.table.setColumns(_columns); // needed for text snippets show/hide

            this.my_table.current.table.replaceData(this.props.results);
            // to maintain page user is on even after rerender, we try saving page as a local variable and setting it here
            this.my_table.current.table.setPage(this.page);
        } catch (e) {
            console.log("Column setup error");
            // that's okay
        }
    }

    saveDownloaded = (_name) => {
        this.downloaded[_name] = true;
    }

    checkDownloaded = (_name) => {
        return this.downloaded[_name];
    }

    render() {
        if (this.props.results && this.props.results.length > 0) {

        }
        else {
            /** Show nothing, until we are loading results.
             * props.resultsText will just be "Results" before any search.
             * During a search, it will be "Loading results..." and if 100+ async results we may
             * simultaneously have 100 props.results
             * After a search we won't hit this logic because we'll have props.results
             */
            if (this.props.resultsText && this.props.resultsText !== "Results") {
                return (
                    <div className="sidebar-results">
                        <div id="search-results">
                            <div className="tabulator-holder">
                                <h2 id="results-label">
                                    {this.props.resultsText}
                                </h2>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <></>
                );
            }
        }

        try {
            // let data = this.setupData(results);
            // let columns = this.setupColumns();

            // let _columns = [
            //     { title: "", field: "", formatter: reactFormatter(<SearchResult show={this.state.showContext} />)}
            // ];

            return (
                <div className="sidebar-results">
                    <div id="search-results">
                        <div className="tabulator-holder">
                            <ResultsHeader
                                sort={this.props.sort}
                                resultsText={this.props.resultsText}
                                searching={this.props.searching}
                                snippetsDisabled={this.props.snippetsDisabled}
                                showContext={this.state.showContext}
                                onCheckboxChange={this.onCheckboxChange}
                                download={this.props.download}
                            // page={this.state.page}
                            />
                            {/* <button className="link margin" onClick={() => this.onClearFiltersClick()}>Clear filters</button> */}
                            <ReactTabulator
                                ref={this.my_table}
                                data={[]}
                                columns={this._columns}
                                options={options}
                                pageLoaded={this.onPageLoaded}
                            />
                        </div>
                    </div>
                </div>
            );
        }
        catch (e) {
            if (e instanceof TypeError) {
                console.error("TypeError", e);
                // expected problem with Tabulator trying to render new results before it switches to new column definitions
            } else {
                console.error("Other", e);
            }
            /** Wishlist: Put the most relevant error message in here */
            return (
                <div className="sidebar-results">
                    <h2 id="results-label">{this.props.resultsText}</h2>
                </div>
            )
        }
    }

    // TODO: Preserve scroll position on rerender/redraw if possible
    componentDidUpdate() {
        console.log("Results Updated");
        /** setTimeout with 0ms activates at the end of the Event Loop, redrawing the table and thus fixing the text wrapping.
         * Does not work when simply fired on componentDidUpdate().
         */
        if (this.my_table && this.my_table.current) {
            // console.log("Updating data and columns");
            // console.log(this.props);
            this.updateTable();

            // console.log("Searching: " + this.props.searching);

            // card height can't figure itself out precisely without a redraw so for now we disable 
            // this check: even while more results are loading, first page will redraw and look good
            // if(!this.props.searching){ 
            try {
                const tbltr = this.my_table.current;
                setTimeout(function () {
                    tbltr.table.redraw(true);
                    // console.log("Redrawn");
                }, 0)
            } catch (e) {
                console.error("Redraw error", e);
            }
            // }

            // tbltr.table.restoreRedraw();
        }

    }
}
SearchResult.propTypes = {
    show: PropTypes.bool,
    saveDownloaded: PropTypes.func,
    checkDownloaded: PropTypes.func,
    hideText: PropTypes.func,
    hidden: PropTypes.func,
}
export default SearchResults;