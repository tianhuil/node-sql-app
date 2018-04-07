import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const query = gql`
{
  allPosts(last: 5) {
    totalCount
    edges {
      node {
        id
        personByAuthorId {
          fullName
        }
        topic
        headline
        body
      }
    }
  }
}
`

class BookList extends React.Component {
  render() {
    return (
      <Query query = {query}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <div className="posts">
              <h1>Posts ({data.allPosts.totalCount})</h1>
              <ul>
              {
                data.allPosts.edges.map(e =>
                  <li>
                    <h3>{e.node.headline}</h3>
                    <p>
                      <em>{
                        e.node.personByAuthorId.fullName ?
                        e.node.personByAuthorId.fullName : "Anonymous"
                      }</em>
                      &nbsp;&nbsp;
                      ({
                        e.node.topic ? e.node.topic : "MISC"
                      })
                    </p>
                    <p>{ e.node.body ?
                        e.node.body.substring(0, 100) : "No Preview"
                    }</p>
                  </li>
                )
              }
              </ul>
            </div>
          )
        }}
      </Query>
    );
  }
}

export default BookList
