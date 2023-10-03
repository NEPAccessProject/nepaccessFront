import {
	Autocomplete,
	Box,
	Button,
	Container,
	Checkbox,
	Divider,
	FormControl,
	FormLabel,
	TextField,
	Typography,
	Stack,
	Chip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/styles';
import React, { useContext } from 'react';
//import { ThemeProvider, createUseStyles } from "react-jss";
import SearchContext from './SearchContext';
//import Grid from '@mui/material/Grid'; // Grid version 1
import { ThemeProvider } from '@material-ui/core';
import Globals from '../globals';
import theme from '../styles/theme';
import SearchDatePickers from './SearchDatePickers';
import {
	actionOptions as actions,
	agencyOptions as agencies,
	decisionOptions as decisions,
	countyOptions,
} from './options';
//filter out duplicates
const actionOptions = Array.from(new Set(actions));
const agencyOptions = Array.from(new Set(agencies));
//const countyOptions =Array.from(new Set(counties));
const decisionOptions = Array.from(new Set(decisions));
const stateOptions = Array.from(new Set(Globals.locations));

const Item = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	// textAlign: 'center',
	color: theme.palette.text.secondary,
	elevation: 0,
	mt: 2,
	mb: 2,
	pl: 0,
	pr: 0,
	'&:hover': {
		//           backgroundColor: //theme.palette.grey[200],
		boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
		cursor: 'pointer',
		'& .addIcon': {
			color: 'purple',
		},
	},
}));

