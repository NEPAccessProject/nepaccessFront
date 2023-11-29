import { Alert, Button, Box, Divider, Paper, Snackbar, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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
const DataCell = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  border: 1,
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
  const [modalOpen,setModal] = useState(false);
	const [currentModalId,setCurrentModalId] = useState(0)
  function onPDFPreviewToggle(evt, fileId, record) {
		console.log('PDF VIEW Toggle,evt', evt);
		evt.preventDefault();
		setIsOpen(true)
	}

	function showPDFPreview(evt, fileId, record) {
		console.log('PDF VIEW Toggle,evt', evt);
		evt.preventDefault();
		setIsOpen(true)
	}
	function onDocumentLoadSuccess({ numPages }) {
		setState({ ...state, numPages: numPages });
	}
	const handleDownloadClick = (evt, id) => {
		evt.preventDefault();
		console.log('Download ID Value and filename', id, filename);
	};

	const onDetailLink = (evt, processId) => {
		console.log("🚀 ~ file: SearchResultsItems.jsx:193 ~ onDetailLink ~ evt,processId:", evt, processId)
	}


	const openModal = ((event,id) => {
		event.preventDefault()
		const { target: { dataset: { modal } } } = event
		setCurrentModalId(`modal-${id}`)
		setIsOpen(true)
		if (modal) setModal(modal)
	})

  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 990;
  const isDesktop = window.innerWidth > 990;


	const closeModal = (evt,id) => {
    setCurrentModalId(null)
    setIsOpen(false)
		setModal('')
	}
	const ModalManager = (props) => {
    const {record={},id=0,modal='',isOpen=false} = props
    return (
  <>
  { isOpen &&
  <PDFViewerDialog
			id={`pdf-dialog-${id}`}
			name={`modal-${record.id}`}
			record={record}
			//isOpen={isOpen[record.id]}
			isOpen={isOpen && currentModalId === `modal-${record.id}`}
			onDialogClose={(evt) => closeModal(evt, record.id)}
			/>
  }
	</>
  )};

  const Item = styled(Grid)(({ theme }) => ({
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
      padding:1,
      flexGrow:1,
      // padding: 2,
      // paddingTop: 10,
      // paddingBottom: 10,
  }));
  return (
    <>
      <Paper elevation={0} sx={{flexGrow:1}}  style={{
        marginLeft: 2,
        marginRight: 2,
        marginTop: 10,
        marginBottom: 5,
      }}>

          <Grid flexGrow={1} container id="search-result-row-container">
            <Item border={0} borderColor={'#ddd'} padding={3}  xs={12}>
            <Typography variant='h4'>
              <Link to={`/record-details?id=${id}`}>{title}</Link>
            </Typography>
            </Item>
            <Item padding={3} id="year-box" xs={6} md={1} style={{ border: 'right 1px solid #ccc' }}>
              <Typography id="year-typography" fontWeight={'bold'}>
                {year ? year : 'N/A'}
              </Typography>
            </Item>

            <Item padding={3}  md={3} xs={6} borderLeft={1} borderColor={'#ccc'} id="status-document-type-grid-item">
              <Typography className={classes.card}>
                {documentType}
              </Typography>
            </Item>
            <Item padding={3} xs={12} md={5} flex={1} id="title-grid-container" borderRight={1} borderLeft={1} borderColor={'#ccc'}>
              <Typography id="snippets-title" variant='h5' >{(title) ? title : ''}</Typography>
            </Item>
            <Grid container xs={12} md={3} flexGrow={1} id="button-grid-container">
              <Item padding={3} id="download-button-grid-item" item display={'flex'} xs={6}>
                <Button onClick={(evt) => handleDownloadClick(evt)}
                  variant='contained'
                  color="primary">
                  Download
                </Button>
                <DownloadFile
                  key={record.filename}
                  downloadType="nepafile"
                  id={record.id}
                  filename={record.filename}
                  disabled={!record.filename}
                />

              </Item>
              <Item style={{ borderRight: 'right 1px solid #ccc' }} padding={3} id="preview-button-grid-item" xs={6} md={6}>
                <ModalManager
                  record={record}
                  id={record.id}
                  isOpen={isOpen}
                  closeFn={closeModal}
                  modal={modalOpen} />
                <Button
                  onClick={(evt) => openModal(evt, record.id, record)}
                  variant='contained'
                  disabled={!record.filename}
                  color="primary">
                  Preview
                </Button>
              </Item>
            </Grid>
          </Grid>
          <Grid container id="render-snippets-record-grid-container" flex={1} overflow={'scroll'}>
            <RenderSnippets record={record} />
          </Grid>

      </Paper>
    </>
  )
}