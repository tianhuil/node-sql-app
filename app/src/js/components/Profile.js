import React from 'react'
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import { Form, Text, TextArea } from 'react-form'
import queryString from 'query-string'

const QueryPerson = gql`
query {
  currentPerson {
    id
    firstName
    lastName
    about
    createdAt
    postsByAuthorId(first: 5) {
      nodes {
        id
        topic
        headline
        summary(length: 200)
      }
      totalCount
    }
  }
}`

const UpdatePerson = gql`
mutation UpdatePersonById($input: UpdatePersonByIdInput!) {
  updatePersonById(input: $input) {
    person {
      id
      firstName
      lastName
      about
      createdAt
      postsByAuthorId(first: 5) {
        nodes {
          id
          topic
          headline
          summary(length: 200)
        }
        totalCount
      }
    }
  }
}`

const MutationForm = (props) => (
  <Mutation mutation={props.mutation}>
    { update => (
      <Form onSubmit={(submittedValues) => props.handleSubmit(update, submittedValues)}>
        {props.children}
      </Form>
    )}
  </Mutation>
)

const SmallPostList = (props) => <React.Fragment>
  <h2 className="mt-4">Posts</h2>
  <p>Total Posts: {props.totalCount}</p>
  <ol>
  {
    props.nodes.map(node =>
      <li key={node.id}>
        <h3>{node.headline}</h3>
        { node.topic &&
          <span className="mr-3">({node.topic})</span> }
        <Link to={`/edit/${node.id}`}>Edit</Link>
        <p>{ node.summary }</p>
      </li>
    )
  }
  </ol>
</React.Fragment>

const Profile = (props) => (
  <Query query={QueryPerson}>
    {({ loading, error, data, client }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return <React.Fragment>
        <MutationForm
          mutation={UpdatePerson}
          handleSubmit={(update, submittedValues) =>
            update({
              variables: {
                input: {
                  id: data.currentPerson.id,
                  personPatch: submittedValues
                }
              }
            })
          }
        >
          { formApi => <React.Fragment>
            <h2 className="mt-4">Author Information</h2>
            <form onSubmit={formApi.submitForm}>
              <div className="row">
                <div className="col-xs-12 col-md-4 form-group">
                  <label htmlFor="firstName">First Name</label>
                  <Text className="form-control"
                    id="firstName" field="firstName"
                    defaultValue={data.currentPerson.firstName}
                  />
                </div>
                <div className="col-xs-12 col-md-4 form-group">
                  <label htmlFor="lastName">First Name</label>
                  <Text className="form-control"
                    id="lastName" field="lastName"
                    defaultValue={data.currentPerson.lastName}
                  />
                </div>
                <div className="col-xs-12 col-md-4">
                  <label htmlFor="createdAt">First Name</label>
                  <input className="form-control"
                    id="createdAt"
                    value={data.currentPerson.createdAt}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="lastName">About</label>
                <TextArea
                  className="form-control" rows="5"
                  id="about" field="about"
                  defaultValue={data.currentPerson.about}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </React.Fragment>}
        </MutationForm>
        <SmallPostList
          nodes={data.currentPerson.postsByAuthorId.nodes}
          totalCount={data.currentPerson.postsByAuthorId.totalCount}
        />
      </React.Fragment>
    }}
  </Query>
)

export default Profile
