import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { PostTopicsOptions, AuthorsOptions } from "./Options"

const QueryPost = gql`
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
  return <Query query={QueryPost} variables={{ id: parseInt(match.params.id) }} >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <form>
        <div className="form-group">
          <label htmlFor="headline">Headline</label>
          <input type="text" className="form-control" id="headline" aria-describedby="emailHelp" value={data.postById.headline} />
        </div>
        <div className="row">
          <div className="col-6">
            <AuthorsOptions select={data.postById.personByAuthorId.id}/>
          </div>
          <div className="col-6">
            <PostTopicsOptions select={data.postById.topic}/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="headline">Body</label>
          <textarea className="form-control" id="body" rows="12" value={data.postById.body}>
          </textarea>
        </div>
      </form>
    }}
  </Query>
}

export default EditPost
