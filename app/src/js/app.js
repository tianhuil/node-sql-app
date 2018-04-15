import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route } from 'react-router-dom'
import client from "./lib/apollo.js"

import PostList from "./components/PostList";
import EditPost from "./components/EditPost"
import Header from "./components/Header"
import Profile from "./components/Profile"

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter >
      <React.Fragment>
        <Header/>
        <div className="container my-5">
          <Route exact path="/" component={PostList}/>
          <Route exact path="/search" component={PostList}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/edit/:id" component={EditPost}/>
        </div>
      </React.Fragment>
    </BrowserRouter>
  </ApolloProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
