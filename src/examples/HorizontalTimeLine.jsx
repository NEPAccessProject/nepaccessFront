import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

const useStyles = makeStyles({
    timeline: {
      transform: "rotate(90deg)"
    },
    timelineContentContainer: {
      textAlign: "left"
    },
    timelineContent: {
      display: "inline-block",
      transform: "rotate(-90deg)",
      textAlign: "center",
      minWidth: 50
    },
    timelineIcon: {
      transform: "rotate(-90deg)"
    }
  });
  
  function App() {
    const classes = useStyles();
  
    return (
      <Timeline className={classes.timeline} align="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <CheckCircleOutlineIcon
              color="primary"
              className={classes.timelineIcon}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Eat</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <PauseCircleFilledIcon
              color="primary"
              className={classes.timelineIcon}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Code</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <CachedIcon color="primary" className={classes.timelineIcon} />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Sleep</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <CachedIcon color="primary" className={classes.timelineIcon} />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Repeat</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <ErrorIcon color="primary" className={classes.timelineIcon} />
          </TimelineSeparator>
          <TimelineContent className={classes.timelineContentContainer}>
            <Paper className={classes.timelineContent}>
              <Typography>Sleep</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );
  }