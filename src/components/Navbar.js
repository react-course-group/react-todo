import React from 'react'
import {Link} from 'react-router-dom'

class Navbar extends React.Component {
  render() {
    return (
      <div className="bg-black mb-4">
        <div className="container mx-auto">
          <Link className="text-white inline-block p-4 no-underline hover:bg-blue" to="/">Tasks</Link>
          <Link className="text-white inline-block p-4 no-underline hover:bg-blue" to="/about">About</Link>
        </div>
      </div>
    )
  }
}

export default Navbar