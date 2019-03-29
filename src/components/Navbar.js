import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import dye from 'react-dye'
import State from '../State'

export function Navbar() {
  const {user} = React.useContext(State)
  return (
    <NavbarConatiner>
      <LinksContainer>
        <NavLink to="/">Tasks</NavLink>
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
      </LinksContainer>
    </NavbarConatiner>
  )
}

const NavbarConatiner = dye('bg-black mb-4')
const LinksContainer = dye('container mx-auto', 'div')
const NavLink = dye(
  'text-white inline-block p-4 no-underline hover:bg-blue',
  Link
)
