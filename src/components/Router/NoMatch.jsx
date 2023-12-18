export default function NoMatch() {
    let location = useLocation();
    console.log(`file: index.js:41 ~ NoMatch ~ location:`, location);
  
    return (
    <Container>
          <Paper elevation={1} styles={{
            flex:1,
            justifyContent:'center',
            alignContent:'center',
            height:'300vh',
          }}>
            <Grid container minHeight={'100vh'} justifyContent="center" alignItems="center">
            <Grid item xs={12} margin={20}>
                 <h2> No match for <code>{location.pathname}</code></h2>
            </Grid>
            </Grid>
          </Paper>
    </Container>
    );
  } 