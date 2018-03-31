import React from 'react';
import ReactDOM from 'react-dom';
import BookList from "./components/box";
import { ApolloProvider } from "react-apollo";

import { newClient } from "./lib/apollo.js"

const client = newClient()

const App = () => (
  <ApolloProvider client={client}>
    <BookList name={"Me"}>
    </BookList>
  </ApolloProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
