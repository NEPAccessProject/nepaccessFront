import React,{useContext} from 'react';
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchContext from './SearchContext';

const onKeyDown = (e) => {
  if (e.key === "Tab") {
    if (this.datePickerStart) {
      this.datePickerStart.setOpen(false);
    }
    if (this.datePickerEnd) {
      this.datePickerEnd.setOpen(false);
    }
  }
};

const onKeyUp = (evt) => {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    this.doSearch(this.state.titleRaw);
  }
};

export default function SearchDatePickers(props){
    const {startDate, endDate,onEndDateChange,onStartDateChange} = props;
    const {state, setState} = useContext(SearchContext);
    return(
        <>
        
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box item marginBottom={2} components={['DatePicker']}
             padding={0} 
             width="100%">
              <DatePicker
//               ref={(ref) => (state.datePickerStart = ref)}
                  selected={state.startPublish}
                  onChange={onStartDateChange}
                  onKeyDown={onKeyDown}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  className="sidebar-date"
                  showMonthDropdown={true}
                  showYearDropdown={true}
                  adjustDateOnChange
                  tabIndex="9"
                  popperPlacement="right"
                  isClearable
              />
            </Box>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box components={['DatePicker']} padding={0} width="100%">
              <DatePicker
                //ref={(ref) => (this.datePickerEnd = ref)}
                  selected={state.endPublish}
                  onChange={onEndDateChange}
                  onKeyDown={onKeyDown}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  className="sidebar-date"
                  showMonthDropdown={true}
                  showYearDropdown={true}
                  adjustDateOnChange
                  tabIndex="10"
                  popperPlacement="right"
                  isClearable
              />
            </Box>
          </LocalizationProvider>
        </>
    )
}