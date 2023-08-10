import React, { useContext } from "react";
import SearchContext from "./SearchContext";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "../styles/theme";
//import Grid from '@mui/material/Grid'; // Grid version 1
import { makeStyles } from "@mui/styles";
import SearchDatePickers from "./SearchDatePickers";
import Globals from "../globals";
import {
  agencyOptions,
  proximityOptions,
  actionOptions,
  decisionOptions,
} from "./options";
const stateOptions = Globals.locations;
const countyOptions = Globals.counties;

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0,
  border: 0,
  borderRadius: 0,
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
export default function SideBarFilters(props) {
//  console.log("🚀 ~ file: SideBarFilters.jsx:51 ~ SideBarFilters ~ props:", props)
  const { state, setState } = useContext(SearchContext);
  const { 
    filtersHidden,
    onCountyChange,
    onAgencyChange,
    onProximityChange,
    onActionChange,
    onDecisionChange,
    onDateChange,
    onLocationChange,
    onTypeChecked,
    onCooperatingAgencyChange,
    onStartDateChange,
    onEndDateChange,
    onUseOptionsChecked,
    orgClick,
    renderClearFiltersButton,
    toggleFiltersHidden,
    onNeedsDocumentChecked } = props;
  

    
  return (
    <>
      <h2>Search Filter Component</h2>
      <Box borderColor={"red"} border={2}>
        {/* <Item
          border={1}
          className="sidebar-filters"
          hidden={!state.filtersHidden}
        >
          <span className="sidebar-header">
            Narrow your results
            <span
              className="filters-toggle"
              onClick={() => toggleFiltersHidden()}
            >
              +
            </span>
            {renderClearFiltersButton()}
          </span>
        </Item> */}
        <Item
          //className="sidebar-filters"
          hidden={state.filtersHidden}
          // this would launch a new search on enter key, in some child inputs
          // onKeyUp={onKeyUp}
        >
          <b>Start Filters</b>
          <span>
            Narrow your results
            <span
              //className="filters-toggle"
              onClick={() => toggleFiltersHidden()}
            >
              -
            </span>
          </span>

          <Divider />

          <Item alignItems={"center"}>
            <FormControlLabel
              control={
                <Checkbox
                  name="needsDocument"
                  id="needsDocument"
                  tabIndex="2"
                  checked={state.needsDocument}
                  onChange={onNeedsDocumentChecked}
                />
              }
              label="Search Only Within Titles"
            />
            {renderClearFiltersButton()}
          </Item>

          <Divider />
          <Item>
            {/* #region Lead Agencies Filter */}
            <FormControl
              fullWidth
              xs={{
                p: 1,
                border: 0,
                borderColor: "grey.500",
                borderRadius: 1,
                mb: 1,
                mt: 1,
              }}
            >
              <Typography pb={1} variant="filterLabel">
                Lead Agencies:
              </Typography>
              <Autocomplete
                id="searchAgency"
                name="agency"
                fullWidth
                autoComplete={true}
                // autoHighlight={true}
                tabIndex={11}
                className={"classes.autocomplete"}
                options={agencyOptions}
                disablePortal={true}
                // value={searchState.agencyRaw}
                variant="standard"
                // menuIsOpen={true}
                onChange={onAgencyChange}
                getOptionLabel={(agencyOptions) => 'agencyOptions.label'}
                renderInput={(params) => (
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
                )}
              />
            </FormControl>
            {/* #endregion */}
          </Item>
          <Item>
            <FormControl
              fullWidth
              xs={{
                p: 1,
                border: 0,
                borderColor: "grey.500",
                borderRadius: 1,
                mb: 1,
                mt: 1,
              }}
            >
              <Typography pb={1} variant="filterLabel">
                Cooperating Agencies:
              </Typography>
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
                onChange={onCooperatingAgencyChange}
                value={state.cooperatingAgencyRaw}
                placeholder="Type or select agencies"
                fullWidth
                autoComplete={true}
                // autoHighlight={true}
                //className={classes.autocomplete}
                disablePortal={true}
                // value={searchState.agencyRaw}
                variant="standard"
                // menuIsOpen={true}

                getOptionLabel={(agencyOptions) => 'agencyOptions.label'}
                renderInput={(params) => (
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
                )}
              />
            </FormControl>
          </Item>
                  <Divider />
          <Item>
            <Typography pb={1} variant="filterLabel">
              State(s) or location(s):
            </Typography>
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
              onChange={onLocationChange}
              placeholder={`Type or Select a State`}
              //getOptionLabel={(stateOptions) => `${stateOptions.label}`}
              value={stateOptions.filter((stateObj) =>
                state.state.includes(stateObj.value)
              )}
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
            <Typography pb={1} variant="filterLabel">
              County/counties
            </Typography>
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
              onChange={onCountyChange}
              getOptionLabel={(countyOptions) => `${countyOptions.label}`}
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
              className="dropdown-group-end"
              hidden={!Globals.curatorOrHigher()}
            ></div>

            <div hidden={!Globals.authorized()}>
              <Item>
                <Typography variant="filterLabel">Action Type</Typography>
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
                  onChange={onActionChange}
                  value={state.actionRaw}
                  placeholder="Type or select action type"
                  renderInput={(params) => (
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
                  )}
                />
              </Item>
            </div>
          </div>
          <div hidden={!Globals.authorized()}>
            <Item>
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
                onChange={onDecisionChange}
                value={state.decisionRaw}
                placeholder="Type or select decision"
                getOptionLabel={(stateOptions) => `${stateOptions.label}`}
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
          </div>

          <Divider />
          <Item>
            <Box
              display={"flex"}
              xs={12}
              flexDirection={"column"}
              border={0}
              padding={0}
              margin={0}
              width={"100%"}
              alignContent={"center"}
              justifyItems={"center"}
            >
              <SearchDatePickers
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
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
                <Typography var="filterLabel">Document Type</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="typeFinal"
                      id="typeFinal"
                      tabIndex="12"
                      checked={state.typeFinal}
                      onChange={onTypeChecked}
                    />
                  }
                  label={"Draft EIS " + props.draftCount}
                />
              </Item>
              <Item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="typeEA"
                      id="typeEA"
                      className="sidebar-checkbox"
                      tabIndex="13"
                      checked={state.typeEA}
                      onChange={onTypeChecked}
                    />
                  }
                  label={"EA " + props.eaCount}
                />
              </Item>
              <Item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="typeNOI"
                      tabIndex="14"
                      checked={state.typeNOI}
                      onChange={onTypeChecked}
                    />
                  }
                  label={`NOI ` + props.noiCount}
                />
              </Item>
              <Item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="typeROD"
                      //                      className="sidebar-checkbox"
                      tabIndex="15"
                      checked={state.typeROD}
                      onChange={onTypeChecked}
                    />
                  }
                  label={"ROD " + props.rodCount}
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
                <FormControlLabel
                  control={
                    <Checkbox
                      name="typeScoping"
                      //className="sidebar-checkbox"
                      tabIndex="16"
                      checked={state.typeScoping}
                      onChange={onTypeChecked}
                    />
                  }
                  label={`Scoping Report   ` + props.typeScopingCount}
                />
              </Item>
            </Box>
          </Item>

          <div className="filter" hidden={!Globals.curatorOrHigher()}>
            <Divider />

            <label className="sidebar-label-date">Advanced</label>
            <div className="sidebar-checkboxes">
              <Checkbox
                type="checkbox"
                name="typeFinal"
                //                  className="sidebar-checkbox"
                checked={props.useOptions}
                onChange={onUseOptionsChecked}
              />
              <label className="checkbox-text" htmlFor="typeFinal">
                Apply filters to search query
              </label>
            </div>
          </div>
        </Item>
        <Item hidden={state.hideOrganization} id="agency-svg-holder">
          <button onClick={orgClick}>x</button>
        </Item>
      </Box>
    </>
  );
}
