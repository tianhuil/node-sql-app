import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const postQuery = gql`
query PostQuery($cursor: Cursor=null) {
  allPosts(last: 5, after: $cursor) {
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
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
`

const PostList = (props) => (
  <div className="posts">
    <h1>Posts ({props.data.allPosts.totalCount})</h1>
    <ul>
    {
      props.data.allPosts.edges.map(e =>
        <li key={e.node.id}>
          <h3>{e.node.headline}</h3>
          <p>
            { e.node.personByAuthorId.fullName &&
                <em>{e.node.personByAuthorId.fullName}</em> }
            &nbsp;&nbsp;
            { e.node.topic &&
                <span>({e.node.topic})</span> }
          </p>
          <p>{ e.node.summary }</p>
        </li>
      )
    }
    </ul>
  </div>
)

class BookList extends React.Component {
  render() {
    return (
      <Query query = {postQuery}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return <PostList data={data} />
        }}
      </Query>
    );
  }
}

export default BookList
