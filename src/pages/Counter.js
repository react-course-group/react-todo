import React, {Fragment} from 'react'
import {Button, Notice} from '../Theme'

export const Counter = () => {
  const [counter, setState] = React.useState(5)
  const increment = () => setState(counter + 1)
  const decrement = () => setState(counter - 1)
  return (
    <Fragment>
      <Notice>{counter}</Notice>
      <Button onClick={increment}>+</Button>
      <Button onClick={decrement}>-</Button>
    </Fragment>
  )
}
