import React from "react";
import { styled } from '@mui/material/styles';
import {Link} from 'react-router-dom';
//import { Divider,Box,Button, Hidden, Card, CardContent, Paper, Typography,List,ListItem } from "@material-ui/core";
import {Input,Autocomplete,TextField,FormLabel,Checkbox,FormControl,FormControlLabel,InputLabel, Divider,Box,Button, Hidden, Card, CardContent, Paper, Typography,List,ListItem } from "@mui/material";

//import Grid from '@mui/material/Grid'
import Grid from '@mui/material/Unstable_Grid2'
import theme from "../styles/theme";
import '../index.css';
import { withTheme } from "@emotion/react";
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

const SearchFilter = ()=>{
  return (
    <Box sx={{flexGrow:1}}>
      <FormControl
                  fullWidth
                  xs={{
                    p: 1,
                    mb: 1,
                    mt: 1,
                  }}>
                  <FormLabel htmlFor='searchAgency'>
                    Cooperating Agencies:
                  </FormLabel>
                  <Autocomplete
                    fullWidth
                    id='searchAgency'
                    name='cooperatingAgency'
                    tabIndex={4}
                    options={[
                      'one','two','three'
                    ]}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          placeholder='Type or Select Cooperating Agencies'
                          variant='outlined'
                          sx={{
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            p: 0,
                          }}
                        />
                      );
                    }}
                  />
                </FormControl>
    </Box>
  )}

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

function Layouts() {
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
    <Grid flexGrow={1} container spacing={1}>
      <Item xs={12}><SearchHeader /></Item>
      <Item xs={12}><SearchResults /></Item>
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
    <Paper sx={{flexGrow:1}}>
    <Grid id="search-results-header" flex={1} border={2} borderColor={'black'} container spacing={0.5}>
          <GridItem md={3} xs={12}>
              <Paper sx={{flexGrow:1}}>
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
    </Paper>
  )
}

const SearchResultItem = ()=> {
  // const Item = styled(Grid)(({ theme }) => ({
  //   border: 1,
  //   borderColor: '#ccc',
  //   toLocaleLowerCase: true,

  //   justifyContent: 'center',
  //   alignContent: 'cemter'
  // }))
  return(
    <Paper sx={{flexGrow:1}}>
      <GridItem container flex={1} xs={12}>
              <GridItem md={2} xs={6}>Year</GridItem>
              <GridItem md={2}>Document Type</GridItem>
              <GridItem md={5}><Typography variant="body1">
                Do do fugiat quis occaecat occaecat pariatur non fugiat do nostrud occaecat esse in. Et anim dolore in sint adipisicing cupidatat.</Typography></GridItem>
              <GridItem md={2}>
                <Box flexGrow={1}>
                  <Button fullWidth variant="filled" color="primary">Preview</Button>
                  <Button fullWidth variant="filled" color="secondary">Download</Button>
                </Box>
              </GridItem>
        </GridItem>
        <GridItem container xs={12}>
            <b>Toggle</b>
        </GridItem>
        <GridItem container>
          <Typography variant="body2">
            Sit ipsum quis reprehenderit aliqua. Officia velit aliqua culpa velit aute enim magna consectetur ut. Consectetur commodo ea culpa cupidatat reprehenderit. Laboris qui eiusmod consequat pariatur consequat amet. Ipsum labore elit duis labore anim culpa eu. Id elit in eu labore cupidatat eu ut esse pariatur non commodo. Sit dolore anim veniam incididunt nostrud excepteur laboris ex voluptate non do.
          </Typography>
        </GridItem>
    </Paper>
  )
}

const SearchResults = ()=> {
  return (
    <Box flexGrow={1}>
        <Grid container columnSpacing={1} flexGrow={1}>
          <GridItem md={3} xs={12}>
            <Paper sx={{flexGrow:1}}>
              <SearchFilters/>
            </Paper>
          </GridItem>
          <GridItem md={9} xs={12}>
            <Paper sx={{flexGrow:1}}>
                <h3>Search Results</h3>
                <SearchResults/>
            </Paper>
          </GridItem>
        </Grid>
    </Box>
  )
}

const SearchFilters = () => {
  return (
    <Paper sx={{flexGrow:1}}>
      <b>Search Filters</b>
      <Box sx={{flexGrow:1}}>
          <SearchFilter/>
      </Box>
    </Paper>
  )
};
// <FormControl
//                   fullWidth
//                   xs={{
//                     p: 1,
//                     mb: 1,
//                     mt: 1,
//                   }}>
//                   <FormLabel htmlFor='searchAgency'>
//                     Cooperating Agencies:
//                   </FormLabel>
//                   <Autocomplete
//                     fullWidth
//                     id='searchAgency'
//                     name='cooperatingAgency'
//                     {...filterProps}
//                     tabIndex={4}
//                     options={agencies}
//                     value={agencies.filter((v) =>
//                       state.cooperatingAgency.includes(v.value),
//                     )}
//                     onChange={(evt, value, tag) => onCooperatingAgencyChange(evt, value, tag)}
//                     renderInput={(params) => {
//                       return (
//                         <TextField
//                           {...params}
//                           placeholder='Type or Select Cooperating Agencies'
//                           variant='outlined'
//                           sx={{
//                             wordWrap: 'break-word',
//                             overflow: 'hidden',
//                             p: 0,
//                           }}
//                         />
//                       );
//                     }}
//                   />
//                 </FormControl>

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

export default Layouts;