const SideBarFilters = (props) => {
	const { state, setState } = useContext(SearchContext);
	console.log(
		`🚀 ~ file: SideBarFilters.jsx:53 ~ SideBarFilters ~ CONTEXT state:`,
		state,
	);
	console.log(`STATE AGENCY???!!!!`, state.agency);
	const {
		filtersHidden,
		onActionChange,
		onAgencyChange,
		onCooperatingAgencyChange,
		onCountyChange,
		onDateChange,
		onDecisionChange,
		onEndDateChange,
		onLocationChange,
		onMarkupChange,
		onNeedsDocumentChecked,
		onProximityChange,
		onStartDateChange,
		onTitleOnlyChecked,
		onTypeChecked,
		onUseOptionsChecked,
		orgClick,
		renderClearFiltersButton,
		toggleFiltersHidden,
		onClearFilter,
	} = props;


	//Common Settings used by all autocomplete filters
	const filterProps = {
		fullWidth: true,
		multiple: true,
		autoComplete: true,
		autoHighlight: true,
		limitTags: 3,
		disablePortal: true,
		variant: 'standard',
		getLimitTagsText: (options) =>
			options.label.length > 10
				? options.label.slice(0, 10) + '...'
				: options.label,
		getOptionLabel: (v) =>
			v.label.length > 15 ? `${v.label.slice(0, 15)}...` : `${v.label}`,
	};

	const getValue = (options, stateValue) => {
		console.log(
			`file: SideBarFilters.jsx:103 ~ getValue ~ stateValue:`,
			stateValue,
		);
		console.log(`file: SideBarFilters.jsx:103 ~ getValue ~ options:`, options);
		return 'This is a label';
	};

	return (
		<>
			<ThemeProvider theme={theme}>
				<>
					<Grid container>
						<Item
							//borderRight={1}
							//borderColor={'#000'}
							//className="sidebar-filters"
							hidden={state.filtersHidden}
							// this would launch a new search on enter key, in some child inputs
							// onKeyUp={onKeyUp}
						>
							{/* <Item
                display={'flex'}
								sx={{
									textAlign: 'center',
									alignItems: 'center',
								}}>
								<Typography variant="h6">Narrow your results</Typography>
								<Button
                  padding={0}
                  fullWidth
                  margin={0}
                  variant='outline'
									//className="filters-toggle"
									onClick={(evt) => toggleFiltersHidden(evt)}>

                  </Button>
							</Item> */}
              							
							<Item alignItems={'center'}>
								{/* <FormLabel>
                  <Typography className={classes.FormLabel} variant="filterLabel"> Search Only Within titles</Typography>
                </FormLabel> */}
								<FormLabel
									control={
										<Checkbox
											tabIndex='3'
											checked={state.searchOption === 'C'}
											onChange={onTitleOnlyChecked}
										/>
									}
									label='Search Only Within titles'
								/>
							</Item>
							<Item padding={0} margin={0} justifyContent={'center'} alignItems={'center'} border={1} borderColor="red">
								<Button height='20px' padding={0} margin={0} fullWidth variant='text' border={1}>
									Clear Filters
								</Button>
								{/* {renderClearFiltersButton()} */}
							</Item>
							<Divider />
							<Item>
								{/* #region Lead Agencies Filter */}
								{JSON.stringify(state.agency)}
								<FormControl fullWidth>
									<FormLabel htmlFor='searchAgency'>Lead Agencies:</FormLabel>
									<Autocomplete
										id='searchAgency'
										name='agency'
										{...filterProps}
										tabIndex={3}
										options={agencyOptions}
										value={agencyOptions.filter((v) =>
											state.agency.includes(v.value),
										)}
										onChange={(evt, value, tag) =>
											onAgencyChange(evt, value, tag)
										}
										getOptionLabel={(v) =>
											v.label.length > 15
												? `${v.label.slice(0, 15)}...`
												: `${v.label}`
										}
										ListboxProps={{
											maxWidth: 200,
											border: '1px solid black',
										}}
										renderInput={(params) => {
											return (
												<TextField
													{...params}
													placeholder='Type or Select Lead Agencies'
													variant='outlined'
													sx={{
														width: '100%',
														p: 0,
													}}
												/>
											);
										}}
									/>
								</FormControl>
								{/* #endregion */}
							</Item>
							<Item>
								<FormControl
									fullWidth
									xs={{
										p: 1,
										mb: 1,
										mt: 1,
									}}>
									{JSON.stringify(state.cooperatingAgency)}
									<FormLabel htmlFor='searchAgency'>
										Cooperating Agencies:
									</FormLabel>
									<Autocomplete
										id='searchAgency'
										name='cooperatingAgency'
										{...filterProps}
										tabIndex={4}
										options={agencyOptions}
										getOptionLabel={(v) =>
											v.label.length > 15
												? `${v.label.slice(0, 15)}...`
												: `${v.label}`
										}
										value={agencyOptions.filter((v) =>
											state.cooperatingAgency.includes(v.value),
										)}
										onChange={(evt, value, tag) =>
											onCooperatingAgencyChange(evt, value, tag)
										}
										renderInput={(params) => {
											return (
												<TextField
													{...params}
													placeholder='Type or Select Lead Agencies'
													variant='outlined'
													sx={{
														width: '100%',
														p: 0,
													}}
												/>
											);
										}}
									/>
								</FormControl>
							</Item>
							<Divider />
							<Item>
								{JSON.stringify(state.state)}
								<FormLabel htmlFor='state'>State(s) and Location(s):</FormLabel>
								<Autocomplete
									id='state'
									name='state'
									{...filterProps}
									options={stateOptions}
									value={stateOptions.filter((v) =>
										state.state.includes(v.value),
									)}
									onChange={(evt, value) => onLocationChange(evt, value)}
									getOptionLabel={(v) =>
										v.label.length > 15
											? `${v.label.slice(0, 15)}...`
											: `${v.label}`
									}
									renderInput={(params) => {
										return (
											<TextField
												{...params}
												placeholder='Type or Select a State'
												variant='outlined'
												sx={{
													width: '100%',
													p: 0,
												}}
											/>
										);
									}}
								/>
							</Item>
							<Item>
								<FormLabel Label htmlFor='county'>
									County/counties:
								</FormLabel>
								{JSON.stringify(state.county)}
								state.county: {state.county.length}
								<Autocomplete
									id='county'
									name='county'
									tabIndex={5}
									options={countyOptions}
									value={countyOptions.filter((v) =>
										state.county.includes(v.value),
									)}
									onChange={(evt, value, reason) =>
										onCountyChange(evt, value, reason)
									}
									getOptionLabel={(v) =>
										v.label && v.label.length > 15
											? `${v.label.slice(0, 15)}...`
											: ``
									}
									//getOptionLabel={(agencyOptions) => agencyOptions.label}
									renderInput={(params) => {
										return (
											<TextField
												placeholder='Type or Select a Counties'
												{...params}
												variant='outlined'
												sx={{
													width: '100%',
													p: 0,
												}}
											/>
										);
									}}
								/>
							</Item>
							<div hidden={!Globals.authorized()}>
								<div hidden={!Globals.curatorOrHigher()}></div>
								<Divider />

								<div hidden={!Globals.authorized()}>
									<Item>
										{JSON.stringify(state.action)}
										<FormLabel htmlFor='searchAction'>Action Type:</FormLabel>
										<Autocomplete
											id='searchAction'
											name='searchAction'
											tabIndex={10}
											className={'classes.autocomplete'}
											options={actionOptions}
											//                      value={getValue(actionOptions, state.action)}
											onChange={(evt, value) => onActionChange(evt, value)}
											getOptionLabel={(v) =>
												v.label.length > 15
													? `${v.label.slice(0, 15)}...`
													: `${v.label}`
											}
											renderInput={(params) => {
												return (
													<TextField
														{...params}
														placeholder='Type or Select a Action Type(s)'
														variant='outlined'
														sx={{
															width: '100%',
															p: 0,
														}}
													/>
												);
											}}
										/>
									</Item>
								</div>
							</div>
							<div hidden={!Globals.authorized()}>
								decisionOptions: {decisionOptions.length}
								<Item>
									{JSON.stringify(state.decision)}
									<FormLabel htmlFor='searchDecision'></FormLabel>
									<Typography variant='filterLabel'>Decision Type</Typography>
									<Autocomplete
										id='searchDecision'
										name='decision'
										tabIndex='11'
										options={decisionOptions}
										placeholder='Type or select decision type(s)'
										multiple={true}
										onChange={(evt, value, reason) =>
											onDecisionChange(evt, value, reason)
										}
										getOptionLabel={(v) =>
											v.label && v.label.length > 15
												? `${v.label.slice(0, 15)}...`
												: v.label
										}
										value={decisionOptions.filter((v) =>
											state.decision.includes(v.value),
										)}
										renderInput={(params) => (
											<TextField
												{...params}
												variant='outlined'
												placeholder='Type or select decision type(s)'
												sx={{
													width: '100%',
													p: 0,
												}}
											/>
										)}
									/>
								</Item>
							</div>

							<Divider />
							<Item>
								<Box
									display={'flex'}
									xs={12}
									flexDirection={'column'}
									padding={0}
									margin={0}
									width={'100%'}
									alignContent={'center'}
									justifyItems={'center'}>
									<SearchDatePickers
										onStartDateChange={(evt) => onStartDateChange(evt)}
										onEndDateChange={(evt) => onEndDateChange(evt)}
										startDate={state.startDate}
										endDate={Date.now - 1}
									/>
								</Box>
							</Item>

							<Divider />
							<Item>
								{/* <Typography var="filterLabel">Document Type</Typography>              */}
								<Box>
									<Item>
										<FormLabel
											control={
												<Checkbox
													name='typeFinal'
													id='typeFinal'
													tabIndex='12'
													checked={state.typeFinal}
													onChange={(evt) => onTypeChecked(evt)}
												/>
											}
											label={
												'Draft EIS ' + props.draftCount ? props.draftCount : ''
											}
										/>
									</Item>
									<Item>
										<FormLabel
											control={
												<Checkbox
													name='typeEA'
													id='typeEA'
													className='sidebar-checkbox'
													tabIndex='13'
													checked={state.typeEA}
													onChange={(evt) => onTypeChecked(evt)}
												/>
											}
											label={'EA ' + props.eaCount ? props.eaCount : ''}
										/>
									</Item>
									<Item>
										<FormLabel
											control={
												<Checkbox
													name='typeNOI'
													tabIndex='14'
													checked={state.typeNOI}
													onChange={(evt) => onTypeChecked(evt)}
												/>
											}
											label={`NOI ` + props.noiCount ? props.noiCount : ''}
										/>
									</Item>
									<Item>
										<FormLabel
											control={
												<Checkbox
													name='typeROD'
													//                      className="sidebar-checkbox"
													tabIndex='15'
													checked={state.typeROD}
													onChange={(evt) => onTypeChecked(evt)}
												/>
											}
											label={'ROD ' + props.rodCount ? props.rodCount : ''}
										/>
									</Item>
									{/* <div className="checkbox-container">
                            <label className="clickable checkbox-text">
                              <Checkbox
                                name="typeROD"
                                //className="sidebar-checkbox"
                                tabIndex="15"
                                checked={state.typeROD}
                                onChange={onTypeChecked}
                              />
                              <span className="checkbox-text">
                                ROD <i>{props.rodCount}</i>
                              </span>
                            </label>
                          </div> */}
									<Item>
										<FormLabel
											control={
												<Checkbox
													name='typeScoping'
													//className="sidebar-checkbox"
													tabIndex='16'
													checked={state.typeScoping}
													onChange={(evt) => onTypeChecked(evt)}
												/>
											}
											label={`Scoping Report   ` + props.typeScopingCount}
										/>
									</Item>
								</Box>
							</Item>

							<div className='filter' hidden={!Globals.curatorOrHigher()}>
								<Divider />

								<Typography variant='h6'>Advanced</Typography>
								<div className='sidebar-checkboxes'>
									<Checkbox
										type='checkbox'
										name='typeFinal'
										checked={props.useOptions}
										onChange={(evt) => onUseOptionsChecked(evt)}
									/>
									<label className='checkbox-text' htmlFor='typeFinal'>
										Apply filters to search query
									</label>
								</div>
							</div>
						</Item>
						<Item hidden={state.hideOrganization} id='agency-svg-holder'>
							<button onClick={(evt) => orgClick(evt)}>x</button>
						</Item>
					</Grid>
				</>
			</ThemeProvider>
		</>
	);
};
//export default withStyles(useStyles)(SideBarFilters);
export default SideBarFilters;
