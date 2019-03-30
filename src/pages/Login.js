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
      <Form onSubmit={handleSubmit} submitLabel="Sign in" />
    </Fragment>
  )
}
