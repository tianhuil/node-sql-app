import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const postQuery = gql`
query PostQuery($cursor: Cursor = null) {
  allPosts(first: 5, after: $cursor) {
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

const PostNextPage = (props) => {
  const pageInfo = props.pageInfo

  const nextPageClick = (e) => {
    e.preventDefault();
    props.fetchMore({
      query: postQuery,
      variables: {
        cursor: props.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.allPosts.edges;
        const pageInfo = fetchMoreResult.allPosts.pageInfo;

        return newEdges.length
          ? {
              allPosts: {
                totalCount: previousResult.allPosts.totalCount,
                __typename: previousResult.allPosts.__typename,
                edges: [...previousResult.allPosts.edges, ...newEdges],
                pageInfo
              }
            }
          : previousResult;
      }
    })
  }

  return (pageInfo.hasNextPage) ? (
    <button onClick={(e) => nextPageClick(e)} className="btn btn-primary">Next Page</button>
  ) : (
    <button onClick={(e) => nextPageClick(e)} className="btn btn-disabled">No More Pages</button>
  );
}

const PostList = () => (
  <Query query={postQuery}>
    {({ loading, error, data, fetchMore }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      const allPosts = data.allPosts

      return <div className="posts">
        <h1>Posts ({allPosts.totalCount})</h1>
        <ol>
        {
          allPosts.edges.map(e =>
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
        </ol>
        <PostNextPage fetchMore={fetchMore} pageInfo={allPosts.pageInfo}/>
      </div>
    }}
  </Query>
)

export default PostList
