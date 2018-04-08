import React from 'react';
import ReactDOM from 'react-dom';
import PostList from "./components/PostList";
import { ApolloProvider } from "react-apollo";

import { newClient } from "./lib/apollo.js"

const client = newClient()

const App = () => (
  <ApolloProvider client={client}>
    <PostList />
  </ApolloProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
