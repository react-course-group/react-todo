import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {render, wait, fireEvent, cleanup} from 'react-testing-library'
import State from '../State'
import {Login} from './Login'

const renderWithState = state => {
  const history = createMemoryHistory()
  history.push('/')
  const result = render(
    <State.Provider value={state}>
      <Router history={history}>
        <Login />
      </Router>
    </State.Provider>
  )
  return {history, ...result}
}

describe('pages > Login', () => {
  afterEach(cleanup)

  test('it redirects to /tasks/all if the user is already connected', () => {
    const {history} = renderWithState({user: {username: 'me'}})
    expect(history.location.pathname).toBe('/tasks/all')
  })

  test('it sets the document title', async () => {
    renderWithState({user: null})
    await wait(() => {
      expect(document.title).toContain('Login')
    })
  })

  test('it send email/pass to api and set the token', async () => {
    let calledURI = null
    let sentData = null
    const api = {
      post: async (uri, data) => {
        calledURI = uri
        sentData = data
        return {data: {token: 'foobar'}}
      }
    }
    const {container, getByPlaceholderText, getByText} = renderWithState({
      user: null,
      api
    })
    fireEvent.change(getByPlaceholderText('Email'), {target: {value: 'me@email.com'}})
    fireEvent.change(getByPlaceholderText('Password'), {target: {value: 'mypass'}})
    const submitBtn = getByText('Sign in')
    await wait(() => {
      expect(submitBtn.disabled).toBe(false)
    })
    fireEvent.click(submitBtn)
    expect(calledURI).toBe('/login')
    expect(sentData).toEqual({
      email: 'me@email.com',
      password: 'mypass'
    })
    await wait(() => {
      expect(window.localStorage.getItem('token')).toBe('foobar')
    })
  })
})
