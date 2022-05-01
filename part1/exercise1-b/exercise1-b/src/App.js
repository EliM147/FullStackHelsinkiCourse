import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticsRowElement = (props) => (
  <tr>
    <td>{props.text} {props.value}</td>
  </tr>
)

const Statistics = (props) => {
  const { good, neutral, bad } = props.statistics
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = good / total * 100
  if (total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
      <table>
        <tbody>
          <StatisticsRowElement text='good' value={good} />
          <StatisticsRowElement text='neutral' value={neutral} />
          <StatisticsRowElement text='bad' value={bad} />
          <StatisticsRowElement text='all' value={total} />
          <StatisticsRowElement text='average' value={average} />
          <StatisticsRowElement text='positive' value={positive} />
        </tbody>
      </table>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <h1>Statistics</h1>
      <Statistics statistics={{good, neutral, bad}} />
    </div>
  )
}

export default App