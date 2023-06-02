import React from 'react';

import ResultsHeader from '../ResultsHeader.js';
import SearchProcessResult from './SearchProcessResult.js';

import SearchResultsMap from './SearchResultsMap.js';

import Globals from '../globals.js';

import { ReactTabulator } from 'react-tabulator';
import { reactFormatter } from "react-tabulator";
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_site.min.css'; // theme

import Tippy from '@tippyjs/react';

import '../loader.css';

import '../cardProcess.css';

const _ = require('lodash');

const FULLSTYLE = {
    width: '100%',
    minWidth: '20%',
    maxWidth: '100%'
}

export default class SearchProcessResults extends React.Component {

    _size = 0;
    _columns = [];
    hidden = new Set();

    page = 1;
    pageSize = 10;
    offsetY = null;

    constructor(props) {
        super(props);
        this.state = {
            showContext: true,
            size: 0,
            hidden: new Set()
        }
        window.addEventListener('resize', this.handleResize);
        Globals.registerListener('new_search', this.resetHidden);
        
        this._columns = [
            { title: "", field: "", formatter: reactFormatter(
                    <SearchProcessResult 
                        show={this.state.showContext}
                        hideText={this.hideText}
                        hidden={this.hide} />
                )
            }
        ];
        
        this.options = {
            selectable:false,
            tooltips:false,
            pagination:"local",             //paginate the data
            paginationSize:10,              //allow 10 rows per page of data
            paginationSizeSelector:[10, 25, 50], // with all the text, even 50 is a lot.
            movableColumns:false,            //don't allow column order to be changed
            resizableRows:false,             
            resizableColumns:false,
            layout:"fitColumns",
            invalidOptionWarnings:false, // spams spurious warnings without this
        };

        this.updateTableDebounced = _.debounce(this.updateTable, 0);
        this.doneRenderDebounced = _.debounce(this.doneRender, 0);
    }
    
    resetHidden = () => {
        // console.log("Brand new search, clear toggled Set");
        this.hidden = new Set();
    }

    hide = (props) => {
        return this.hidden.has(props);
    }

    hideText = (_offsetY, _index, record) => {
        this.offsetY = _offsetY;
        
        if(this.hidden.has(record.id)) {
            this.hidden.delete(record.id);
            this.setState({hidden: this.hidden});
        } else {
            this.hidden.add(record.id);
            this.setState({hidden: this.hidden}, () => {
                this.props.gatherSpecificHighlights(_index, record);
            });
        }
    }
    
    handleResize = () => {
    }
    /** TODO:  The problem is that we don't always want to scroll when the page has to
    * redraw.  Examples would be showing/hiding text snippets or changing the page.  Page tends to redraw
    * several times, so we can't just immediately set offsetY to null, and it's slightly laborious to clear
    * offsetY every time we do any other kind of event.  So we just clear it here on a delay, but it's a little
    * bit of a hack. */
    doneRender = () => {
        // console.log("They see me scrollin'")
        if(this.offsetY) {
            // console.log("They hatin'",this.offsetY)
            window.scrollTo(0,this.offsetY);
            setTimeout(() => {
                // After all redraws are probably finished, clear variable
                this.offsetY = null;
            }, 500);
        }
    }
    onPageLoaded = (pageNumber) => {
        // this.page can become a string on mount/unmount, which makes comparisons interesting.
        // console.log(typeof(this.page));
        try {
            const TABLE = this.ref.table;
            let PAGE_SIZE = TABLE.footerManager.links[0].size;
            let shouldScroll = false;
            // Page change OR page size change
            if(this.page != pageNumber || this.pageSize != PAGE_SIZE){

                // Only scroll to top on new page, not new page size
                if(this.page != pageNumber) {
                    shouldScroll = true;
                }
                
                // Need to set these ahead of informAppPage()
                this.page = pageNumber;
                this.pageSize = PAGE_SIZE;

                // Ensures this won't try to run if parent (App.js) isn't supporting on-demand highlighting
                if(this.props.informAppPage) {
                    this.props.informAppPage(pageNumber, PAGE_SIZE);
                }

                if(shouldScroll) {
                    this.props.scrollToTop();
                }
            } else {
                // do nothing
                // console.log("Nothing is different", this.page, pageNumber, this.pageSize, PAGE_SIZE);
            }
        } catch(e) {
            /* New search (or webapp navigation): Reset page number.
                Otherwise on new search the table will go to the page from the previous results from the previous search,
                which can't possibly be correct. Size could be restored but 10 is actually already large. */
            this.page = pageNumber;
            this.pageSize = 10;

            // console.error(e);
            // console.error("Table not yet rendered");
        }
    }
    handlePaginationError = (evt) => {
        console.log("Custom pagination error logic");
        this.onPageLoaded(1);
    }
    
    onCheckboxChange = (evt) => {
        this.setState({ 
            showContext: evt.target.checked
        });
    }
    
