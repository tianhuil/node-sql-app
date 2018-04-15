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

const Profile = (props) => (
  <Query query={QueryPerson}>
    {({ loading, error, data, client }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return <MutationForm
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
        { formApi => <form onSubmit={formApi.submitForm}>
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
        </form> }
      </MutationForm>
    }}
  </Query>
)

export default Profile
