import { Button, Grid, Paper, Select, Typography } from '@material-ui/core';
import CirclularProgress from "@material-ui/core/CircularProgress";
import axios from 'axios';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

const ReactQuery = () => {

  const [filterA, setFilterA] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const GetData= async (filters) => {
   try {
    const filterString = filters
     ? "?" + filters.map((filter) => filter.key + "=" + filter.value).join("&")
     : "";
      const url = 'https://jsonplaceholder.typicode.com/todos' //"/api/data/" + filterString;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const {
    data,
    status,
    error
  } = useQuery(["data", filterA, page, pageSize], () =>
    GetData([
      {
        key: "filter_a",
        value: filterA,
      },
      {
        key: "page",
        value: page,
      },
      {
        key: "page_size",
        value: pageSize,
      },
    ])
  );

  return (
          <Paper>
            
          <Grid container flex={1} border={0} borderColor={'darkgreen'}>
              <Grid item xs={3}>
                <Button
                  onClick={() => {
                    setFilterA(false);
                    setPage(1);
                  }}
                >Set Filter</Button>
              </Grid>
              <Grid item xs={3}>
                Tab 2
              </Grid>
              <Grid item>
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Typography>
                  {page}
                </Typography>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={data?.next === null}
                >
                  Next
                </Button>
                <Select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </Select>
              </Grid>
            </Grid>

            
          <Grid container flex={1} border={0} borderColor={'darkgreen'}>
              <Grid item xs={6}>
                {status === "loading" ? (
                  <CirclularProgress />
                ) : (
                  // <DataTable data={data.results} />
                  <>{JSON.stringify(data.results)}</>
                )}
              </Grid>
              <Grid item xs={6}>
                {status === "loading" ? (
                  <CirclularProgress />
                ) : (
                  <>
                  {JSON.stringify(data.results)}
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
  );
};

export default ReactQuery;