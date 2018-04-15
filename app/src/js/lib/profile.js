import React from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"

const getToken = () => localStorage.getItem('token')

const setToken = (token) => localStorage.setItem('token', token)

const QueryProfile = gql`
query {
  currentPerson {
    id
    fullName
  }
}`

const ProfileQuery = (props) => (
  <Query query={QueryProfile}>
    {props.children}
  </Query>
)

export { getToken, setToken, ProfileQuery }
