export default function RouteError({error="An error occurred at this route"}){
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
                 <h2>System Error</h2>
                 <error>
                   {message}
                 </error>
            </Grid>
            </Grid>
          </Paper>
    </Container>
    );
  } 