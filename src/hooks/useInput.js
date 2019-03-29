import React from 'react'
import cn from 'classnames'

export const useInput = (validate, value = '') => {
  const [data, setData] = React.useState({
    value: '',
    isValid: false
  })
  const onChange = e => {
    const value = e.target.value
    const isValid = validate(value)
    setData({value, isValid})
  }
  return {
    onChange,
    value: data.value,
    className: cn('block my-5 p-3 border-b-2', {
      'border-b-grey focus:border-blue': data.isValid,
      'border-red bg-red-lightest': !data.isValid
    })
  }
}
