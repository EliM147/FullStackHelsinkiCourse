import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './App.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notificationMessage">
      {message}
    </div>
  )
}


const Person = ({ person, deletePerson }) => {
  return (
    <li>{person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button></li>
  )
}

const Persons = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map(person =>
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      )}
    </ul>
  )
}

const Filter = ({ filter, setFilter }) => {
  return (
    <>
      <form>
        <div>
          filter shown with <input value={filter} onChange={(event) => setFilter(event.target.value)} />
        </div>
      </form>
    </>
  )
}

const FilterResults = ({ persons, filter, deletePerson }) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <>
      <Persons persons={filteredPersons} deletePerson={deletePerson}/>
    </>
  )
}

const PhonebookOutcome = ({persons, filter, deletePerson}) => {
  if (filter === '') {
    return (
      <>
        <Persons persons={persons} deletePerson={deletePerson}/>
      </>
    )
  } else {
    return (
      <>
      <FilterResults persons={persons} filter={filter} deletePerson={deletePerson}/>
      </>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [message, setMessage] = useState(null)
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  
  const AddPerson = (event) => {
    event.preventDefault()
    if (newName === '' || newNumber === '') {
      setMessage('Name and number are required')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      return
    }
    if (persons.find(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        setMessage(`${newName} has been updated`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        const person = persons.find(person => person.name === newName)
        const changedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
          })
      }
    } else {
      const person = {
        name: newName,
        number: newNumber,
        id: persons.slice(-1)[0].id +1
      }
      setMessage(`${newName} has been added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      personService
        .create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
    }
    setNewName('')
    setNewNumber('')
  }

    

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      setMessage(`${person.name} has been deleted`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      personService
        .del(person.id)
        .then(returnedPerson => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => {
          setMessage(`Information of ${person.name} has already been removed from server`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }


  return (
    <div>
      
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} setFilter={setFilter} deletePerson={deletePerson}/>
      <form>
        <h1>add a new</h1>
        <div>
          name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
        </div>
        <div>
          telephone: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} />
        </div>
        <div>
          <button type="submit" onClick={AddPerson}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <PhonebookOutcome persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App