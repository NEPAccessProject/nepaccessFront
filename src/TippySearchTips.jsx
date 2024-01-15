import React from 'react'

import 'tippy.js/dist/tippy.css'; // optional
import Tippy from '@tippyjs/react';

export default class TippySearchTips extends React.Component {
    state = {
        visible: false
    }

    setVisible(val) {
        this.setState({visible: val});
    }

    content = () => { 
        return (<>
            <div className="tooltip-header">
                Search word connectors 
                <button className="float-right" onClick={() => {this.setVisible(false)}}>
                    x
                </button>
            </div>
            <table className="tooltip-table"><tbody>
                <tr className="tooltip-line">
                    <td>&nbsp;</td><td>&nbsp;</td>
                </tr>
                <tr className="tooltip-line"><td className="tooltip-connector">AND</td>
                    <td>This is the default. <span className="bold">All</span> words you enter must be found together to return a result.</td>
                </tr>
                <tr className="tooltip-line">
                    <td>&nbsp;</td><td>&nbsp;</td>
                </tr>
                <tr className="tooltip-line"><td className="tooltip-connector">OR</td>
                    <td>(all caps) to search for <span className="bold">any</span> of those words.</td> 
                </tr>
                <tr className="tooltip-line">
                    <td>&nbsp;</td><td>&nbsp;</td>
                </tr>
                <tr className="tooltip-line"><td className="tooltip-connector">NOT</td>
                    <td>(all caps) to <span className="bold">exclude</span> a word or phrase.</td> 
                </tr>
                <tr className="tooltip-line">
                    <td>&nbsp;</td><td>&nbsp;</td>
                </tr>
                <tr className="tooltip-line"><td className="tooltip-connector">&quot; &quot;</td>
                    <td>Surround words with quotes (&quot; &quot;) to search for an <span className="bold">exact phrase.</span></td> 
                </tr>
                <tr className="tooltip-line">
                    <td>&nbsp;</td><td>&nbsp;</td>
                </tr>
                <tr className="tooltip-line"><td className="tooltip-connector"></td>
                    <td><a href="search-tips" target="_blank" rel="noopener noreferrer">More search tips.</a></td> 
                </tr>
            </tbody></table>
            </>
        );
    }

    tooltipHtml = () => {
        return (<span 
                onClick={() => {this.setVisible(!this.state.visible)}}
                className={"side-link inline"}>
                Search tips
            </span>);
    }

    render () {
        return (
            <Tippy className="tippy-tooltip--small searchTips padding2"
                    interactive={true}
                    placement="bottom"
                    visible={this.state.visible}
                    content={this.content()}>
                {this.tooltipHtml()}
            </Tippy>
        );
    }
}