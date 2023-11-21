import React from "react";
import { styled } from '@mui/material/styles';
import {Link} from 'react-router-dom';
import { Divider,Box, Hidden, Card, CardContent, Paper, Typography,List,ListItem } from "@material-ui/core";
//import Grid from '@mui/material/Grid'
import Grid from '@mui/material/Unstable_Grid2'

import '../index.css';
const words = [
  "fee",
  "fi",
  "fo",
  "fum"
]

const GridItem = styled(Grid)(({ theme }) => ({
  border: '1px solid #ccc',
  display: 'flex',
}))

const Item = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  //padding: theme.spacing(2),
  textAlign: 'center',
  //    display: 'flex',
  color: theme.palette.text.secondary,
  border: '1px solid #ddd',
  justifyContent: 'center',
  item: true,
}));

const styles = {
  gridContainer: {
    border: '1px solid black',
    //flex: 1,
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    border: '1px solid #ddd'
  }
};

function App() {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  // React.useEffect(() => {
  //   window.addEventListener('resize', () => {
  //     console.log(`Setting width: ${window.innerWidth}, height: ${window.innerHeight}`)
  //     setWidth(window.innerWidth);
  //     setHeight(window.innerHeight);
  //   })
  // },[window.innerWidth])

  {
    {
      console.log(window.innerWidth);
      console.log(window.innerHeight);
      window.addEventListener('resize', () => {
        console.log()
        setWidth(window.innerWidth);
      })
    }
  }



  return (
  <Paper id="root" sx={{ flexGrow: 1 }}>
    <Grid flex={1} container spacing={1}>
      <GridItem xs={12}><SearchHeader /></GridItem>
      <GridItem xs={12}><SearchResults/></GridItem>
    </Grid>
    {/* <GridItem id="search-results-grid" flex={1} container spacing={3}>
        <GridItem md={3} xs={12}>
            <Paper>
              <b>Search Fitlers</b>
            </Paper>
        </GridItem>
        <GridItem md={9} xs={12}>
            <Paper>
              <b>Search Results</b>
            </Paper>
        </GridItem>
      </GridItem> */}

  </Paper>
  );
}

const SearchHeader = ()=> {
  return (
    <>
    <Grid id="search-results-header" flex={1} border={2} borderColor={'black'} container spacing={0.5}>
          <GridItem md={3} xs={12}>
              <Paper>
                <b>Links</b>
              </Paper>
          </GridItem>
        <GridItem flex={1} container>
            <GridItem xs={12}>Seach Bar</GridItem>
            <GridItem container flex={1}>
                <GridItem md={3} xs={12}>
                  <Box>Option</Box>
                </GridItem>
                <GridItem md={3} xs={6}>
                  <Box>Option</Box>
                </GridItem>
                <GridItem item md={3} xs={6}>
                  <Box>Option</Box>
                </GridItem>
                <GridItem item md={3} xs={12}>
                  <Box>Option</Box>
                </GridItem>
              </GridItem>
        </GridItem>
      </Grid>
    </>
  )
}
const SearchResults = ()=> {
  return (
    <>
        <GridItem md={3} xs={12}>
          <Paper sx={{flexGrow:1}}>
            <b>Search Fitlers</b>
          </Paper>
        </GridItem>
        <GridItem md={9} xs={12}>
          <Paper sx={{flexGrow:1}}>
              <h3>Search Results</h3>
          </Paper>
        </GridItem>
    </>
  )
}
const SearchFooter = ()=> {
  return (
    <>
    </>
  )
}


// <Grid container spacing={3}>
//   {words.map(word =>
//     <Grid item xs={12} sm={12/words.length}>
//       <Card>
//         <CardContent>
//           <Typography>{word}</Typography>
//         </CardContent>
//       </Card>
//     </Grid>
//   )}
// </Grid>

const Container = (props) =>{
  return (
    <>
 <Grid container
      id="search-app-grid-container"
      //flexDirection="row"
      style={styles.gridContainer}
    >
      <Grid item spacing={0} xs={3}>
        <Item xs={0} md={12}>
          Link 1
        </Item>
        <Item xs={0} md={12}>
          Link 2
        </Item>
        <Item xs={12} md={12}>
          Link 3
        </Item>
      </Grid>
      <Divider />
      <Grid id="search-options-container" container xs={9}>
        <Item id="search-options-search-bar" xs={12}>
          <b>SEARCH BAR</b>
        </Item>
        <Grid id="search-options-control" container border="2px solid red" style={styles.gridContainer} justifyContent="flex-end">
          <Item xs={6} md={3}>md-3</Item>
          <Item xs={6} md={3}>md-3</Item>
          <Item xs={6} md={3}>md-3</Item>
          <Item xs={6} md={3}>md-3</Item>
        </Grid>
      </Grid><Grid item spacing={0} xs={3}>
        <Item xs={12}>
          Link 1
        </Item>
        <Item xs={12}>
          Link 2
        </Item>
        <Item xs={12}>
          Link 3
        </Item>
      </Grid>
      <Grid id="search-options-container" container xs={9}>
        <Item id="search-options-search-bar" xs={12}>
          <b>SEARCH BAR</b>
        </Item>
        <Grid id="search-options-control" container border="2px solid red" style={styles.gridContainer} justifyContent="flex-end">
          <Item xs={6} md={3}>md-3</Item>
          <Item xs={6} md={3}>md-3</Item>
          <Item xs={6} md={3}>md-3</Item>
          <Item xs={6} md={3}>md-3</Item>
        </Grid>
      </Grid>
    </Grid>
    <Grid id="grid-results" container style={styles.gridContainer} xs={12}>
      <Item id="search-filters" xs={3}>
        <h6>Sidebar Filters</h6>
      </Item>
      <Item xs={9} id="search-results">
        <h6>Results</h6>
        <Item id="search-results-map-container" xs={12}>
          <h6>Map</h6>
        </Item>
        <Item id="search-results-header-container" xs={12}>
          <h4>24 of 1232 Results</h4>
        </Item>
        <Grid className="search-result-item" container style={styles.gridContainer} id="search-results-grid-container">
          <Item md={1} xs={6}>Year</Item>
          <Item md={2} xs={6}>Document Type</Item>
          <Item md={7} xs={12}>Title</Item>
          <Item md={2} xs={12}>Buttons</Item>
          <Item xs={12}>
            <h6>Toggle</h6>
          </Item>
          <Item xs={12}>
            <p>
              Pariatur tempor nisi exercitation qui. Quis ad laborum exercitation magna sit dolore excepteur ullamco quis. Laboris eu exercitation et dolor amet officia irure pariatur ullamco ex ut.
            </p>
          </Item>
        </Grid>
      </Item>
    </Grid>
    </>
  )
}

const Header = (props) => {
  return (
    <>
      <Grid item spacing={0} xs={3}>
        <Item xs={12}>
          Link 1
        </Item>
        <Item xs={12}>
          Link 2
        </Item>
        <Item xs={12}>
          Link 3
        </Item>
      </Grid>
      <Grid id="search-options-container" container xs={9}>
        <Item id="search-options-search-bar" xs={12}>
          <b>SEARCH BAR</b>
        </Item>
        <Grid id="search-options-control" container border="2px solid red" style={styles.gridContainer} justifyContent="flex-end">
          <Item xs={6} md={3}>md-3</Item>
          <Item xs={6} md={3}>md-3</Item>
          <Item xs={6} md={3}>md-3</Item>
          <Item xs={6} md={3}>md-3</Item>
        </Grid>
      </Grid>
    </>
  )
}

export default App;
