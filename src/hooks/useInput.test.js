import React from 'react'
import {render, act, cleanup, wait} from 'react-testing-library'
import {useInput} from './useInput'

const use = (...args) => {
  let result = null
  const Wrapper = () => {
    result = useInput(...args)
    return null
  }
  render(<Wrapper />)
  return () => result
}

describe('hooks > useInput', () => {
  test('it returns an input', () => {
    const input = use(x => true, 'foo')
    expect(input()).toMatchObject({
      value: 'foo',
      isValid: false
    })
  })
  test('it validates the value', () => {
    const input = use(x => x.length > 3)
    expect(input()).toMatchObject({
      value: '',
      isValid: false
    })
    act(() => {
      input().onChange({target: {value: 'a'}})
    })
    expect(input()).toMatchObject({
      value: 'a',
      isValid: false
    })
    act(() => {
      input().onChange({target: {value: 'abcd'}})
    })
    expect(input()).toMatchObject({
      value: 'abcd',
      isValid: true
    })
  })
})
