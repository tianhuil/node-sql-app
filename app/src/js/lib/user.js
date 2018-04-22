import React from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"

export const getToken = () => localStorage.getItem('token')

const setToken = (token) => localStorage.setItem('token', token)

const clearToken = () => setToken('')

const QueryUser = gql`
query {
  currentPerson {
    id
    fullName
  }
}`

export const UserContext = React.createContext({
  user: null,
  logIn: ((token, user) => {}),
  logOut: (() => {})
})

export const UserConsumer = UserContext.Consumer

export class UserProvider extends React.Component {
  constructor(props) {
    super(props)

    this.logIn = (token, user) => {
      setToken(token)
      this.setState(state => ({user: user}))
    }

    this.logOut = (client) => {
      clearToken()
      this.setState(state => ({user: null}))
      client.resetStore()
      client.cache.reset()
    }

    this.state = {
      user: null,
      logIn: this.logIn,
      logOut: this.logOut
    }
  }

  render() {
    if (this.state.user) {
      return <Query query={QueryUser}>
        {({ error, data, client }) => {
          if (error || !data || !data.currentPerson) {
            this.logOut(client)
          }
          return <UserContext.Provider value={this.state}>
            {this.props.children}
          </UserContext.Provider>
        }}
      </Query>
    } else {
      return <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    }
  }
}
