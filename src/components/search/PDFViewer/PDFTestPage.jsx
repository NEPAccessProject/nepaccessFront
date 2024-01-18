import PDFModal from './PDFModal';

export default PDFTestPage = ()=> {
    return(
        <Box elevation={1}>
        <h4>MODAL?</h4>
            <PDFModal processId={2000251} open={true}/>
        </Box>
    )
}