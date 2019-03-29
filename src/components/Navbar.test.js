import React from 'react'
import {Router} from 'react-router'
import Render from 'react-test-renderer'
import {renderToString} from 'react-dom/server'
import {createMemoryHistory} from 'history'
import {Navbar} from './Navbar'
import State from '../State'

it('renders links', () => {
  const navbar = renderToString(
    <State.Provider value={{user: null}}>
      <Router history={createMemoryHistory()}>
        <Navbar />
      </Router>
    </State.Provider>
  )
  console.log(navbar)
})
