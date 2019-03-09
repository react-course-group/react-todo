import React, {Fragment} from 'react'
import {Router, Route} from 'react-router-dom'
import {Home, About, Register, Login} from './pages'
import {Navbar} from './components'
import {Container} from './Theme'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const {data} = await this.props.api.get('/me')
        this.setState({user: data})
      } catch (err) {
        console.log('Auth error', err)
        localStorage.setItem('token', '')
        this.setState({user: null})
      }
    }
  }

  render() {
    const {api, history} = this.props
    return (
      <Router history={history}>
        <Fragment>
          <Navbar user={this.state.user} />
          <Container>
            <Route
              exact={true}
              path="/"
              render={() => <Home user={this.state.user} api={api} />}
            />
            <Route exact path="/about" component={About} />
            <Route
              exact
              path="/register"
              render={() => <Register user={this.state.user} api={api} />}
            />
            <Route
              exact
              path="/login"
              render={() => <Login user={this.state.user} api={api} />}
            />
          </Container>
        </Fragment>
      </Router>
    )
  }
}

export default App
