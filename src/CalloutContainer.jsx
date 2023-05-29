import react from 'react';
import { Button, CardContent, CardHeader, Grid, Paper } from '@mui/material';
import CalloutCard from './CalloutCard';
const cards = [
  {
    header: 'What is NEPA?',
    content:
      'The National Environmental Policy Act of 1969 brought science and the public into federal decision-making as the foundational U.S. environmental law.',
    buttonText: 'Learn More',
    buttonLink: '/about',
  },
  {
    header: 'What is NEPAccess?',
    content:
      'NEPAccess.org is a knowledge-discovery platform for finding and analyzing decades of applied science and records of public participation in U.S. environmental decision-making processes.',
    buttonText: 'Learn More',
    buttonLink: '/about',
  },
  {
    header: 'What can you do here?',
    content:
      'Help grow our community of knowledge about NEPA and environmental decision-making and find answers to your questions about specific NEPA actions and the NEPA process. Our data-science driven search tools make it possible.',
    buttonText: 'Search',
    buttonLink: '/about',
  },
];
export default function CalloutContainer(props) {
  const cardCount = 5;
  const cardWidth = cardCount % 2 ? '50%' : '100%';

  return (
    <Paper id="callout-paper-container" elevation={0} 
        sx={{ padding: '1.5em', backgroundColor: 'transparent' }}>
      <Grid
        id="callout-grid-container"
        container
        spacing={1}
        flexWrap={'no-wrap'}
        sx={{
          flexGrow: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {cards.map((card, idx) => {
          return (
            <Grid className='card-item' key={idx} item xs={12} md={6} lg={4}>
              <CalloutCard
                sx={{
                  // height: '100%',
                }}
                id={'callout-card-' + idx}
                key={idx}
                header={card.header}
                content={card.content}
                buttonText={card.buttonText}
                buttonLink={card.buttonLink}
              />
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
