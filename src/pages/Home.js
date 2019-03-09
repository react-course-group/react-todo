import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Button, Alert, Task} from '../components'

class Home extends Component {
  constructor(props) {
    console.log('constructor', arguments)
    super(props)
    this.state = {
      text: '',
      filter: 'all',
      tasks: [],
      error: ''
    }

    this.tasksCollection = this.props.api.collection('/tasks')

    this.update = this.update.bind(this)
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
    this.toggle = this.toggle.bind(this)
    this.selectFilter = this.selectFilter.bind(this)
  }

  async componentDidMount() {
    console.log('componentDidMount', arguments)
    if (this.props.user) {
      try {
        const res = await this.tasksCollection.find({
          author: this.props.user.id
        })
        this.setState({tasks: res.items})
      } catch (error) {
        this.setState({error: JSON.stringify(error)})
      }
    }
  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdate', arguments)
    return true
  }

  componentDidUpdate() {
    console.log('componentDidUpdate', arguments)
  }

  componentWillUnmount() {
    console.log('componentWillUnmount', arguments)
  }

  update(event) {
    this.setState({text: event.target.value})
  }

  async add(event) {
    if (event.key == 'Enter') {
      try {
        const addedTask = await this.tasksCollection.add({
          author: this.props.user.id,
          content: this.state.text,
          done: false
        })
        this.setState({
          text: '',
          tasks: this.state.tasks.concat([addedTask])
        })
      } catch (error) {
        this.setState({error: `Error while adding task!`})
      }
    }
  }

  remove(id) {
    this.tasksCollection
      .destroy(id)
      .then(() => {
        const tasks = this.state.tasks.filter(task => task.id != id)
        this.setState({tasks})
      })
      .catch(() => this.setState({error: `Error removing task ${id}`}))
  }

  toggle(id) {
    const task = this.state.tasks.filter(x => x.id == id)[0]
    if (!task) {
      return this.setState({error: `No task with id ${id}`})
    }
    this.tasksCollection
      .edit(id, {
        done: !task.done
      })
      .then(() => {
        const tasks = this.state.tasks.map(task => {
          if (task.id == id) task.done = !task.done
          return task
        })
        this.setState({tasks})
      })
      .catch(() => this.setState({error: `Error while adding task!`}))
  }

  selectFilter(filter) {
    this.setState({filter})
  }

  filteredTasks() {
    let predicate = task => true
    if (this.state.filter == 'done') predicate = task => task.done
    if (this.state.filter == 'undone') predicate = task => !task.done
    return this.state.tasks.filter(predicate)
  }

  render() {
    console.log('render', arguments)
    if (!this.props.user) {
      return <Redirect to="/login" />
    }

    return (
      <div>
        {this.state.error && (
          <Alert
            text={this.state.error}
            dismiss={() => this.setState({error: ''})}
          />
        )}
        <input
          className="block w-full my-5 p-3 border-b-2 border-b-grey focus:border-blue"
          placeholder="What to do?"
          type="text"
          value={this.state.text}
          onChange={this.update}
          onKeyUp={this.add}
        />
        <Button
          active={this.state.filter == 'all'}
          onClick={() => this.selectFilter('all')}
        >
          All
        </Button>
        <Button
          active={this.state.filter == 'done'}
          onClick={() => this.selectFilter('done')}
        >
          Done
        </Button>
        <Button
          active={this.state.filter == 'undone'}
          onClick={() => this.selectFilter('undone')}
        >
          Undone
        </Button>
        {this.filteredTasks().map(task => (
          <Task
            key={task.id}
            task={task}
            remove={this.remove}
            toggle={this.toggle}
          />
        ))}
      </div>
    )
  }
}

export {Home}
