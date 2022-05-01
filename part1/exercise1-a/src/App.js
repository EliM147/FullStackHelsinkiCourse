const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Part = ({ name, exercises }) => {
    return (
      <p>
        {name} {exercises}
      </p>
    )
  }

  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(p => <Part key={p.name} {...p} />)}
      </div>
    )
  }

  const Total = ({ parts }) => {
    const total = parts.reduce((acc, p) => acc + p.exercises, 0)
    return (
      <p>
        Number of exercises {total}
      </p>
    )
  }
  
  const Header = ({ course }) => {
    return (
      <h1>
        {course.name}
      </h1>
    )
  }

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}


export default App