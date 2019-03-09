import React from 'react'
import PropTypes from 'prop-types'
import {createPortal} from 'react-dom'
import {Notice} from '../Theme'

export function Alert(props) {
  return createPortal(
    <Notice error>{props.content}</Notice>,
    document.getElementById('errors')
  )
}

Alert.propTypes = {
  content: PropTypes.string.isRequired
}
