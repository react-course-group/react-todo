import React from 'react'

export function Button({active, ...props}) {
  const bgStyle = active ? 'bg-blue' : 'bg-grey-dark'
  return <button
    {...props} 
    className={`text-white p-2 m-2 ${bgStyle}`} 
  />
}