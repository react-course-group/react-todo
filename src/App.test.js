import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {createMemoryHistory} from 'history'
import {mockAPI} from './services/api'

const x = 5

it('renders without crashing', () => {
  expect(x).toEqual(5)
})
