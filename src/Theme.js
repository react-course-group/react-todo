import cn from 'classnames'
import dye from 'react-dye'
import {Link} from 'react-router-dom'

export const Container = dye('container mx-auto')

export const Title = dye('text-grey-darkest', 'h2')

export const Notice = dye(
  props =>
    cn('border rounded-lg p-3', {
      'bg-green-lightest text-green-darker border-green': props.success,
      'bg-blue-lightest text-blue-darker border-blue': props.info,
      'bg-orange-lightest text-orange-darker border-orange': props.warning,
      'bg-red-lightest text-red-darker border-red': props.error,
      'bg-grey-lightest text-grey-darkest border-grey': !(
        props.success ||
        props.info ||
        props.warning ||
        props.error
      )
    }),
  'p',
  'success',
  'info',
  'warning',
  'error'
)

export const Button = dye(
  props =>
    cn('text-white p-2 m-2', {
      'bg-blue': props.active,
      'bg-grey-dark': !props.active
    }),
  'button',
  'active'
)

export const ButtonLink = dye(
  props =>
    cn('text-white p-2 m-2 no-underline', {
      'bg-blue': props.active,
      'bg-grey-dark': !props.active
    }),
  Link,
  'active'
)

