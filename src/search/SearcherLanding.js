import React from 'react';
import axios from 'axios';
import { Autocomplete, Container } from '@mui/material';
import globals from '../globals';
import { SearchOutlined } from '@mui/icons-material';
import {
  Box,
  Grid,
  Hidden,
  IconButton,
  ListItem,
  TextField
} from '@mui/material';
import MediaQuery from 'react-responsive';

// import FlipNumbers from 'react-flip-numbers';

/** Search box with planned autocomplete suggestion that loads the main search page (app.js) with the search input
 *  or preloaded results when search is confirmed */
class SearcherLanding extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      titleRaw: '',
      num: 0
    };

    this.getTitles = this.getTitles.bind(this);
  }

  onInput = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
    const val = evt.target.value;
    this.props.onChange(this.props.id, val);
  }

  onKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      this.props.onClick("render", "app");
    }
  }
  onIconClick = (evt) => {
    console.log(`onIconClick:`, evt)
    this.props.onClick("render", "app");
  }
  onClearClick = (evt) => {
    // Custom clear icon not captured by onInput(), so update the relevant props and state here
    //console.log(`onClearClick Event Handler ${evt.target.name} - value : ${evt.target.value}`)
    this.setState({ titleRaw: '' });
    this.props.onChange(this.props.id, '');
  }
  onChangeHandler = (evt) => {
    //console.log(`onChange Event Handler ${evt.target.name} - value : ${evt.target.value}`)
    // do nothing
  }

  // TODO: Get shortlist of title suggestions ordered by relevance from backend using NLM, alphanumeric only, maybe use
  // autocomplete library to fill selectables
  getTitles() {
    let titlesUrl = new URL('test/titles', globals.currentHost);
    //Send the AJAX call to the server
    axios({
      method: 'POST',
      url: titlesUrl,
      data: ''
    }).then(response => {
      let responseOK = response && response.status === 200;
      if (responseOK) {
        return response.data;
      } else {
        return null;
      }
    }).then(parsedJson => {
      console.log('this should be json', parsedJson);
      if (parsedJson) {
        this.setState({
          titles: parsedJson,
        });
      }
    }).catch(error => { // If verification failed, it'll be a 403 error (includes expired tokens) or server down
      // Don't necessarily need to do anything, autocomplete won't work and user probably needs to login anyway
    });
  }



  get = (url, stateName) => {
    const _url = new URL(url, globals.currentHost);
    axios({
      url: _url,
      method: 'GET',
      data: {}
    }).then(_response => {
      const rsp = _response.data;
      this.setState({ [stateName]: rsp });
    }).catch(error => {
    })
  }


  render() {
    return (
      <Box style={{
        alignContent: 'center',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        // marginLeft: '5%',
        // marginRight: '5%',
      }}>
        <TextField
          fullWidth
          zIndex={9999}
          id="main-search-text-field"
          //id="landing-search-bar"
          name="titleRaw"
          variant="outlined"
          color='primary'
          //focused
          //onInput={this.onInput}
          onKeyUp={this.onKeyUp}
          onChange={this.props.onChangeHandler}
          onKeyDown={this.onKeyDown}
          onInput={this.onInput}
          placeholder="Search for NEPA documents"
          value={this.state.titleRaw}
          sx={{
            marginLeft:2,
            marginRight:2,
            borderRadius: 1,
            border:0,
            backgroundColor: '#fff',
            zIndex: 9999,
          }}
          InputProps={{
            endAdornment: (
              <IconButton name="titleRaw" value={this.state.titleRaw} onClick={this.onIconClick} {...this.props}>
                <SearchOutlined />
              </IconButton>
            ),
          }}
        />
        {/* </Box> */}
      </Box>
    )
  }

  _render() {
    return (
      <div id="landing-search-box-container" style={{
        border: '2px solid red',
      }}>
        <div id="landing-search-holder" className={this.getClassName()}>
          <div id="landing-search-bar-holder">
            <input id="landing-search-bar"
              name="titleRaw"
              placeholder="Search for NEPA documents"
              value={this.state.titleRaw}
              autoFocus
              onChange={this.onChangeHandler}
              onInput={this.onInput} onKeyUp={this.onKeyUp}
            />
            <svg id="landing-search-icon" onClick={this.onIconClick} className="search-icon" width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M26.4582 24.1397H28.2356L37.7751 33.3063C38.6976 34.1886 38.6976 35.6303 37.7751 36.5125C36.8526 37.3947 35.3452 37.3947 34.4228 36.5125L24.8607 27.3674V25.6675L24.2533 25.065C21.1034 27.6471 16.8061 28.9813 12.2388 28.2496C5.98416 27.2383 0.989399 22.2462 0.224437 16.2212C-0.945506 7.11911 7.0641 -0.541243 16.5811 0.577685C22.8808 1.30929 28.1006 6.08626 29.158 12.0682C29.923 16.4363 28.5281 20.5463 25.8282 23.5588L26.4582 24.1397ZM4.61171 14.4567C4.61171 19.8146 9.13399 24.1397 14.7362 24.1397C20.3384 24.1397 24.8607 19.8146 24.8607 14.4567C24.8607 9.09875 20.3384 4.77366 14.7362 4.77366C9.13399 4.77366 4.61171 9.09875 4.61171 14.4567Z" fill="black" fillOpacity="1" />
            </svg>
            <svg onClick={this.onClearClick} className="cancel-icon" width="24" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="circle" d="M12.2689 1.92334C5.63289 1.92334 0.26889 7.28734 0.26889 13.9233C0.26889 20.5593 5.63289 25.9233 12.2689 25.9233C18.9049 25.9233 24.2689 20.5593 24.2689 13.9233C24.2689 7.28734 18.9049 1.92334 12.2689 1.92334Z" fill="#DADADA"
              />
              <path d="M17.4289 19.0834C16.9609 19.5514 16.2049 19.5514 15.7369 19.0834L12.2689 15.6154L8.80089 19.0834C8.33289 19.5514 7.57689 19.5514 7.10889 19.0834C6.88418 18.8592 6.7579 18.5548 6.7579 18.2374C6.7579 17.9199 6.88418 17.6155 7.10889 17.3914L10.5769 13.9234L7.10889 10.4554C6.88418 10.2312 6.7579 9.92677 6.7579 9.60935C6.7579 9.29193 6.88418 8.98755 7.10889 8.76335C7.57689 8.29535 8.33289 8.29535 8.80089 8.76335L12.2689 12.2314L15.7369 8.76335C16.2049 8.29535 16.9609 8.29535 17.4289 8.76335C17.8969 9.23135 17.8969 9.98735 17.4289 10.4554L13.9609 13.9234L17.4289 17.3914C17.8849 17.8474 17.8849 18.6154 17.4289 19.0834Z" fill="#737272" />
            </svg>

          </div>

        </div>
      </div>
    )
  }
}

export default SearcherLanding;