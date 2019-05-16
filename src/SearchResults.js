import React from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator_midnight.css'; // theme
import { ReactTabulator } from 'react-tabulator';

class SearchResults extends React.Component {

	render() {
        console.log("SearchResults");

	    // TODO: At some point, the database should probably be giving us the headers to use.
        const results = this.props.results;
        var data = results.map((result, idx) =>{
            var newObject = {title: result.title, agency: result.agency, commentDate: result.commentDate, 
            registerDate: result.registerDate, state: result.state, documentType: result.documentType, 
            documents: result.documents};
            return newObject;
        });
        
        const columns = [
            { title: "Title", field: "title", width: 750 },
            { title: "Agency", field: "agency" },
            { title: "Comment date", field: "commentDate", width: 140 },
            { title: "Register date", field: "registerDate", width: 140 },
            { title: "State", field: "state", width: 80 },
            { title: "Version", field: "documentType", width: 90 },
            { title: "Files", field: "documents"}
        ];

        var options = {
            tooltips:true,
            responsiveLayout:"collapse",  //collapse columns that dont fit on the table
            pagination:"local",       //paginate the data
            paginationSize:"25",       //allow 25 rows per page of data
            movableColumns:true,      //allow column order to be changed
            resizableRows:true,       //allow row order to be changed
            layout:"fitColumns"
        };

        // TODO: Rig up a filter to help narrow down the results with another search.
        // This could also be used to entirely replace the MySQL fulltext search.
        // However, Tabulator doesn't work super great with React.

		// const results = this.props.results;
		return (
			// <table>
			// 	<thead><tr>
			// 	<th>Title</th>
			// 	<th>Agency</th>
			// 	<th>Comments date</th>
			// 	<th>Register date</th>
			// 	<th>State</th>
			// 	<th>Version</th>
			// 	</tr></thead>
			// 	<tbody>
			// 		{results.map((result, idx) =>
			// 			<tr key={idx}>
			// 				{/* <td><a href={result.documents} className='detailLink' id={`eis${result.id}`}>{result.title}</a></td> */}
			// 				<td>{result.title}</td>
            //                 <td>{result.agency}</td>
			// 				<td>{result.commentDate}</td>
			// 				<td>{result.registerDate}</td>
			// 				<td>{result.state}</td>
			// 				<td>{result.documentType}</td>
			// 			</tr>
			// 		)}
			// 	</tbody>
            // </table>
            <div>
			    <h2>{results.length} Results</h2>
                <ReactTabulator
                    data={data}
                    columns={columns}
                    options={options}
                />
            </div>
		)
	}
}

export default SearchResults;