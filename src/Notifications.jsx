import React, { useEffect, useState } from 'react'
import { Paper, Snackbar, Alert } from '@mui/material';
import PropTypes  from 'prop-types';
export default function Notifications(props) {
  console.info(`file: Notifications.jsx:5 ~ Notifications ~ props:`, props);
  const {message="",messageType = "info",open=false} = props;
  return (
    <>
    {open &&
      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} transitionDuration={{enter: 100, exit: 500}} open={open} autoHideDuration={3000}>
        <Alert severity={messageType}>
          {message}
        </Alert>
      </Snackbar>
      }
    </>
  )
}
Notifications.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error','success', 'warning', 'info']).isRequired,
}