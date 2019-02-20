import React from 'react'

class Task extends React.Component {
  render() {
    return <div className="flex border-b border-grey-light">
      <p onClick={() => this.props.toggle(this.props.task.id)} className={`flex-grow text-grey-darkest p-3 cursor-pointer ${this.props.task.done ? 'line-through' : ''}`}>{this.props.task.content}</p>
      <span onClick={() => this.props.remove(this.props.task.id)} className="text-red cursor-pointer p-3">X</span>
    </div> 
  }
}

export default Task