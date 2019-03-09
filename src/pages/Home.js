import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Alert, Task} from '../components'
import {ButtonLink} from '../Theme'
import State from '../State'

export const Home = ({match}) => {
  const {api, user} = React.useContext(State)
  const [error, setError] = React.useState('')
  const [state, setState] = React.useState({text: '', tasks: []})
  const tasksCollection = api.collection('/tasks')
  const load = async () => {
    if (user) {
      try {
        const res = await tasksCollection.find({
          author: user.id
        })
        setState({...state, tasks: res.items})
      } catch (error) {
        setError(JSON.stringify(error))
      }
    }
  }
  React.useEffect(() => {
    load()
  }, [])

  let predicate = task => true
  const {filter} = match.params
  if (filter == 'done') predicate = task => task.done
  if (filter == 'undone') predicate = task => !task.done
  const filteredTasks = state.tasks.filter(predicate)

  const add = async ({key}) => {
    if (key == 'Enter') {
      try {
        const addedTask = await tasksCollection.add({
          author: user.id,
          content: state.text,
          done: false
        })
        setState({
          text: '',
          tasks: state.tasks.concat([addedTask])
        })
      } catch (error) {
        setError(`Error while adding task!`)
      }
    }
  }

  const update = ({target: {value}}) => {
    setState({...state, text: value})
  }

  const remove = id => {
    tasksCollection
      .destroy(id)
      .then(() => {
        const tasks = state.tasks.filter(task => task.id != id)
        setState({...state, tasks})
      })
      .catch(() => setError(`Error removing task ${id}`))
  }

  const toggle = id => {
    const task = state.tasks.filter(x => x.id == id)[0]
    if (!task) {
      return setError(`No task with id ${id}`)
    }
    tasksCollection
      .edit(id, {
        done: !task.done
      })
      .then(() => {
        const tasks = state.tasks.map(task => {
          if (task.id == id) task.done = !task.done
          return task
        })
        setState({...state, tasks})
      })
      .catch(() => setError(`Error while adding task!`))
  }

  if (!user) return <Redirect to="/login" />
  return (
    <div>
      {error && <Alert text={error} dismiss={() => setError('')} />}
      <input
        className="block w-full my-5 p-3 border-b-2 border-b-grey focus:border-blue"
        placeholder="What to do?"
        type="text"
        value={state.text}
        onChange={update}
        onKeyUp={add}
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
      {filteredTasks.map(task => (
        <Task key={task.id} task={task} remove={remove} toggle={toggle} />
      ))}
    </div>
  )
}
