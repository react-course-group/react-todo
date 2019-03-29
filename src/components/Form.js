import React from 'react'
import cn from 'classnames'
import {useInput} from '../hooks'

export const Form = ({onSubmit, submitLabel}) => {
  const email = useInput(x => x.match(/^\w+@\w+\.\w+$/) != null)
  const pass = useInput(x => x.length > 5)

  const submit = e => {
    e.preventDefault()
    if (email.isValid && pass.isValid)
      onSubmit({
        email: email.value,
        password: pass.value
      })
  }
  return (
    <form onSubmit={submit}>
      <input type="text" placeholder="Email" {...email} />
      <input type="password" placeholder="Password" {...pass} />
      <button
        type="submit"
        className={cn('inline-block m-2 p-2 text-white', {
          'bg-blue': email.isValid && pass.isValid,
          'bg-grey': !email.isValid || !pass.isValid
        })}
        disabled={!email.isValid || !pass.isValid}
      >
        {submitLabel}
      </button>
    </form>
  )
}
