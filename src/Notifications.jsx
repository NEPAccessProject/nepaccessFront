import react, { useState } from 'react'
import { Paper, Snackbar, Alert } from '@mui/material';
export default function Notifications(props) {
  const {message,messageType} = props;
  const [state, setState] = useState({
    open: false,
  })

  return (
    <>
      <Snackbar open={message} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity={messageType}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}
Notifications.propTypes = {
  message: PropTypes.string.isRequired,
  type: React.propTypes.oneOf(['error','success', 'warning', 'info']).isRequired,
}