import React from 'react'

export function Alert(props) {
  return <div className="flex border-b border-red">
    <p className={`flex-grow text-red p-3`}>{props.text}</p>
    <span onClick={() => props.dismiss()} className="text-red cursor-pointer p-3">X</span>
  </div> 
}
