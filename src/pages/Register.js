import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Form} from '../components'

class Register extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit({email, password}) {
    try {
      const res = await this.props.api.post('/users', {
        email,
        password
      })
      window.location.href = '/login'
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    if (this.props.user) return <Redirect to="/" />
    return (
      <div>
        <h2>Register</h2>
        <Form onSubmit={this.handleSubmit} submitLabel="Signup" />
      </div>
    )
  }
}

export {Register}
