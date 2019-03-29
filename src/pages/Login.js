import React, {Fragment} from 'react'
import {Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Alert, Form} from '../components'
import {Title} from '../Theme'
import State from '../State'

export function Login() {
  const {user, api} = React.useContext(State)

  async function handleSubmit({email, password}) {
    const res = await api.post('/login', {
      email,
      password
    })
    window.localStorage.setItem('token', res.data.token)
    window.location.reload()
  }

  if (user) {
    return <Redirect to="/tasks/all" />
  }
  return (
    <Fragment>
      <Helmet>
        <title>Todo - Login</title>
      </Helmet>
      <Title>Login</Title>
      <Alert content="Testing error alert!" />
      <Form onSubmit={handleSubmit} submitLabel="Sign in" />
    </Fragment>
  )
}
