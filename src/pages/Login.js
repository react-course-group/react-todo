import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Form} from '../components'

class Login extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit({email, password}) {
    try {
      const res = await this.props.api.post('/login', {
        email,
        password
      })
      window.localStorage.setItem('token', res.data.token)
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    if (this.props.user) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <h2>Login</h2>
        <Form onSubmit={this.handleSubmit} submitLabel="Sign in" />
      </div>
    )
  }
}

export {Login}
