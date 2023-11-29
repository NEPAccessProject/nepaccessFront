import { Paper,Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; //'version 2
import useMediaQuery from '@mui/material/useMediaQuery';

import { styled } from '@mui/styles';
import React from 'react';
import { ISearchResult } from './Interfaces';
import theme from '../styles/theme';

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
	borderRadius: 5,
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
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  console.log(`file: SearchResultCards.tsx:41 ~ isDesktop:`, isDesktop);

  const styles = {
    padding: 3,
    margin: 2,
//    lineHeight: 2,
    display: 'flex',
    border: '1px solid #ccc',
    overflow:'hidden',
    textWrap: 'anywhere',
    justifyContent: 'flex-start',
    justifyItems: 'center',
    alignItems: 'center',
    borderRadius: 2,
  }
  const md=2;
  const lg=3;
  const sm=6;
  const xs=4;
	return (
<Box sx={{flexGrow:1}}>
  			<Grid container  border={0} borderColor={'#ddd'} flexGrow={1} marginTop={2} marginBottom={2}>
            <Grid style={styles} md={md} xs={xs} lg={lg}>
  					Agency: <b> {result.agency ? result.agency : ' N/A'}</b>
  				</Grid>
          <Grid style={styles} md={md} sm={sm} xs={xs}>
           Cooperating Agency: <b> {result.cooperatingAgency ? result.cooperatingAgency : ' N/A'}</b>
          </Grid>
  				<Grid style={styles} md={md} sm={sm} xs={xs} lg={lg}>
  					Status: <b> {result.decision ? result.decision : ' N/A'}</b>
  				</Grid>
  				<Grid style={styles} md={md} sm={sm} xs={xs} lg={lg}>
  					Date: <b> {result.commentDate ? result.commentDate : ' N/A'}</b>
  				</Grid>
  				<Grid style={styles} md={md} sm={sm} xs={xs} lg={lg}>
  					State: <b>{result.state ? result.state : ' N/A'}</b>
  				</Grid>
  				<Grid style={styles} md={md} sm={sm} xs={xs} lg={lg}>
  					County: <b>{result.county ? result.county : ' N/A'}</b>
  				</Grid>
  				<Grid style={styles} md={md} sm={sm} xs={xs} lg={lg}>
  					Action: <b>{result.action ? result.action : ' N/A'}</b>
  				</Grid>
  				<Grid style={styles} md={md} sm={sm} xs={xs} lg={lg}>
  					Decision: <b>{result.decision ? result.decision : ' N/A'}</b>
  				</Grid>
  				{/* {(result.commentDate)
                ? ( */}
  				<Grid style={styles} md={md} xs={xs} lg={lg}>
            Project Start Date:{' '}
  					<b>{result.registerDate ? result.registerDate : ' N/A'}</b>
  				</Grid>
  				<Grid style={styles} md={md} xs={xs}  lg={lg}>
  					Project Endate Date:{' '}
  					<b>{result.commentDate ? result.commentDate : ' N/A'}</b>
  				</Grid>
  				<Grid style={styles} md={md} xs={xs} lg={lg}>
            Final NOA: <b>{result.finalNoa ? result.finalNoa : ' N/A'}</b>
  				</Grid>
  				<Grid style={styles} md={md} xs={xs} lg={lg}>
  					Draft NOA: <b>{result.draftNoa ? result.draftNoa : ' N/A'}</b>
  				</Grid>
  				<Grid style={styles} md={md} xs={xs} lg={lg}>
  					Process ID: <b>{result.processId ? result.processId : ' N/A'}</b>
  				</Grid>
  			</Grid>
</Box>
	)
  }