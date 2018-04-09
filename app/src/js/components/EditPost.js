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

      return <form>
        <div class="form-group">
          <label for="headline" className="form-text text-muted">Headline</label>
          <input type="text" class="form-control" id="headline" aria-describedby="emailHelp" value={data.postById.headline} />
        </div>
        <p>
          <em> {data.postById.personByAuthorId.fullName} </em>
          {data.postById.topic}
        </p>
        <div class="form-group">
          <label for="headline" className="form-text text-muted">Body</label>
          <textarea className="form-control" id="body" rows="5">
            {data.postById.body}
          </textarea>
        </div>
      </form>
    }}
  </Query>
}

export default EditPost
