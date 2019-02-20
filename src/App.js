import React from 'react'
import {Router, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Navbar from './components/Navbar'
import {createBrowserHistory} from 'history'

class App extends React.Component {
  render() {
    return (
      <Router history={createBrowserHistory()}>
        <div>
          <Navbar />
          <div className="container mx-auto">
            <Route exact={true} path="/" component={Home} />
            <Route exact path="/about" component={About} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App