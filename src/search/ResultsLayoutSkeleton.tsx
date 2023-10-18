import { Paper, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
import { makeStyles, styled } from '@mui/styles';
import React from 'react';
import theme from '../styles/theme';
import './search.css';

const Item = styled(Paper)(({ theme }) => ({
	//backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	//...theme.typography.body2,
	//...theme,
	//padding: 2, //theme.spacing(1),
	// textAlign: 'center',
	fontColor: '#000', //theme.palette.text.secondary,
	elevation: 1,

	borderRadius: 1,
	// mt: 2,
	// mb: 2,
//	margin: 2,
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
	card: {
		margin: 1,
		borderRadius: 1,
    elevation:1,
    //padding:2,
	},
  skeleton:{
    width:'100%',
    //margin:1,

  }
}));

export default function ResultsLayoutSkeleton() {
	const classes = useStyles(theme);
	//   const classes = useStyles(theme);
	return (
		<Grid
      container
      borderColor='#ccc'
      border={0}
			xs={12}
      marginLeft={1}
			flexGrow={1}
			display='flex'
      padding={1}
			id='results-skeleton-grid-container'>
			<Grid
        spacing={1}
        id="results-skeleton-cards-grid-container"
				container
				xs={12}
        marginLeft={1}
				flexGrow={1}>
        <Grid item xs={12} paddingRight={1}>
          <Skeleton width={'100%'} height={20} variant="rectangular" animation="wave" />
        </Grid>

          <Grid
            item
            className={classes.card}
            xs={1}
            >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            className={classes.card}
            xs={2}
            >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            >
          </Skeleton>
          </Grid>
          <Grid
            item
            xs={1}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={3}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={2}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={2}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={3}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={1}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={2}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={1}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={2}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={1}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={1}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={2}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
          <Grid
            item
            xs={1}
            className={classes.card}
          >
            <Skeleton
              className={classes.skeleton}
              animation='pulse'
              variant='rectangular'
            />
          </Grid>
        </Grid>
        <Grid
          id="results-skeleton-result-1-grid-container"
          container
          margin={1}
          padding={0}
          spacing={1}
          xs={12}>
          <Grid
            item
            className={classes.card}
            xs={4}>
            <Skeleton
              animation='pulse'
              variant='rectangular'
              height={50}
              width='100%'
            />
          </Grid>
          <Grid
            item
            xs={4}
            className={classes.card}

          >
            <Skeleton
              animation='pulse'
              variant='rectangular'
              height={50}
              width='100%'
            />
          </Grid>
          <Grid
            item
            className={classes.card}
            xs={4}>
            <Skeleton
              animation='pulse'
              variant='rectangular'
              height={50}
              width='100%'
            />
				</Grid>
        <Grid item xs={12}>
          <Skeleton width={'100%'} height={20} variant="rounded" animation="wave" />
        </Grid>
			</Grid>
      <Grid container margin={1} borderColor={'#ccc'} padding={0} spacing={1} id="results-skeleton-result-2-grid-container"
          xs={12}>
          <Grid
            item
            className={classes.card}
            xs={4}>
            <Skeleton
              animation='pulse'
              variant='rectangular'
              height={50}
              width='100%'
            />
          </Grid>
          <Grid
            item
            xs={4}
            className={classes.card}

          >
            <Skeleton
              animation='pulse'
              variant='rectangular'
              height={50}
              width='100%'
            />
          </Grid>
          <Grid
            item
            className={classes.card}
            xs={4}>
            <Skeleton
              animation='pulse'
              variant='rectangular'
              height={50}
              width='100%'
            />
				</Grid>
        <Grid item xs={12}>
          <Skeleton width={'100%'} height={20} variant="rounded" animation="wave" />
        </Grid>
			</Grid>
		</Grid>

	);
}
