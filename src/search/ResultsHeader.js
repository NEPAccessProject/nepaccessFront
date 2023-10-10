import { SearchOutlined } from '@material-ui/icons';
import {
	Box,
	Grid,
	Hidden,
	IconButton,
	ListItem,
	TextField,
} from '@mui/material';
import React from 'react';
import Globals from '../globals';
import SearchContext from './SearchContext';
import SearchResultOptions from './SearchResultOptions';
import SearchTipsDialog from './Dialogs/SearchTipDialog';
import AvailableFilesDialog from './Dialogs/AvailableFilesDialog';
import QuickStartDialog from './Dialogs/QuickStartDialog'
const sortOptions = [
	{ value: 'relevance', label: 'Relevance' },
	{ value: 'title', label: 'Title' },
	{ value: 'agency', label: 'Lead Agency' },
	{ value: 'registerDate', label: 'Date' },
	{ value: 'state', label: 'State' },
	// { value: 'documentType', label: 'Type'}
];

export default class ResultsHeader extends React.Component {
	static contextType = SearchContext;

	constructor(props) {
		super(props);
		const ctx = this.context;
		console.log(
			`file: ResultsHeader.js:32 ~ ResultsHeader ~ constructor ctx State:`,
			ctx,
		);
		const {
			onInput,
			handleProximityValues,
			results,
			titleRaw,
			sort,
      onCheckboxChecked,
			useOptionsChecked,
		} = props;
		this.state = {
			//[TODO] move sort and sort order to the parent state (Search) component
			sort: { value: 'relevance', label: 'Relevance' },
			order: { value: true, label: '^' },
			isSearchTipsDialogOpen: false,
			isAvailableFilesDialogOpen: false,
			isQuickStartDialogOpen: false,
		};
		console.log(
			`file: ResultsHeader.js:41 ~ ResultsHeader ~ constructor ~ this.state:`,
			this.state,
		);
	}
	toggleSearchTipsDialog = (evt) => {
		console.log(
			'🚀 ~ Current State after SearchTipsToggle',
			this.state,
		);

		this.setState({
			isSearchTipsDialogOpen:
				!this.state.isSearchTipsDialogOpen,
		});
	};
	toggleAvailableFilesDialog = (evt) => {
		console.log(
			'🚀 ~ file: ResultsHeader.js:25 ~ toggleAvailableFilesDialog ~ evt:',
			evt,
		);
		this.setState({
			isAvailableFilesDialogOpen:
				!this.state.isAvailableFilesDialogOpen,
		});
	};
	toggleQuickStartDialog = (evt) => {
		console.log(
			'🚀 ~ file: ResultsHeader.js:32 ~ toggleQuickStartDialog ~ toggleQuickStartDialog:',
			evt,
		);
		this.setState({
			isQuickStartDialogOpen:
				!this.state.isQuickStartDialogOpen,
		});
	};

	onSortChange = (event) => {
		console.log(
			`file: ResultsHeader.js:59 ~ ResultsHeader ~ event:`,
			event,
		);
		//if (event.action === "select-option") {
		this.setState(
			{
				sort: event.target.value,
			},
			() => {
				this.props.sort(
					this.state.sort.value,
					this.state.order.value,
				);
			},
		);
		//}
	};
	onSortOrderChange = (event) => {
		console.log(
			`file: ResultsHeader.js:72 ~ ResultsHeader ~ event:`,
			event,
		);
		//    if (event.action === "select-option") {
		this.setState(
			{
				order: event.target.value,
			},
			() => {
				this.props.sort(
					this.state.sort.value,
					this.state.order.value,
				);
			},
		);
		//  }
	};

	showDownloadButton = () => {
		if (Globals.curatorOrHigher()) {
			return (
				<label
					className='link export'
					onClick={this.props.download}>
					Export search results
				</label>
			);
		} else if (localStorage.role) {
			// logged in?
			return (
				<label
					className='link export'
					onClick={this.props.exportToSpreadsheet}>
					Export search results
				</label>
			);
		}
	};
	onIconClick = (evt) => {
		console.log('onIconClick evet', evt);
	};

