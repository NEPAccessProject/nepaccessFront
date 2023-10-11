import { Button,Box, Divider,Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { makeStyles } from '@mui/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import theme from '../styles/theme';
import PDFViewerDialog from './Dialogs/PDFViewerDialog';
import SearchContext from './SearchContext';
import RenderSnippets from './SearchResultSnippets.jsx';
import {styled} from '@mui/styles'; 
const DataCell = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  border:1,
  borderColor: 'black',
  display: 'flex',
  justifyContent: 'center',
  justifyItems: 'center',
  alignContent:'center',
  alignItems:'center',
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
    border: 2,
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

	if (!props.record) {
		console.warn('!!!!!! 36 - No record received for SearchResultItem exiting, got props:', props);
	}
	const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
	//  const { seachState, setState, showContext } = useContext(SearchContext);
	const classes = useStyles(theme);
	const context = useContext(SearchContext);
	const { state, setState } = context;
	const [isOpen,setIsOpen] = useState(false);
	const _mounted = useRef(false);
	const { record } = props;
	const [modalOpen, setModal] = useState(false)
	const [currentModalId,setCurrentModalId] = useState(0)

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
	const handleDownloadClick = (evt, id) => {
		evt.preventDefault();
		console.log('Download ID Value and filename', id, filename);
	};
	const openModal = ((event,id) => {
		event.preventDefault()
		const { target: { dataset: { modal } } } = event
		setCurrentModalId(`modal-${id}`)
		setIsOpen(true)
		if (modal) setModal(modal)
	})


	const onDialogClose = (evt,id) => {
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
			onDialogClose={(evt) => onDialogClose(evt, record.id)}
			/>
  }
	</>
  )};
	const year = commentDate && commentDate.length > 0 ? new Date(commentDate).getFullYear() : 'N/A';
	const text = record.plaintext || '';
	return (
		<>
      <Divider/>
			<div  id="portal-root">

			</div>
      <div id="modal-root">

			</div>
			<Box id="search-result-box-container" elevantion={2} sx={{
				margin: 2,
			}}>
						<Grid container id="search-result-row-container" border={1} borderColor={'#ddd'}>
							<DataCell item id="year-box" xs={1} borderColor={'#ddd'}>
								<Typography id="year-typography" fontWeight={'bold'}>
									{year ? year : 'N/A'}
								</Typography>
							</DataCell>

							<DataCell item xs={3} display={'flex'} borderLeft={1} borderColor={'#ddd'} id="status-document-type-grid-item">
								<Typography className={classes.card}>
									{documentType}
								</Typography>
							</DataCell>
							<DataCell container xs={6} display={'flex'}  id="title-grid-container"  borderRight={1} borderLeft={1} borderColor={'#ddd'} padding={2}>
								<Typography id="snippets-title" variant='h5' >{(title) ? title : ''}</Typography>
							</DataCell>
							<DataCell container xs={2} flex={1} display={'flex'}  id="button-grid-container">
								<DataCell id="preview-button-grid-item" item display={'flex'} xs={12} >
									<Button onClick={(evt) => handleDownloadClick(evt)} variant='contained' color="primary">
										Download
									</Button>
								</DataCell>
							</DataCell>
						</Grid>
            <DataCell border={1} borderColor={'#ddd'} borderTop={0} item xs={12}>
								<RenderSnippets record={record} />
							</DataCell>
			</Box>
		</>
	);
}