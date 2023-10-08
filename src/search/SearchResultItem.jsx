import { Button,Box, Divider,Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { makeStyles } from '@mui/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import theme from '../styles/theme';
import PDFViewerDialog from './Dialogs/PDFViewerDialog';
import SearchContext from './SearchContext';
import RenderSnippets from './SearchResultSnippets.jsx';

const useStyles = makeStyles((theme) => ({
	centered: {
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center',
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
				<Grid container id="search-result-grid-container">
					<Grid
						container
						id="search-result-grid-item"
						flex={1}
						flexGrow={1}
						className={classes.centeredContent}
            border={1}
            borderColor={'#ccc'}
						xs={12}
						sx={{
						}}
					>
						<Grid container id="search-result-row-container"
							textAlign={'center'} justifyContent={'center'}
                
            >
							<Grid item id="year-box"
								xs={1}
                borderRight={1}
                borderColor='#ccc'
								classes={classes.cardGridItem}
								display={'flex'}
								alignContent={'center'}
								justifyContent="center"
								alignItems={'center'}
							>
								<Typography
									id="year-typography"
									className={classes.centeredContent}
									fontWeight={'bold'}
								>
									{year ? year : 'N/A'}
								</Typography>
							</Grid>

							<Grid
								item
								id="status-document-type-grid-item"
								display={'flex'}
								xs={2}
								alignContent={'center'}
								justifyContent="center"
								alignItems={'center'}
								className={classes.centeredContent}
                borderRight={1}
                borderColor={'#ccc'}
							>
								<Typography
									className={classes.card}
								>
									{documentType}
								</Typography>
							</Grid>
							<Grid
								display={'flex'}
								container
								borderRight={1}
								borderLeft={1}
								borderColor='#ccc'
								id="title-grid-container"
								xs={7}
								padding={1}
								flex={1}
							>
                
								<Typography id="snippets-title" variant='h5' >{(title) ? title : ''}</Typography>
                
								{/* <RenderSnippets record={record} /> */}
							</Grid>
							<Grid
								display={'flex'}
								container
								borderColor={'#ccc'}
								borderLeft={0}
								id="button-grid-container"
								xs={2}
								flex={1}
							//       className={classes.centeredContent}
							>
								{/* <Grid
									id="pdf-button-grid-item"
									item
									xs={6}
									display={'flex'}
									alignContent={'center'}
									justifyContent="center"
									alignItems={'center'} >
									<Button color={'primary'} 
                    variant={'contained'} 
                    data-modal={`modal-${record.id}`} 
                    onClick={(evt)=> openModal(evt, record.id)}>
                      Preview PDF
                    </Button>
									<Grid>

									<ModalManager 
                    record={record} 
                    id={record.id}
                    isOpen={isOpen}
                    closeFn={onDialogClose} 
                    modal={modalOpen} />
									</Grid>
								</Grid> */}
								<Grid
									id="preview-button-grid-item"
									item
									//         display={'flex'}
									xs={12}
									alignContent={'center'}
									justifyContent="center"
									alignItems={'center'}
									display={'flex'}
								>

									<Button
										onClick={(evt) => handleDownloadClick(evt)}
										variant='contained'
										color="primary"
									>
										Download
									</Button>
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<RenderSnippets record={record} />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}