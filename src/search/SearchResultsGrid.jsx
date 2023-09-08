
import { Button, Grid, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useContext, useState } from 'react';
import SearchContext from './SearchContext';

import theme from '../styles/theme';

const useStyles = withStyles((theme) => ({
	centeredContent: {
		verticalAlign: 'center',
		textAlign: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		justifyItems: 'center',
		fontFamily: 'open sans',
	},
	autocomplete: {},
	resultsHeader: {
		fontFamily: 'open sans',
		fontSize: 50,
		fontWeight: 'bolder',
		padding: 4,
		margin: 2,
		fontColor: '#000',
	},
	resultItemHeader: {
		fontSize: 25,
		fontWeight: 'bold',
		margin: 0.5,
		padding: 1,
		elevation: 1,
		fontColor: '#000',
	},
  card: {

  },
  cardGridItem: {
    alignContent:'center',
    alignItems: 'center',
    backgroundColor:"blue",
    borderColor:"#ccc",
    display:'flex',
    fontColor: '#000',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    justifyContent:"center",
    justifySelf: 'center',
    margin:2,
    textAlign:'center',
  },
	itemHeader: {
		fontFamily: 'open sans',
		fontSize: 40,
		fontWeight: 'bold',
		margin: 0.5,
		padding: 1,
		fontColor: '#000',
		elevation: 1,
		p: 1,
		'&:hover': {
			backgroundColor: '#ccc', //theme.palette.grey[200],
			boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.25)',
			cursor: 'pointer',
			'& .addIcon': {
				color: 'darkgrey',
			},
		},
		infoCard: {
			padding: 1,
			margin: 1,
			border: 1,
			borderColor: '#ddd',
		},
	},
}));

function SearchResultsGrid(props) {
   console.log("🚀 ~ file: SearchResultsItems.jsx:303 ~ DisplayGrid ~ props:", props)
    const { state, setState } = useContext(SearchContext);
    const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const { hideText, hidden } = state;
  
    const { result } = props.result;
    const { processId, documentType } = result;
    //  console.log("🚀 ~ file: SearchResultsItems.jsx:316 ~ DisplayGrid ~ result:", result)
  
    const openPDFPreview = (evt, processId) => {
      this.setState({ showPDFDialog: true })
      evt.preventDefault();
    };
    const classes = useStyles(theme);
    console.log("🚀 ~ file: SearchResultsGrid.jsx:95 ~ SearchResultsGrid ~ classes:", classes)
  
    return (
      <>
        <Grid item xs={1} className={classes.centeredContent} borderRight={1} borderColor={"#ddd"}>
          2022
        </Grid>
        <Grid xs={2}
          borderRight={1}
          borderLeft={1}
          borderColor={"#ddd"}>
          <Typography
          variant='h2'
          textAlign='center'
  
        >
          {documentType}
        </Typography> </Grid>
        <Grid item xs={6} className={classes.centeredContent} border={0} borderColor={"red"}>Space</Grid>
        <Grid container display={'flex'} xs={3} className={classes.centeredContent} border={0}>
          <Grid item xs={6}
            border={0}
            alignContent={'center'}
            justifyContent="center"
            alignItems={'center'}
            display={'flex'}>
            <Button
              onClick={(evt) => openPDFPreview(evt, processId)}
              color={'secondary'}
            >
              Preview
            </Button>
          </Grid>
          <Grid xs={6}
            id="preview-button-grid-item"
            item
            //         display={'flex'}
            border={0}
            alignContent={'center'}
            justifyContent="center"
            alignItems={'center'}
            display={'flex'}>
            <Button
              onClick={(evt) => openPDFPreview(evt, processId)}
              color={'secondary'}
              variant="outlined"
              display={'flex'}>
              Download PDFs
            </Button>
          </Grid>
  
        </Grid>
      </>
    )
  }
//  export default withStyles(useStyles)(SearchResultsGrid);
export default SearchResultsGrid;
