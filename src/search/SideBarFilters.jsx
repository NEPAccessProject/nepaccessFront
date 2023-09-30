import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Stack,
  Chip
} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from "@mui/styles";
import React, { useContext } from "react";
//import { ThemeProvider, createUseStyles } from "react-jss";
import SearchContext from "./SearchContext";
//import Grid from '@mui/material/Grid'; // Grid version 1
import { ThemeProvider } from "@material-ui/core";
import Globals from "../globals";
import theme from "../styles/theme";
import SearchDatePickers from "./SearchDatePickers";
import {
  actionOptions,
  agencyOptions,
  decisionOptions,
  countyOptions,
} from "./options";
const stateOptions = Globals.locations;

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0,
  mt: 2,
  mb: 2,
  pl: 0,
  pr: 0,
  "&:hover": {
    //           backgroundColor: //theme.palette.grey[200],
    boxShadow: "0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)",
    cursor: "pointer",
    "& .addIcon": {
      color: "purple",
    },
  },
}));


const SideBarFilters = (props) => {
  const { state, setState } = useContext(SearchContext);
  console.log(`🚀 ~ file: SideBarFilters.jsx:53 ~ SideBarFilters ~ CONTEXT state:`, state);
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
  } = props;

  console.log('COUNTY!',state.county)
  console.log('STATE!',state.state)
  console.log('AGENCY!',state.agency)
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
              <Box sx={{
                textAlign: "center",
                alignItems: "center",
                fontWeight: "bold"
              }}>
                Narrow your results
                <span
                  //className="filters-toggle"
                  onClick={() => toggleFiltersHidden()}
                >
                </span>
              </Box>

              <Item alignItems={"center"}>

                {/* <FormLabel>
                  <Typography className={classes.FormLabel} variant="filterLabel"> Search Only Within titles</Typography>
                </FormLabel> */}
                <FormLabel
                  control={
                    <Checkbox
                      tabIndex="3"
                      checked={state.searchOption === "C"}
                      onChange={onTitleOnlyChecked}
                    />
                  }
                  label="Search Only Within titles"
                />
                {renderClearFiltersButton()}
              </Item>

              <Divider />
              <Item>
                {/* #region Lead Agencies Filter */}
                {JSON.stringify(state.agency)}
                <FormControl
                  fullWidth
                >
                  <FormLabel htmlFor="searchAgency">
                    Lead Agencies:
                  </FormLabel>
                  <Autocomplete
                    id="searchAgency"
                    name="agency"
                    fullWidth
                    multiple
                    autoComplete={true}
                    autoHighlight={true}
                    tabIndex={3}
                    className={"classes.autocomplete"}
                    options={agencyOptions}
                    disablePortal={true}
                    value={agencyOptions.filter((v) => state.agency.includes(v.label))}
                    //value={state.agency}
                    //groupBy={(option) => option.label}
                    variant="standard"
                    // renderTags={(value, getTagProps) =>
                    //   (value.map((option, index) => {
                    //     return(
                    //     <Box key={option.value}>
                    //       <Chip variant="outlined" 
                    //         label={option} 
                    //         {...getTagProps({ index })} />
                    //       </Box>
                    //       )
                    //   }))}
                    // filterOptions={(options, state) => {
                    //   console.log(`🚀 ~ file: SideBarFilters.jsx:144 ~ SideBarFilters ~ options, state:`, options, state);

                    //   const displayOptions = options.filter((option) =>
                    //     option.label
                    //       .toLowerCase()
                    //       .trim()
                    //       .includes((state.value ? state.value.toLowerCase().trim() : '')
                    //   ));
                    //   console.log(`🚀 ~ file: SideBarFilters.jsx:152 ~ SideBarFilters ~ displayOptions:`, displayOptions);


                    //   return displayOptions;
                    // }}
                    // menuIsOpen={true}
                    onChange={(evt, value) => onAgencyChange(evt, value)}
                    //getOptionLabel={(agencyOptions) => agencyOptions.label}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          value={state.agencyRaw}
                          variant="outlined"
                          sx={{
                            width: "100%",
                            p: 0,
                          }}
                          placeholder="Type or Select Lead Agencies"
                        />
                      )
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
                  }}
                >
                  {JSON.stringify(state.cooperatingAgency)}
                  <FormLabel htmlFor="searchAgency">
                    Cooperating Agencies:
                  </FormLabel>
                  <Autocomplete
                    id="cooperatingAgency"
                    name="cooperatingAgency"
                    fullWidth
                    multiple
                    autoComplete={true}
                    autoHighlight={true}
                    tabIndex={4}
                    className={"classes.autocomplete"}
                    options={agencyOptions}
                    disablePortal={true}
                    value={agencyOptions.filter((v) => state.cooperatingAgency.includes(v.label))}
                    variant="standard"
                    onChange={(evt, value) => onCooperatingAgencyChange(evt, value)}
                    //getOptionLabel={(agencyOptions) => agencyOptions.label}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          value={state.agencyRaw}
                          variant="outlined"
                          sx={{
                            width: "100%",
                            p: 0,
                          }}
                          placeholder="Type or Select Cooperating Agencies"
                        />
                      )
                    }}
                  />

                </FormControl>
              </Item>
              <Divider />
              <Item>
                    {JSON.stringify(state.state)}
                <FormLabel htmlFor="state">
                  State(s) and Location(s):
                </FormLabel>
                <Autocomplete
                  id="state"
                  name="state"
                  fullWidth
                  multiple
                  autoComplete={true}
                  autoHighlight={true}
                  tabIndex={4}
                  className={"classes.autocomplete"}
                  options={stateOptions}
                  disablePortal={true}
                  // value={stateOptions.filter((v) => state.state.includes(v.label))}
                  variant="standard"
                  onChange={(evt, value) => onLocationChange(evt, value)}
                  //getOptionLabel={(agencyOptions) => agencyOptions.label}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        value={state.agencyRaw}
                        variant="outlined"
                        sx={{
                          width: "100%",
                          p: 0,
                        }}
                        placeholder="Type or Select a State"
                      />
                    )
                  }}
                />
              </Item>
              <Item>
                <FormLabel Label htmlFor="county-select">
                  County/counties:
                </FormLabel>
                {JSON.stringify(state.state)}
                <Autocomplete
                  id="county"
                  name="county"
                  fullWidth
                  multiple
                  autoComplete={true}
                  autoHighlight={true}
                  tabIndex={5}
                  className={"classes.autocomplete"}
                  options={countyOptions}
                  disablePortal={true}
                  value={countyOptions.filter((v) => state.county.includes(v.label))}
                  variant="standard"
                  onChange={(evt, value) => onCountyChange(evt, value)}
                  //getOptionLabel={(agencyOptions) => agencyOptions.label}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        variant="outlined"
                        sx={{
                          width: "100%",
                          p: 0,
                        }}
                        placeholder="Type or Select a County"
                      />
                    )
                  }}
                />
              </Item>
              <div hidden={!Globals.authorized()}>
                <div
                  hidden={!Globals.curatorOrHigher()}
                ></div>
                <Divider />

                <div hidden={!Globals.authorized()}>
                  <Item>
                    {JSON.stringify(state.action)}
                    <FormLabel htmlFor="searchAction">Action Type:</FormLabel>
                                        <Autocomplete
                  id="searchAction"
                  name="searchAction"
                  fullWidth
                  multiple
                  autoComplete={true}
                  autoHighlight={true}
                  tabIndex={7}
                  className={"classes.autocomplete"}
                  options={actionOptions}
                  disablePortal={true}
                  value={actionOptions.filter((v) => state.action.includes(v.label))}
                  variant="standard"
                  onChange={(evt, value) => onActionChange(evt, value)}
                  //getOptionLabel={(agencyOptions) => agencyOptions.label}
                  placeholder="Type or Select a Action Type(s)"
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        variant="outlined"
                        sx={{
                          width: "100%",
                          p: 0,
                        }}
                       
                      />
                    )
                  }}
                />
                  </Item>
                </div>
              </div>
              <div hidden={!Globals.authorized()}>
                <Item>
                  {JSON.stringify(state.decision)}
                  <FormLabel htmlFor="searchDecision"></FormLabel>
                  <Typography variant="filterLabel">
                    Decision Type
                    {/* <span className="new">New</span> */}
                  </Typography>
                  <Autocomplete
                    id="searchDecision"
                    className="multi"
                    classNamePrefix="react-select"
                    multiple
                    name="decision"
                    isSearchable
                    isClearable
                    //styles={customStyles}
                    tabIndex="8"
                    options={decisionOptions}
                    onChange={(evt, value) => onDecisionChange(evt, value)}
                    //value={state.decisionRaw}
                    placeholder="Type or select decision type(s)"
                    // getOptionLabel={(stateOptions) => `${stateOptions.label}`}
                    value={decisionOptions.filter((v) => state.decision.includes(v.label))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        sx={{
                          width: "100%",
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
                  display={"flex"}
                  xs={12}
                  flexDirection={"column"}
                  padding={0}
                  margin={0}
                  width={"100%"}
                  alignContent={"center"}
                  justifyItems={"center"}
                >
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
                <Box
                >
                  <Item>
                    <FormLabel
                      control={
                        <Checkbox
                          name="typeFinal"
                          id="typeFinal"
                          tabIndex="12"
                          checked={state.typeFinal}
                          onChange={(evt) => onTypeChecked(evt)}
                        />
                      }
                      label={"Draft EIS " + (props.draftCount) ? props.draftCount : ''}
                    />
                  </Item>
                  <Item>
                    <FormLabel
                      control={
                        <Checkbox
                          name="typeEA"
                          id="typeEA"
                          className="sidebar-checkbox"
                          tabIndex="13"
                          checked={state.typeEA}
                          onChange={(evt) => onTypeChecked(evt)}
                        />
                      }
                      label={"EA " + (props.eaCount) ? props.eaCount : ''}
                    />
                  </Item>
                  <Item>
                    <FormLabel
                      control={
                        <Checkbox
                          name="typeNOI"
                          tabIndex="14"
                          checked={state.typeNOI}
                          onChange={(evt) => onTypeChecked(evt)}
                        />
                      }
                      label={`NOI ` + (props.noiCount) ? props.noiCount : ''}
                    />
                  </Item>
                  <Item>
                    <FormLabel
                      control={
                        <Checkbox
                          name="typeROD"
                          //                      className="sidebar-checkbox"
                          tabIndex="15"
                          checked={state.typeROD}
                          onChange={(evt) => onTypeChecked(evt)}
                        />
                      }
                      label={"ROD " + (props.rodCount) ? props.rodCount : ''}
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
                          name="typeScoping"
                          //className="sidebar-checkbox"
                          tabIndex="16"
                          checked={state.typeScoping}
                          onChange={(evt) => onTypeChecked(evt)}
                        />
                      }
                      label={`Scoping Report   ` + props.typeScopingCount}
                    />
                  </Item>
                </Box>
              </Item>

              <div className="filter" hidden={!Globals.curatorOrHigher()}>
                <Divider />

                <Typography variant="h6">Advanced</Typography>
                <div className="sidebar-checkboxes">
                  <Checkbox
                    type="checkbox"
                    name="typeFinal"
                    checked={props.useOptions}
                    onChange={(evt) => onUseOptionsChecked(evt)}
                  />
                  <label className="checkbox-text" htmlFor="typeFinal">
                    Apply filters to search query
                  </label>
                </div>
              </div>
            </Item>
            <Item hidden={state.hideOrganization} id="agency-svg-holder">
              <button onClick={(evt) => orgClick(evt)}>x</button>
            </Item>
          </Grid>
        </>
      </ThemeProvider>
    </>
  );
}
//export default withStyles(useStyles)(SideBarFilters);
export default SideBarFilters;