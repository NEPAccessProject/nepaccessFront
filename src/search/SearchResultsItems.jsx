import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import React, { useContext, useState } from "react";
import SearchContext from "./SearchContext";
import SearchResultItem from "./SearchResultItem";
//import './search.css';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0,
  border: 0,
  borderRadius: 0,
  fontColor: "#000",
  fontFamily: "open sans",
}));

const useStyles = makeStyles((theme) => ({
  centeredContent: {
    verticalAlign: "center",
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    justifyItems: "center",
    fontFamily: "open sans",
  },
  autocomplete: {},
  resultsHeader: {
    fontFamily: "open sans",
    fontSize: 50,
    fontWeight: "bolder",
    padding: 4,
    margin: 2,
    fontColor: "#000",
  },
  resultItemHeader: {
    fontSize: 25,
    fontWeight: "bold",
    margin: 0.5,
    padding: 1,
    elevation: 1,
    fontColor: "#000",
  },
  card: {},
  cardGridItem: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    borderColor: "#ccc",
    display: "flex",
    fontColor: "#000",
    fontSize: "0.9rem",
    fontWeight: "bold",
    justifyContent: "center",
    justifySelf: "center",
    margin: 2,
    textAlign: "center",
  },
  itemHeader: {
    fontFamily: "open sans",
    fontSize: 40,
    fontWeight: "bold",
    margin: 0.5,
    padding: 1,
    fontColor: "#000",
    elevation: 1,
    p: 1,
    "&:hover": {
      backgroundColor: "#ccc", //theme.palette.grey[200],
      boxShadow: "0px 4px 8px rgba(0.5, 0.5, 0.5, 0.25)",
      cursor: "pointer",
      "& .addIcon": {
        color: "darkgrey",
      },
    },
    infoCard: {
      padding: 1,
      margin: 1,
      border: 1,
      borderColor: "#ddd",
    },
  },
}));

export default function SearchResultItems(props) {
//  console.log(`🚀 ~ file: SearchResultsItems.jsx:102 ~ SearchResultItems ~ props:`, props);

  const context = useContext(SearchContext);
  const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
  const { state, setState } = useContext(SearchContext);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { hideText, hidden } = state;
  //console.log("🚀 ~ file: SearchResultsItems.jsx:45 ~ SearchResultItems ~ props:", props);
  const { result, record } = props;
  const sortByDate = (a, b) => {
    return a.commentDate > b.commentDate;
  };

  let sortedRecords = result.records.sort(sortByDate);
  return (
    <>
      {/* <h2>Search Result Items Result?</h2>
    {JSON.stringify(result)} */}
      <Box margin={1} id="search-results-container-box">
        {sortedRecords.map((record, idx) => {
          return (
            <Box key={record.id} id={`search-result-item-container-${record.id}`}>
              <Typography color={'secondary'} variant='h5'> {record.title}</Typography>
              <Box borderColor='#ccc' id="search-result-item-container-box">
                <SearchResultItem record={record} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
}