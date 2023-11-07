import { Alert, Button, Box, Divider, Grid, Paper, Snackbar, Typography } from '@mui/material';
//import Grid from '@mui/material/Unstable_Grid2';
import { makeStyles } from '@mui/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import theme from '../styles/theme';
import PDFViewerDialog from './Dialogs/PDFViewerDialog';
import SearchContext from './SearchContext';
import RenderSnippets from './SearchResultSnippets.jsx';
import { styled } from '@mui/styles';
import DownloadFiles from '../DownloadFiles';
import DownloadFile from '../DownloadFile';
import { Link } from 'react-router-dom';
import { useStyles } from './PDFViewer/PDFViewerContainer';
const DataCell = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  border: 1,
  item: true,
  padding: 2,
  paddingTop: 15,
  paddingBottom: 15,
  spacing: 2,
  borderColor: 'black',
  display: 'flex',
  justifyContent: 'center',
  justifyItems: 'center',
  alignContent: 'center',
  alignItems: 'center',
}));
const styles = {
  centered: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    display: 'flex',
    borderRight: 1,
    borderColor: '#ddd'
  },
  cardGridItem: {
    fontSize: "1rem",
    fontWeight: 'bold',
  }
};

export default function SearchResultItem(props) {
  const { records } = props;
  const [isOpen, setIsOpen] = useState(false);
  //  const { seachState, setState, showContext } = useContext(SearchContext);
  const classes = useStyles(theme);
  const context = useContext(SearchContext);
  const { state, setState } = context;
  const _mounted = useRef(false);

  const [modalOpen, setModal] = useState(false)
  const [currentModalId, setCurrentModalId] = useState(0)

  const onCheckboxChange = (evt) => {
    setState({
      ...state,
      showContext: evt.target.checked,
    });
  };

  useEffect(() => {
    _mounted.current = true;
    return (() => {
      _mounted.current = false
    })
  }, [])

  let cnt = 0
  return (
    <>
      <div id="portal-root">
        {/* Used by modal manger to inject modal to DOM when opened  */}
      </div>
      <div id="modal-root">
        {/* Used by modal manger to inject modal to DOM when opened  */}
      </div>

      {records.map((record, idx) => (
        <div key={record.id} id={`render-record-root`} padding={3}>
          <RenderRecord record={record} isOpen={isOpen} />
        </div>
      ))}

    </>
  );
}

const RenderRecord = (props) => {
  const { record } = props;
  const [isOpen, setIsOpen] = useState(false);
  const {
    action,
    agency,
    commentDate,
    commentsFilename,
    cooperatingAgency,
    county,
    decision,
    documentType,
    filename,
    filenames,
    firstRodDate,
    luceneIds,
    id,
    link,
    name,
    notes,
    plaintext,
    state: resultState,
    status,
    subtype,
    title,
    processId,
  } = record;
  const year = commentDate && commentDate.length > 0 ? new Date(commentDate).getFullYear() : 'N/A';
  //const year = 2023;
  const classes = useStyles(theme);
  const [modalOpen, setModal] = useState(false);
  const [currentModalId, setCurrentModalId] = useState(0);

  const openModal = ((event, id) => {
    event.preventDefault()
    const { target: { dataset: { modal } } } = event
    setCurrentModalId(`modal-${id}`)
    setIsOpen(true)
    if (modal) setModal(modal)
  })


  const closeModal = (evt, id) => {
    setCurrentModalId(null)
    setIsOpen(false)
    setModal('')
  }
  const ModalManager = (props) => {
    const { record = {}, id = 0, modal = '', isOpen = false } = props
    return (
      <>
        {/* {isOpen && */}
        <PDFViewerDialog
          id={`pdf-dialog-${id}`}
          name={`modal-${record.id}`}
          record={record}
          //isOpen={isOpen[record.id]}
          isOpen={isOpen && currentModalId === `modal-${record.id}`}
          onDialogClose={(evt) => closeModal(evt, record.id)}
        />
        {/* {} */}
      </>
    )
  };
  return (
    <>
      <Paper elevation={0} style={{
        marginLeft: 2,
        marginRight: 2,
        marginTop: 10,
      }}>
        <Grid container>
          <DataCell>
            <Typography
              variant='h4'
              textOverflow={'ellipsis'}
              flexWrap={'wrap'}
              overflow={'hidden'}>
              <Link to={`/record-details?id=${id}`}>{title}</Link>
            </Typography>
          </DataCell>
          <Grid container id="search-result-row-container" borderTop={1} borderBottom={1} borderColor={'#ccc'}>
            <DataCell item id="year-box" xs={1} style={{ border: 'right 1px solid #ccc' }}>
              <Typography id="year-typography" variant='bold'>
                {year ? year : 'N/A'}
              </Typography>
            </DataCell>

            <DataCell item xs={2} borderLeft={1} borderColor={'#ccc'} id="status-document-type-grid-item">
              <Typography className={classes.card} style={styles.link}>
                {documentType}
              </Typography>
            </DataCell>
            {title &&
              (
                <DataCell item flex={1} id="title-grid-container" borderRight={1} borderLeft={1} borderColor={'#ccc'}>
                  <Typography id="snippets-title" textOverflow={'ellipsis'} variant='h5' >
                    {/* {(title.length > 200) ?  title.slice(0, `${300} ...`) : title} */}
                    {title}
                  </Typography>
                </DataCell>
              )}
            <Grid container marginLeft={1} marginRight={1} item xs={3} flex={1} id="button-grid-container">
              <DataCell item xs={6}>
                <DownloadFile
                  key={record.filename}
                  downloadType="folder"
                  id={record.id}
                  filename={record.filename}
                  disabled={!record.filename}
                  onSetNotification={props.onSetNotification}
                />
              </DataCell>

              <DataCell item xs={6}>
                <Button
                  fullWidth
                  onClick={(evt) => openModal(evt, record.id, record)}
                  variant='contained'
                  // //disabled={!record.filename}
                  color="primary">
                  Preview
                </Button>
              </DataCell>
            </Grid>
            {/* <Grid id="render-snippets-record-grid-container" container xs={12}>
            <RenderSnippets record={record} />
          </Grid>*/}
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}