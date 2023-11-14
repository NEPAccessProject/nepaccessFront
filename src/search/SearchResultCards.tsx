import { Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; //'version 2


import { styled } from '@mui/styles';
import React from 'react';
import { ISearchResult } from './Interfaces';

const Card = styled(Grid)(({ theme }) => ({
  borderColor: "blue",
  border:1,
  md: 4,
  xs: 12,
  padding:2,
  margin:1,
  justifyContent: 'flex-start',
  justifyItems: 'flex-start',
  display: 'flex',
  maxHeight: 200,
	fontColor: "#111", //theme.palette.text.secondary,
	borderRadius: 1,
  wordWrap: 'break-word',
	'&:hover': {
		//           backgroundColor: //theme.palette.grey[200],
		boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.15)',
		cursor: 'pointer',
		'& .addIcon': {
			color: 'purple',
		},
	},
}));
interface IProps {
  result : ISearchResult;
}

export default function SearchResultCards(props: any) {
	const { result} = props;
  const {id} = result;
  const styles = {
    padding: 10,
    margin: 3,
//    lineHeight: 2,
    display: 'flex',
    border: '1px solid #ddd',
    overflow:'hidden',
    textWrap: 'anywhere',
    // justifyContent: 'flex-start',
    // justifyItems: 'center',
    borderRadius: 1,
  }
  const md=4;
  const lg=4;
  const sm=6;
  const xs=12;
	return (
			<Grid border={0} borderColor={'#ddd'} flexDirection={'row'} container flex={1} marginTop={2} marginBottom={2}>
          <Grid style={styles} md={md} >
					Agency: <b> {result.agency ? result.agency : 'N/A'}</b>
				</Grid>
        <Grid style={styles} >
         Cooperating Agency: <b> {result.cooperatingAgency ? result.cooperatingAgency : 'N/A'}</b>
        </Grid>
				<Grid style={styles}  >
					Status: <b> {result.decision ? result.decision : 'N/A'}</b>
				</Grid>
				<Grid style={styles}   >
					Date: <b> {result.commentDate ? result.commentDate : 'N/A'}</b>
				</Grid>
				<Grid style={styles}  >
					State: <b>{result.state ? result.state : 'N/A'}</b>
				</Grid>
				<Grid style={styles}  >
					County: <b>{result.county ? result.county : 'N/A'}</b>
				</Grid>
				<Grid style={styles} >
					Action: <b>{result.action ? result.action : 'N/A'}</b>
				</Grid>
				<Grid style={styles} >
					Decision <b>{result.decision ? result.decision : 'N/A'}</b>
				</Grid>
				{/* {(result.commentDate)
              ? ( */}
				<Grid style={styles} >
          Project Start Date:{' '}
					<b>{result.registerDate ? result.registerDate : 'N/A'}</b>
				</Grid>
				<Grid style={styles}  >
					Project Endate Date:{' '}
					<b>{result.commentDate ? result.commentDate : 'N/A'}</b>
				</Grid>
				<Grid style={styles}   >
          Final NOA: <b>{result.finalNoa ? result.finalNoa : 'N/A'}</b>
				</Grid>
				<Grid style={styles}  >
					Draft NOA: <b>{result.draftNoa ? result.draftNoa : 'N/A'}</b>
				</Grid>
				<Grid style={styles}  >
					Process ID: <b>{result.processId ? result.processId : 'N/A'}</b>
				</Grid>
			</Grid>
	)
  }