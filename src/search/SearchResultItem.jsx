import { Button, Box, Divider,Grid, Paper, Typography } from '@mui/material';
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
const DataCell = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  border: 1,
  item: true,
  borderColor: 'black',
  display: 'flex',
  justifyContent: 'center',
  justifyItems: 'center',
  alignContent: 'center',
  alignItems: 'center',
  '&:hover': {
    //           backgroundColor: //theme.palette.grey[200],
    boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
    cursor: 'pointer',
    '& .addIcon': {
      color: 'purple',
    },
  },
}));
const useStyles = makeStyles((theme) => ({
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
}));

export default function SearchResultItem(props) {
  const { records } = props;
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  //  const { seachState, setState, showContext } = useContext(SearchContext);
  const classes = useStyles(theme);
  const context = useContext(SearchContext);
  const { state, setState } = context;
  const [isOpen, setIsOpen] = useState(false);
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


  function onPDFPreviewToggle(evt, fileId, record) {
    console.log('PDF VIEW Toggle,evt', evt);
    evt.preventDefault();
    setIsPDFViewOpen(true)
  }

  function showPDFPreview(evt, fileId, record) {
    console.log('PDF VIEW Toggle,evt', evt);
    evt.preventDefault();
    setIsPDFViewOpen(true)
  }
  function onDocumentLoadSuccess({ numPages }) {
    setState({ ...state, numPages: numPages });
  }

  //[TODO] Add download functionality
  const handleDownloadClick = (evt, id) => {
    evt.preventDefault();
    console.log('Download ID Value and filename', id, filename);
  };
  const openModal = ((event, id) => {
    event.preventDefault()
    const { target: { dataset: { modal } } } = event
    setCurrentModalId(`modal-${id}`)
    setIsOpen(true)
    if (modal) setModal(modal)
  })


  const onDialogClose = (evt, id) => {
    setCurrentModalId(null)
    setIsOpen(false)
    setModal('')
  }
  //  const text = record.plaintext || '';
  return (
    <>
      <div id="portal-root">

      </div>
      <div id="modal-root">

      </div>

      {records.map((record, idx) => (
        <div key={record.id} id={`render-record-root`} padding={3}>
          <RenderRecord record={record} />
        </div>
      ))}

    </>
  );
}

const RenderRecord = (props) => {
  console.log(`file: SearchResultItem.jsx:154 ~ RenderRecord ~ props:`, props);
  const { record } = props;
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
  //  const year = commentDate && commentDate.length > 0 ? new Date(commentDate).getFullYear() : 'N/A';
  const year = 2023;
  const classes = useStyles(theme);
  return (

    <Paper elevation={1} style={{
    }}>
      {/* <DownloadFile
          key={record.filename}
          downloadType="nepafile"
          id={_id}
          filename={record.filename}
        /> */}
    <Grid container xs={12}>
        <Grid container id="search-result-row-container" xs={12} borderTop={1} borderBottom={1} borderColor={'#ccc'}>
          <DataCell id="year-box" xs={1} style={{border: 'right 1px solid #ccc'}}>
            <Typography id="year-typography" fontWeight={'bold'}>
              {year ? year : 'N/A'}
            </Typography>
          </DataCell>

          <DataCell xs={3} borderLeft={1} borderColor={'#ccc'} id="status-document-type-grid-item">
            <Typography className={classes.card}>
              {documentType}
            </Typography>
          </DataCell>
          <DataCell container xs={5} flex={1} id="title-grid-container" borderRight={1} borderLeft={1} borderColor={'#ccc'}>
            <Typography id="snippets-title" variant='h5' >{(title) ? title : ''}</Typography>
          </DataCell>
          <Grid container xs={2} flex={1} id="button-grid-container">
            <DataCell item id="preview-button-grid-item" item display={'flex'} xs={12} >
              <Button onClick={(evt) => handleDownloadClick(evt)} variant='contained' color="primary">
                Download
              </Button>
            </DataCell>
          </Grid>
        </Grid>
        <Grid id="render-snippets-record-grid-container" container xs={12}>
              <RenderSnippets record={record} />

        </Grid>
    </Grid>

    </Paper>
  )
}