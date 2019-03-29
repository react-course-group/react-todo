import React, {useContext} from 'react'
import {Redirect} from 'react-router-dom'
import {Form} from '../components'
import State from '../State'

export const Register = () => {
  const {user, api} = useContext(State)

  const handleSubmit = async ({email, password}) => {
    try {
      const res = await api.post('/users', {
        email,
        password
      })
      window.location.href = '/login'
    } catch (err) {
      console.error(err)
    }
  }

  if (user) return <Redirect to="/" />
  return (
    <div>
      <h2>Register</h2>
      <Form onSubmit={handleSubmit} submitLabel="Signup" />
    </div>
  )
}