	componentDidMount() {
		console.log(
			'🚀 ~ file: ResultsHeader.js:89 ~ componentDidMount ~ this.context:',
			this.context,
		);
		const { state, setState } = this.context;
		this.setState(
			{
				...this.state,
				state,
			},
			() => {
				console.log('Result Header state', this.state);
			},
		);
		// this.setState = this.context
	}

	render() {
		return (
			<>
				<SearchTipsDialog
          onClose={this.toggleSearchTipsDialog.bind(this)}
					isOpen={this.state.isSearchTipsDialogOpen}
				/>
				<AvailableFilesDialog
          onClose={this.toggleAvailableFilesDialog.bind(this)}
					isOpen={this.state.isAvailableFilesDialogOpen}
				/>
        <QuickStartDialog
          onClose={this.toggleQuickStartDialog.bind(this)}
          isOpen={this.state.isQuickStartDialogOpen}
          />  
				<Grid
        container
					id='search-text-grid-container'
					display={'flex-root'}
					alignItems={'center'}
					layout={'row'}
					spacing={1}
          >
					<Hidden mdDown>
						<Grid
							item
							xs={0}
							md={2}>
							<Box
								id='search-text-grid-item'
								// backgroundColor="transparent"
								height={115}
		              >
								<ListItem
									onClick={this.toggleSearchTipsDialog.bind(this)}>
									<a href='#'>
										Search Tips
									</a>
								</ListItem>
								<ListItem
									onClick={this.toggleAvailableFilesDialog.bind(
										this,
									)}>
									<a href='#'>
										Available Files
									</a>
								</ListItem>
								<ListItem
									onClick={this.toggleQuickStartDialog.bind(
										this,
									)}>
									<a href='#'>Quick Start
									</a>
								</ListItem>
							</Box>
						</Grid>
					</Hidden>

					<Grid
            id="search-box-grid-container"
						container
						flex={1}
            >
						<Grid
							item
							xs={12}
							border={0}
							md={12}
							borderLeft={0}
							marginTop={2}
							id='search-box-grid-item'>
							<Box
								id='search-box-box-item'
								display={'flex'}
								height={60}
								padding={0}
                >
								<TextField
									fullWidth
									backgroundColor={'white'}
									id='main-search-text-field'
									name='titleRaw'
									variant='outlined'
                  color="primary"
									focused
									onInput={(evt) => this.props.onInput(evt)}
									// onKeyUp={onKeyUp}
									// onKeyDown={onKeyDown}
									placeholder='Search for NEPA documents'
									value={
										this.props.titleRaw
											? this.props.titleRaw
											: ''
									}
									autoFocus
									InputProps={{
										endAdornment: (
											<IconButton
												name='titleRaw'
												value={
													this.props.titleRaw
														? this.props.titleRaw
														: ''
												}
												onClick={this.props.onIconClick}>
												<SearchOutlined />
											</IconButton>
										),
									}}
								/>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							md={12}
							borderLeft={0}
							id='search-box-result-options-container'>
							<SearchResultOptions
								state={this.state}
								setPageInfo={this.props.setPageInfo}
								onUseOptionsChecked={
									this.props.onUseOptionsChecked
								}
								onCheckboxChange={this.props.onCheckboxChange}
								onLimitChangeHandler={
									this.onLimitChangeHandler
								}
                onCheckboxChecked={this.props.onCheckboxChecked}
								onSortDirectionChangeHandler={
									this.onSortOrderChange
								}
								onDownloadClick={this.onDownloadClick}
								onSortByChangeHandler={this.onSortChange}
								onSortOrderChange={this.onSortOrderChange}
							/>
						</Grid>
					</Grid>
				</Grid>
			</>
		);
	}
}
