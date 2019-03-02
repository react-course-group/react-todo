import React from 'react'
import cn from 'classnames'

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    }

    this.emailChanged = this.emailChanged.bind(this)
    this.passwordChanged = this.passwordChanged.bind(this)
    this.submit = this.submit.bind(this)
  }

  emailChanged(e) {
    const value = e.target.value
    const isValid = value.match(/^\w+@\w+\.\w+$/) != null
    this.setState({email: {value, isValid}})
  }

  passwordChanged(e) {
    const value = e.target.value
    const isValid = value.length > 5
    this.setState({password: {value, isValid}})
  }

  submit(e) {
    e.preventDefault()
    if (this.state.email.isValid && this.state.password.isValid)
      this.props.onSubmit({
        email: this.state.email.value,
        password: this.state.password.value
      })
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <input
          type="text"
          onChange={this.emailChanged}
          value={this.state.email.value}
          placeholder="Email"
          className={cn('block my-5 p-3 border-b-2', {
            'border-b-grey focus:border-blue': this.state.email.isValid,
            'border-red bg-red-lightest': !this.state.email.isValid
          })}
        />
        <input
          type="password"
          onChange={this.passwordChanged}
          value={this.state.password.value}
          placeholder="Password"
          className={cn('block my-5 p-3 border-b-2', {
            'border-b-grey focus:border-blue': this.state.password.isValid,
            'border-red bg-red-lightest': !this.state.password.isValid
          })}
        />
        <button
          type="submit"
          className={cn('inline-block m-2 p-2 text-white', {
            'bg-blue': this.state.email.isValid && this.state.password.isValid,
            'bg-grey': !this.state.email.isValid || !this.state.password.isValid
          })}
          disabled={!this.state.email.isValid || !this.state.password.isValid}
        >
          {this.props.submitLabel}
        </button>
      </form>
    )
  }
}

export {Form}
