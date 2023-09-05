import React from 'react';

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { QueryClientHook } from 'react-query-class-component';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}

class TodoList extends React.Component {
  render() {
    return (
      <QueryClientHook
        hook={useQuery} // react query hook
        params={
          [
            'todos', // keyName
            () => { // query function
              return fetch('https://jsonplaceholder.typicode.com/todos').then(res => res.json());
            },
            // ...options
          ]
        }>
        {({ data, isLoading }) => {
          if (isLoading) return <h1>Loading</h1>;
          return (
            <div className="App">
              <h2>Todo list</h2>
              {
                data.map((query, key) => {
                  return <li key={key}>{query?.title}</li>;
                })
              }
            </div>
          );
        }}
      </QueryClientHook>
    )
  }
}