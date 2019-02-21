import React, {Component} from 'react';
import Task from '../components/Task'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      filter: 'all',
      tasks: [],
      filteredTasks: []
    }

    this.update = this.update.bind(this)
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
    this.toggle = this.toggle.bind(this)
    this.selectFilter = this.selectFilter.bind(this)
  }

  componentDidMount() {
    fetch('http://localhost:3001/tasks')
    .then(res => res.json())
    .then(tasks => {
      console.log('initial tasks', tasks)
      this.setState({tasks, filteredTasks: tasks})
    })
  }

  update(event) {
    this.setState({text: event.target.value})
  }

  add(event) {
    if (event.key == 'Enter') {
      const task = {
        id: this.state.nextId,
        content: this.state.text
      }      
      this.setState({
        tasks: this.state.tasks.concat([task]),
        text: '',
        nextId: this.state.nextId + 1
      })
    }
  }

  remove(id) {
    console.log('Removing', id)
    const tasks = this.state.tasks.filter(task => task.id != id)
    console.log('Tasks after remove', tasks)
    this.setState({tasks})
  }

  toggle(id) {
    const tasks = this.state.tasks.map(task => {
      if (task.id == id) task.done = !task.done
      return task
    })
    this.setState({tasks})
  }

  selectFilter(filter) {
    let predicate = task => true
    if (filter == 'done') predicate = task => task.done
    if (filter == 'undone') predicate = task => !task.done
    const filteredTasks = this.state.tasks.filter(predicate)
    this.setState({filter, filteredTasks})
  }

  render() {
    return (
      <div>
        <input className="block w-full my-5 p-3 border-b-2 border-b-grey focus:border-blue" placeholder="What to do?" type="text" value={this.state.text} onChange={this.update} onKeyUp={this.add} />
        <Button active={this.state.filter == 'all'} onClick={() => this.selectFilter('all')}>All</Button>
        <Button active={this.state.filter == 'done'} onClick={() => this.selectFilter('done')}>Done</Button>
        <Button active={this.state.filter == 'undone'} onClick={() => this.selectFilter('undone')}>Undone</Button>
        {this.state.filteredTasks.map(task => <Task key={task.id} task={task} remove={this.remove} toggle={this.toggle} />)}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const bgStyle = this.props.active ? 'bg-blue' : 'bg-grey-dark'
    return <button onClick={this.props.onClick} className={`text-white p-2 m-2 ${bgStyle}`}>{this.props.children}</button>
  }
}


export default Home
