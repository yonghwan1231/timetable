import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import { Timetable } from '@pages'

function App() {
  const routes = [
    { path: '/', element: <Link to="/timetable">과제 바로가기</Link> },
    { path: '/timetable', element: <Timetable /> },
  ]

  return (
    <Routes>
      {routes.map((route, key) => (
        <Route key={key} {...route} />
      ))}
    </Routes>
  )
}

export default App
