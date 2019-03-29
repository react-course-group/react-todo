import React, {Fragment} from 'react'
import {Router, Route, Redirect} from 'react-router-dom'
import {Home, About, Register, Login} from './pages'
import {Navbar} from './components'
import {Container, Notice} from './Theme'
import State from './State'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      hasError: false
    }
  }

  static getDerivedStateFromError(error) {
    return {hasError: true}
  }

  componentDidCatch(error, info) {
    console.log(error, info)
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
    const {user, hasError} = this.state
    const context = {api, user}
    if (hasError) return <Notice error>Some error happened</Notice>
    return (
      <State.Provider value={context}>
        <Router history={history}>
          <Fragment>
            <Navbar />
            <Container>
              <Route
                exact
                path="/"
                render={() => <Redirect to="/tasks/all" />}
              />
              <Route path="/tasks/:filter" component={Home} />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/register"
                render={() => <Register user={this.state.user} api={api} />}
              />
              <Route exact path="/login" component={Login} />
            </Container>
          </Fragment>
        </Router>
      </State.Provider>
    )
  }
}

export default App
