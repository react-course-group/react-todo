import React, {Component, Fragment} from 'react'
import {Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Alert, Form} from '../components'
import {Title} from '../Theme'
import State from '../State'

export class Login extends Component {
  static contextType = State

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit({email, password}) {
    const res = await this.context.api.post('/login', {
      email,
      password
    })
    window.localStorage.setItem('token', res.data.token)
    window.location.reload()
  }

  render() {
    if (this.context.user) {
      return <Redirect to="/tasks/all" />
    }
    return (
      <Fragment>
        <Helmet>
          <title>Todo - Login</title>
        </Helmet>
        <Title>Login</Title>
        <Alert content="Testing error alert!" />
        <Form onSubmit={this.handleSubmit} submitLabel="Sign in" />
      </Fragment>
    )
  }
}
