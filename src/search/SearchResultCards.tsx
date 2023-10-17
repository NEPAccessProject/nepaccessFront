import { Grid, Paper } from '@mui/material';
import { styled } from '@mui/styles';
import React from 'react';
import { ISearchResult } from './Interfaces';

const CardItem = styled(Paper)(({ theme }) => ({
	padding: 1,
  margin: 1,
  borderColor: "#ccc",
  minHeight: 2,
  lineHeight: 1,
  justifyContent: 'center',
  justifyItems: 'center',

	fontColor: "#111", //theme.palette.text.secondary,
	elevation: 1,
	borderRadius: 1,

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

export default function SearchResultCards(props: IProps) {
	const { result} = props;
	return (
		<div>
			<Grid container padding={2} xs={12} flexDirection={'row'} flex={1}>
      <CardItem sx={{ padding:1, margin:0.5}}>
					Agency: <b>{result.agency ? result.agency : 'N/A'}</b>
				</CardItem>
        <CardItem sx={{ padding:1, margin:0.5}}>
         Cooperating Agency: <b>{result.cooperatingAgency ? result.cooperatingAgency : 'N/A'}</b>
        </CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
					Status: <b>{result.decision ? result.decision : 'N/A'}</b>
				</CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
					Date: <b>{result.commentDate ? result.commentDate : 'N/A'}</b>
				</CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
					State: <b>{result.state ? result.state : 'N/A'}</b>
				</CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
					County: <b>{result.county ? result.county : 'N/A'}</b>
				</CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
					Action: <b>{result.action ? result.action : 'N/A'}</b>
				</CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
					Decision <b>{result.decision ? result.decision : 'N/A'}</b>
				</CardItem>
				{/* {(result.commentDate)
              ? ( */}
				<CardItem sx={{ padding:1, margin:0.5}}>
          Project Start Date:{' '}
					<b>{result.registerDate ? result.registerDate : 'N/A'}</b>
				</CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
					Project Endate Date:{' '}
					<b>{result.commentDate ? result.commentDate : 'N/A'}</b>
				</CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
          Final NOA: <b>{result.finalNoa ? result.finalNoa : 'N/A'}</b>
				</CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
					Draft NOA: <b>{result.draftNoa ? result.draftNoa : 'N/A'}</b>
				</CardItem>
				<CardItem sx={{ padding:1, margin:0.5}}>
					Process ID: <b>{result.processId ? result.processId : 'N/A'}</b>
				</CardItem>
			</Grid>
		</div>
	);
}
