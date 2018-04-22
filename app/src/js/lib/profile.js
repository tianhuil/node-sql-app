import React from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"

const getToken = () => localStorage.getItem('token')

const setToken = (token) => localStorage.setItem('token', token)

const clearToken = () => setToken('')

const QueryProfile = gql`
query {
  currentPerson {
    id
    fullName
  }
}`

const ProfileQuery = (props) => {
  const token = getToken()
  if (token) {
    return <Query query={QueryProfile}>
      {({ error, ...rest }) => {
        if (error) {
          clearToken()
        }
        return props.children({error, ...rest})
      }}
    </Query>
  } else {
    return props.children({error: "No User Token"})
  }
}

export { getToken, setToken, ProfileQuery }
