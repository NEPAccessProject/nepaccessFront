import React from 'react';

export default class CardDetailsLink extends React.Component {

    render () {
        return (
            <span className="table-row">
                <span className="cardHeader">Title:
                    <a className="link" target="_blank" rel="noopener noreferrer" href={`./record-details?id=${this.props.id}`}>
                        {this.props.title}
                    </a>
                </span>
                
            </span>
        );
    }

}