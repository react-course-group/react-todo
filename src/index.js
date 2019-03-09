import React from 'react'
import ReactDOM from 'react-dom'
import {createAPI} from './services/api'
import {createBrowserHistory} from 'history'
import App from './App'

const api = createAPI('http://todo-api.webneat.net', () => ({
  Authorization: 'Bearer ' + window.localStorage.getItem('token')
}))

ReactDOM.render(
  <App api={api} history={createBrowserHistory()} />,
  document.getElementById('root')
)
