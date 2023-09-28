import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography
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
                    autoComplete={true}
                    autoHighlight={true}
                    tabIndex={3}
                    className={"classes.autocomplete"}
                    options={agencyOptions}
                    disablePortal={true}
                    //value={state.agencyRaw}
                    //value={state.agency}
                    //groupBy={(option) => option.label}
                    variant="standard"
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
                    onChange={(evt,value)=>onAgencyChange(evt,value)}
                    //getOptionLabel={(agencyOptions) => agencyOptions.label}
                    renderInput={(params) => {
                      return(
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
                  <FormLabel htmlFor="searchAgency">
                    Cooperating Agencies:
                  </FormLabel>
                  <Autocomplete
                    id="searchAgency"
                    // className="multi"
                    // classNamePrefix="react-select"
                    isMulti
                    name="cooperatingAgency"
                    isSearchable
                    isClearable
                    //                styles={customStyles}
                    tabIndex="4"
                    options={agencyOptions}
                    onChange={(evt,value)=>onCooperatingAgencyChange(evt,value)}
                    //value={state.cooperatingAgencyRaw}
                    placeholder="Type or select cooperating agencies"
                    fullWidth
                    autoComplete={true}
                    // autoHighlight={true}
                    //className={classes.autocomplete}
                    disablePortal={true}
                    // value={searchState.agencyRaw}
                    variant="standard"
                    // menuIsOpen={true}
                    //getOptionLabel={(agencyOptions) => `??? ${agencyOptions.label}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        //value={state.agencyRaw}
                        variant="outlined"
                        sx={{
                          width: "100%",
                          p: 0,
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Item>
              <Divider />
              <Item>
                <FormLabel htmlFor="state-select">
                  State(s) or location(s):
                </FormLabel>
                <Autocomplete
                  id="state-select"
                  name="state"
                  fullWidth
                  autoComplete={true}
                  // autoHighlight={true}
                  //              styles={customStyles}
                  tabIndex="5"
                  options={stateOptions}
                  //className={classes.autocomplete}
                  disablePortal={true}
                  //                value={state.agencyRaw}
                  variant="standard"
                  // menuIsOpen={true}
                  onChange={(evt,value)=>onLocationChange(evt,value)}
                  placeholder={`Type or Select a State`}
                  //getOptionLabel={(stateOptions) => `${stateOptions.label}`}
                  // value={stateOptions.filter((stateObj) =>
                  //   state.state.includes(stateObj.value)
                  // )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        p: 0,
                      }}
                      placeholder={`Type or Select a State`}
                    />
                  )}
                />
              </Item>
              <Item>
                <FormLabel Label htmlFor="county-select">
                  County/counties:
                </FormLabel>
                <Autocomplete
                  id="county-select"
                  fullWidth
                  autoComplete={true}
                  // autoHighlight={true}
                  tabIndex={11}
                  //className={classes.autocomplete}
                  options={countyOptions}
                  disablePortal={true}
                  // value={searchState.agencyRaw}
                  variant="standard"
                  // menuIsOpen={true}
                  onChange={(evt,value)=>onCountyChange(evt,value)}
                  // getOptionLabel={(countyOptions) => `${countyOptions.label}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // value= {countyOptions.filter = (countyObj) => counties.includes(countyObj.value)}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        p: 0,
                      }}
                      placeholder={`Type or Select a County`}
                    />
                  )}
                />
              </Item>
              <div hidden={!Globals.authorized()}>
                <div
                  hidden={!Globals.curatorOrHigher()}
                ></div>
                <Divider />

                <div hidden={!Globals.authorized()}>
                  <Item>
                    <FormLabel htmlFor="searchAction">Action Type:</FormLabel>
                    <Autocomplete
                      id="searchAction"
                      className="multi"
                      classNamePrefix="react-select"
                      isMulti
                      name="action"
                      isSearchable
                      isClearable
                      //styles={customStyles}
                      tabIndex="7"
                      options={actionOptions}
                      onChange={(evt,value)=>onActionChange(evt,value)}
                      //value={state.actionRaw}
                      placeholder="Type or select action type(s)"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          value={state.agencyRaw}
                          variant="outlined"
                          sx={{
                            width: "100%",
                            p: 0,
                          }}
                          placeholder="Type or select action type(s)"
                        />
                      )}
                    />
                  </Item>
                </div>
              </div>
              <div hidden={!Globals.authorized()}>
                <Item>
                  <FormLabel htmlFor="searchDecision"></FormLabel>
                  <Typography variant="filterLabel">
                    Decision Type
                    {/* <span className="new">New</span> */}
                  </Typography>
                  <Autocomplete
                    id="searchDecision"
                    className="multi"
                    classNamePrefix="react-select"
                    isMulti
                    name="decision"
                    isSearchable
                    isClearable
                    //styles={customStyles}
                    tabIndex="8"
                    options={decisionOptions}
                    onChange={(evt,value)=>onDecisionChange(evt,value)}
                    //value={state.decisionRaw}
                    placeholder="Type or select decision type(s)"
                    // getOptionLabel={(stateOptions) => `${stateOptions.label}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        sx={{
                          width: "100%",
                          p: 0,
                        }}
                        placeholder={`Type or Select a decision type(s)`}
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
                    onStartDateChange={(evt)=>onStartDateChange(evt)}
                    onEndDateChange={(evt)=>onEndDateChange(evt)}
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
                          onChange={(evt)=>onTypeChecked(evt)}
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
                          onChange={(evt)=>onTypeChecked(evt)}
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
                          onChange={(evt)=>onTypeChecked(evt)}
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
                          onChange={(evt)=>onTypeChecked(evt)}
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
                          onChange={(evt)=>onTypeChecked(evt)}
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
                    onChange={(evt)=>onUseOptionsChecked(evt)}
                  />
                  <label className="checkbox-text" htmlFor="typeFinal">
                    Apply filters to search query
                  </label>
                </div>
              </div>
            </Item>
            <Item hidden={state.hideOrganization} id="agency-svg-holder">
              <button onClick={(evt)=>orgClick(evt)}>x</button>
            </Item>
          </Grid>
        </>
      </ThemeProvider>
    </>
  );
}
//export default withStyles(useStyles)(SideBarFilters);
export default SideBarFilters;