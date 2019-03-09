import React from 'react'
import PropTypes from 'prop-types'
import {createPortal} from 'react-dom'

export function Alert(props) {
  return createPortal(
    <p className="absolute bg-red-lightest text-red border border-red pin-r pin-t mr-5 p-3">
      {props.content}
    </p>,
    document.getElementById('errors')
  )
}

Alert.propTypes = {
  content: PropTypes.string
}

Alert.defaultProps = {
  content: 'Some weird error!'
}
