import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const query = gql`
query Query($id: Int!) {
  postById(id: $id) {
    id
    personByAuthorId {
      id
      fullName
    }
    topic
    headline
    body
  }
}
`

const EditPost = ({match}) => {
  return <Query query={query} variables={{ id: parseInt(match.params.id) }} >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <div>
        <h2> {data.postById.headline} </h2>
        <p>
          <em> {data.postById.personByAuthorId.fullName} </em>
          {data.postById.topic}
        </p>
        <p>
          {data.postById.body}
        </p>
      </div>
    }}
  </Query>
}

export default EditPost
