import React from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"

export const getToken = () => localStorage.getItem('token')

const setToken = (token) => localStorage.setItem('token', token)

const clearToken = () => setToken('')

export const UserContext = React.createContext({
  userId: null,
  logIn: ((token) => {}),
  logOut: (() => {})
})

export const UserConsumer = UserContext.Consumer

export class UserProvider extends React.Component {
  constructor(props) {
    super(props)

    this.logIn = (token) => {
      let userId = null
      try {
        const payload = atob(token.split(".")[1])
        userId = JSON.parse(payload).person_id
      } catch(error) {
        return false
      }
      setToken(token)
      this.setState(state => ({userId: userId}))
      return true
    }

    this.logOut = (client) => {
      clearToken()
      this.setState(state => ({userId: null}))
      client.resetStore()
      client.cache.reset()
    }

    this.state = {
      userId: null,
      logIn: this.logIn,
      logOut: this.logOut
    }
  }

  render() {
    return <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    // if (this.state.userId === null) {
    // } else {
    //   return <Query query={QueryUser}>
    //     {({ error, data, client }) => {
    //       if (error || !data || !data.currentPerson) {
    //         this.logOut(client)
    //       }
    //       return <UserContext.Provider value={this.state}>
    //         {this.props.children}
    //       </UserContext.Provider>
    //     }}
    //   </Query>
    // }
  }
}
