import React from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"

const PostQuery = gql`
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
        summary(length: 200)
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}`

const Post = (props) => (
  <React.Fragment>
    <h3>{props.node.headline}</h3>
    <p>
      { props.node.personByAuthorId.fullName &&
          <em className="mr-3">{props.node.personByAuthorId.fullName}</em> }
      { props.node.topic &&
          <span className="mr-3">({props.node.topic})</span> }
      <Link to={`/edit/${props.node.id}`}>Edit</Link>
    </p>
    <p>{ props.node.summary }</p>
  </React.Fragment>
)

const PostNextPage = (props) => {
  const pageInfo = props.pageInfo

  const nextPageClick = (e) => {
    e.preventDefault()
    props.fetchMore({
      query: PostQuery,
      variables: {
        cursor: props.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.allPosts.edges
        const pageInfo = fetchMoreResult.allPosts.pageInfo

        return newEdges.length
          ? {
              allPosts: {
                totalCount: previousResult.allPosts.totalCount,
                __typename: previousResult.allPosts.__typename,
                edges: [...previousResult.allPosts.edges, ...newEdges],
                pageInfo
              }
            }
          : previousResult
      }
    })
  }

  return (pageInfo.hasNextPage) ? (
    <button onClick={(e) => nextPageClick(e)} className="btn btn-primary">Next Page</button>
  ) : (
    <button className="btn btn-disabled">No More Pages</button>
  )
}

const PostList = () => (
  <Query query={PostQuery}>
    {({ loading, error, data, fetchMore }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      const allPosts = data.allPosts

      return <React.Fragment>
        <h1>Posts ({allPosts.totalCount})</h1>
        <ol>
        {
          allPosts.edges.map(edge =>
            <li key={edge.node.id}>
              <Post node={edge.node} />
            </li>
          )
        }
        </ol>
        <PostNextPage fetchMore={fetchMore} pageInfo={allPosts.pageInfo}/>
      </React.Fragment>
    }}
  </Query>
)

export default PostList
