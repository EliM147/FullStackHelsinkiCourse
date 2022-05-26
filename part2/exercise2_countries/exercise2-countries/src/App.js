import { useState, useEffect } from 'react'
import logo from './logo.svg';
import axios from 'axios'

import './App.css';


function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [countryNames, setCountryNames] = useState([])
  const [promiseFulfilled, setPromiseFulfilled] = useState(false)

  const countriesHook = () => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setPromiseFulfilled(true)
        setCountries(response.data)
        setCountryNames(response.data.map(country => country.name.common))
      })
  }
  
  useEffect(countriesHook, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  const FilterResults = ({ filter }) => {
    const filteredCountries = countryNames.filter(country => country.toLowerCase().includes(filter.toLowerCase()))
    if (filteredCountries.length === 0) {
      return (
        
        <>
          <br></br>
          no results
        </>
      )
    } else if (filteredCountries.length > 10) {
      return (
        <>
          <br></br>
          too many results
        </>
      )
    } else if (filteredCountries.length < 10 && filteredCountries.length > 1) {
    return (
      <>
        <Countries countries={filteredCountries} />
      </>
    ) 
    } else if (filteredCountries.length == 1) {
      return (
        <ExpandedCountryInfo country={filteredCountries[0]} />
      )
    }
  }

  const ExpandedCountryInfo = ({ country }) => {
    const ExpandedCountryID = countryNames.indexOf(country)
    
    const MapLanguages = () => {
      const languages = Object.values(countries[ExpandedCountryID].languages)
      return (
        <>
          <h2>Languages:</h2>
          <ul>
            {languages.map(language =>
              <li key={language}>{language}</li>
            )}
          </ul>
        </>
      )
    }
    return (
      <>
        <h1>{country}</h1>
        <p>capital: {countries[ExpandedCountryID].capital}</p>
        <p>population: {countries[ExpandedCountryID].population}</p>
        <MapLanguages/>
        <img src={countries[ExpandedCountryID].flags.png} alt={country} />
      </>
    )
  }

  const Countries = ({ countries }) => {
    return (
      <>
        <ul>
          {countries.map(country =>
            <Country key={country} country={country} />
          )}
        </ul>
      </>
    )
  }

  const Country = ({ country }) => {
    return (
      <li>
        {country}
      </li>
    )
  }

    
  const FilterOutcome = ({filter}) => {
    if (promiseFulfilled) {
      if (filter === '') {
        return (
          <>
            <br></br>
            start typing...
          </>
        )
      } else if (filter.length !== 0) {
        
          return (
            <>
              <FilterResults countries={countries} filter={filter} />
            </>
          )
      } else {
        return (
          <>
          <br></br>
          nothing found
          </>
        )
      }
    } else {
      return (
        <>
        <br></br>
        loading countries...
        </>
      )
    }
  }
  

  return (
    <div>
      <h2>Countries</h2>
      <input value={filter} onChange={handleFilterChange} />
      <FilterOutcome filter={filter} />
    </div>
  );
}

export default App;
