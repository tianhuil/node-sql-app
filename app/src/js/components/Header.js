import React from 'react'
import gql from "graphql-tag"
import { Query, Mutation } from "react-apollo"
import { Redirect, Link } from 'react-router-dom'
import queryString from 'query-string'

import { setToken, getToken } from '../lib/token'

const Authenticate = gql`
mutation Authenticate($input: AuthenticateInput!) {
  authenticate(input: $input) {
    jwtToken
  }
}`

const ProfileQuery = gql`
query {
  currentPerson {
    id
    fullName
  }
}`

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin(response) {
    const jwtToken = response.data.authenticate.jwtToken

    if (jwtToken) {
      setToken()
      this.state.email = ''
      this.state.password = ''
      $("#dropdownMenuButton").dropdown('toggle')
      this.props.toggleLogin()
    }
  }

  render() {
    return <Mutation mutation={Authenticate}>
      {authenticate => (
        <div className="dropdown navbar-nav">
          <button
            className="btn btn-transparent btn-primary"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Login
          </button>
          <form
            className="dropdown-menu dropdown-menu-right p-4"
            aria-labelledby="dropdownMenuButton"
            style={{width: "320pt"}}
            onSubmit={e => {
              e.preventDefault()
              authenticate({variables:
                {
                  input: {
                    email: this.state.email,
                    password: this.state.password
                  }
                }
              }).then(this.handleLogin)
            }}
          >
            <div className="form-group">
              <p>spowell0@noaa.gov, iFbWWlc</p>
              <label htmlFor="email">Email</label>
              <input
                value={this.state.email}
                onChange={e => this.setState({email: e.target.value})}
                type="email" className="form-control"
                id="exampleDropdownFormEmail2" placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                value={this.state.password}
                onChange={e => this.setState({password: e.target.value})}
                type="password" className="form-control"
                id="password" placeholder="Password"
              />
            </div>
            <button type="submit" className="btn btn-primary">Sign in</button>
          </form>
        </div>
      )}
    </Mutation>
  }
}

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
  }

  render() {
    return <form className="form-inline my-2 my-lg-0">
      <input
        value={this.state.value} onChange={e => this.setState({value: e.target.value})}
        className="form-control mr-sm-2" type="search"
        placeholder="Search" aria-label="Search" />
      <Link to={`search?${queryString.stringify({q: this.state.value})}`}>
        <button className="btn btn-primary my-2 my-sm-0" type="submit">Search</button>
      </Link>
    </form>
  }
}

const Logout = (props) => (
  <Query query={ProfileQuery}>
  {({ loading, error, data, client }) => {
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    return <div className="dropdown navbar-nav">
      <button
        className="btn btn-transparent btn-primary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Logout
      </button>
      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <h6 className="dropdown-header">{data.currentPerson.fullName}</h6>
        <Link className="dropdown-item" to="/profile">Profile</Link>
        <Link className="dropdown-item" to="#" onClick={() => {
          setToken("")
          client.resetStore()
          client.cache.reset()
          props.toggleLogin()
        }}>Logout</Link>
      </div>
    </div>
  }}
  </Query>
)

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isLoggedIn: getToken() ? true : false}
    this.toggleLogin = this.toggleLogin.bind(this)
  }

  toggleLogin() {
    this.setState({isLoggedIn: !this.state.isLoggedIn})
  }

  render() {
    return <nav className="navbar navbar-expand-md navbar-dark bg-primary">
      <a className="navbar-brand mr-auto " href="/">Post Website</a>
      <Search redirect={false} />
      { this.state.isLoggedIn ?
        <Logout toggleLogin={this.toggleLogin} /> :
        <Login toggleLogin={this.toggleLogin} />
      }
    </nav>
  }
}

export default Header
