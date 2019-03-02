import React from 'react'

export function Task({task, remove, toggle}) {
  return <div className="flex border-b border-grey-light">
    <p onClick={() => toggle(task.id)} className={`flex-grow text-grey-darkest p-3 cursor-pointer ${task.done ? 'line-through' : ''}`}>{task.content}</p>
    <span onClick={() => remove(task.id)} className="text-red cursor-pointer p-3">X</span>
  </div> 
}