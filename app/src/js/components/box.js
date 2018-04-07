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
        summary(length: 200, omission: "Not Available")
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
                  <li key={e.node.id}>
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
                    <p>{ e.node.summary }</p>
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
