import React, { useEffect, useState } from 'react'
import { Paper, Snackbar, Alert } from '@mui/material';
import PropTypes  from 'prop-types';
export default function Notifications(props) {
  const {message="",messageType = "info",open=false} = props;
  console.log(`file: Notifications.jsx:6 ~ Notifications ~ props:`, props);
  return (
    <>
    {message &&
      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} transitionDuration={{enter: 100, exit: 500}} open={open} autoHideDuration={3000}>
        <Alert severity={'info'}>
          This is a Message{message}
        </Alert>
      </Snackbar>
      }
    </>
  )
}
Notifications.propTypes = {
  message: PropTypes.string.isRequired,
  messageType: PropTypes.oneOf(['error','success', 'warning', 'info']).isRequired,
}