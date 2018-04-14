import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import queryString from 'query-string'

const Login = (props) => (
  <div className="dropdown navbar-nav">
    <button className="btn btn-transparent btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Login
    </button>
    <form className="dropdown-menu dropdown-menu-right p-4">
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input type="email" className="form-control" id="exampleDropdownFormEmail2" placeholder="email@example.com" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" className="form-control" id="password" placeholder="Password" />
      </div>
      <button type="submit" className="btn btn-primary">Sign in</button>
    </form>
  </div>
)

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return <form className="form-inline my-2 my-lg-0">
      <input
        value={this.state.value} onChange={this.handleChange}
        className="form-control mr-sm-2" type="search"
        placeholder="Search" aria-label="Search" />
      <Link to={`search?${queryString.stringify({q: this.state.value})}`}>
        <button className="btn btn-primary my-2 my-sm-0" type="submit">Search</button>
      </Link>
    </form>
  }
}

const Header = (props) => (
  <nav className="navbar navbar-expand-md navbar-dark bg-primary">
    <a className="navbar-brand mr-auto " href="#">Post Website</a>
    <Search redirect={false} />
    <Login />
  </nav>
)

export default Header
