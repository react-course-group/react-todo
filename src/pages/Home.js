import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Alert, Task} from '../components'
import {ButtonLink} from '../Theme'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
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
    return true
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

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
    const {filter} = this.props.match.params
    if (filter == 'done') predicate = task => task.done
    if (filter == 'undone') predicate = task => !task.done
    return this.state.tasks.filter(predicate)
  }

  render() {
    if (!this.props.user) {
      return <Redirect to="/login" />
    }

    const {filter} = this.props.match.params
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
        <ButtonLink active={filter == 'all'} to="/tasks/all">
          All
        </ButtonLink>
        <ButtonLink active={filter == 'done'} to="/tasks/done">
          Done
        </ButtonLink>
        <ButtonLink active={filter == 'undone'} to="/tasks/undone">
          Undone
        </ButtonLink>
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
