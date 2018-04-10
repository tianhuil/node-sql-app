import React from 'react';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { TopicsOptions, AuthorsOptions } from "./Options"

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
}`

const UpdatePost = gql`
mutation UpdatePostById($input: UpdatePostByIdInput!) {
  updatePostById(input: $input) {
    post {
      id
      personByAuthorId {
        id
        fullName
      }
      headline
      body
      topic
    }
  }
}`

const EditPost = ({match}) => {
  let authorIdInput, headlineInput, bodyInput, topicInput

  return <Query query={QueryPost} variables={{ id: parseInt(match.params.id) }} >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return <Mutation mutation={UpdatePost}>
        {updatePost => {
          const updatePost2 = () => {
            updatePost({variables: { input: {
              id: match.params.id,
              postPatch: {
                authorId: authorIdInput.value,
                headline: headlineInput.value,
                body: bodyInput.value,
                topic: topicInput.value
              }
            }}})
          }
          return <form onChange={updatePost2}>
            <div className="form-group">
              <label htmlFor="headline">Headline</label>
              <input
                type="text" className="form-control" id="headline"
                value={data.postById.headline}
                ref={n => {headlineInput = n}}
              />
            </div>
            <div className="row">
              <div className="col-6">
                <AuthorsOptions
                  select={data.postById.personByAuthorId.id}
                  authorIdInput={n => {authorIdInput = n}}
                />
              </div>
              <div className="col-6">
                <TopicsOptions
                  select={data.postById.topic}
                  topicInput={n => {topicInput = n}}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="body">Body</label>
              <textarea
                className="form-control" id="body" rows="12"
                value={data.postById.body}
                ref={n => {bodyInput = n}}
              />
            </div>
          </form>
        }}
      </Mutation>
    }}
  </Query>
}

export default EditPost
