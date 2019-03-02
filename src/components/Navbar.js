import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'

export function Navbar({user}) {
  return (
    <div className="bg-black mb-4">
      <div className="container mx-auto">
        <Link
          className="text-white inline-block p-4 no-underline hover:bg-blue"
          to="/"
        >
          Tasks
        </Link>
        <Link
          className="text-white inline-block p-4 no-underline hover:bg-blue"
          to="/about"
        >
          About
        </Link>
        {!user && (
          <Fragment>
            <Link
              className="text-white inline-block p-4 no-underline hover:bg-blue"
              to="/register"
            >
              Register
            </Link>
            <Link
              className="text-white inline-block p-4 no-underline hover:bg-blue"
              to="/login"
            >
              Login
            </Link>
          </Fragment>
        )}
        {user && (
          <Fragment>
            <a
              href="javascript:"
              className="text-white inline-block p-4 no-underline hover:bg-blue"
              onClick={() => {
                window.localStorage.setItem('token', '')
                window.location.reload()
              }}
            >
              Logout
            </a>
            <span className="text-white">{user.email}</span>
          </Fragment>
        )}
      </div>
    </div>
  )
}