    /** To update show/hide text snippets, updates columns; also redraws table to accommodate potentially 
     * different-sized contents (particularly height) so that nothing overflows and disappears outside the table itself
    */
    updateTable = () => {
        if(this.ref && this.ref.table) {
            const TABLE = this.ref.table;
            try {
                // all needed for text snippets show/hide
                let _columns = [];
                if(this.props.results && this.props.results[0]){
                    this._size = this.props.results.length;

                    _columns = [
                        { title: "", field: "", formatter: reactFormatter(<SearchProcessResult 
                            show={this.state.showContext} 
                            hideText={this.hideText}
                            hidden={this.hide} />)}
                    ];
                }
                TABLE.setColumns(_columns); 
    
                // Check if filtering has reduced the page count below the last known active page.
                // We don't want to call setPage on a page that doesn't exist.
                // Use max page in that case. Other option would be setPage(1).
                TABLE.setPage(Math.min(this.page,TABLE.footerManager.links[0].max));
                // Note that we might want the page to be reset in some circumstances but that can be handled if so
            } catch (e) {
                console.log("Column setup error");
                // that's okay
            } finally {
                // need to redraw to accommodate new data (new dimensions) or hiding/showing texts
                setTimeout(function() {
                    TABLE.redraw(true);
                    console.log("Table redrawn");
                },0)
            }
        }
        
    }

    getCorrectResultsStyle = () => {
        if(this.props.filtersHidden) {
            return FULLSTYLE;
        } else {
            return null;
        }
    }

	render() {
        if(!this.props.results || !(this.props.results.length > 0)) {
            /** Show nothing until loading results. props.resultsText will just be "Results" before any search.
             * During a search, it will be "Loading results..." and if 100+ async results we may
             * simultaneously have 100 props.results.  After a search we won't hit this logic because we'll have props.results
             */
            if(this.props.resultsText && this.props.resultsText!=="Results") {
                return (
                    <div className="sidebar-results">
                        <div id="process-results">
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

            return (
                <div className="sidebar-results" style={this.getCorrectResultsStyle()}>

                    <div id="process-results">

                        <div className="tabulator-holder">

                            <div className="results-count-holder">
                                <h2 id="results-label" className="inline">
                                    {this.props.resultsText}&nbsp;
                                        <Tippy className="tippy-tooltip--small searchTips" trigger='manual click' 
                                            hideOnClick={true}
                                            interactive={true}
                                            placement="right"
                                            content={
                                                <div>
                                                    The map view is a <span className="bold">visual representation</span> of all states and counties found in the current results
                                                    table. 
                                                    <div>
                                                        • If you hover over a polygon, a tooltip will also show how many of the current results are linked to it.
                                                    </div>
                                                    <div>
                                                        • You can toggle the state and/or county layer by clicking on the checkboxes in the upper left corner.
                                                    </div>
                                                </div>}
                                        >
                                            {<span className={"side-link inline"}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 100 100">
                                                    <path className="info-svg" d="M50.433,0.892c-27.119,0-49.102,21.983-49.102,49.102s21.983,49.103,49.102,49.103s49.101-21.984,49.101-49.103S77.552,0.892,50.433,0.892z M59,79.031C59,83.433,55.194,87,50.5,87S42,83.433,42,79.031V42.469c0-4.401,3.806-7.969,8.5-7.969s8.5,3.568,8.5,7.969V79.031z M50.433,31.214c-5.048,0-9.141-4.092-9.141-9.142c0-5.049,4.092-9.141,9.141-9.141c5.05,0,9.142,4.092,9.142,9.141C59.574,27.122,55.482,31.214,50.433,31.214z"/>
                                                </svg>
                                            </span>}
                                        </Tippy>
                                </h2>
                            </div>
                            <SearchResultsMap 
                                toggleMapHide={this.props.toggleMapHide}
                                isHidden={this.props.isMapHidden}
                                docList={this.props.geoResults}
                                results={this.props.results}
                                // searcherState={this.props.searcherState}
                            />

                            <ResultsHeader 
                                sort={this.props.sort}
                                searching={this.props.searching}
                                snippetsDisabled={this.props.snippetsDisabled} 
                                showContext={this.state.showContext}
                                onCheckboxChange={this.onCheckboxChange}
                                download={this.props.download}
                                exportToSpreadsheet={this.props.exportToSpreadsheet}
                            />
                            
                            {/* {this.props.searching ? <>Please wait...</> : <></>} */}

                            <ReactTabulator
                                ref={ref => (this.ref = ref)}
                                data={this.props.results}
                                columns={this._columns}
                                options={this.options}
                                pageLoaded={this.onPageLoaded}
                                renderComplete={this.doneRenderDebounced}
                                paginationError={this.handlePaginationError}
                            />
                        </div>
                    </div>
                </div>
            );
        }
        catch (e) {
            if(e instanceof TypeError){
                // Tabulator trying to render new results before it switches to new column definitions
                console.error("TypeError",e);
            } else {
                console.error(e);
            }
            return (
                <div className="sidebar-results">
                    <h2 id="results-label">{this.props.resultsText}</h2>
                </div>
            )
        }
    }

    componentDidMount() {
        // // Restore user's last viewed page in results if possible
        if(localStorage.unmountedPage) {
            try {
                this.page = localStorage.unmountedPage;
            } catch(e) {
                console.log(e);
            }
        }
    }

    componentWillUnmount() {
        // // Save last viewed page number so user doesn't lose their place on navigation
        localStorage.unmountedPage = this.page;
    }
    
    componentDidUpdate() {
        this.updateTableDebounced();
    }
}

// function uuidv4() {
//     let returnVal = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
//         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//     );
//     console.log('uuid',returnVal);

//     return returnVal;
// }