import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route } from 'react-router-dom'
import { newClient } from "./lib/apollo.js"

import PostList from "./components/PostList";
import EditPost from "./components/EditPost"

const client = newClient()

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter >
      <React.Fragment>
        <Route exact path="/" component={PostList}/>
        <Route path="/edit/:id" component={EditPost}/>
      </React.Fragment>
    </BrowserRouter>
  </ApolloProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
