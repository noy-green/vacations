import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Vacations from './components/Vacations';
import Edit from './components/Edit';
import Add from './components/Add';
import Reports from './components/Reports';
import { useDispatch } from 'react-redux'
import jwt_decode from "jwt-decode";



function App() {
  const dispatch = useDispatch()



  useEffect(() => {
    (async () => {
      let token = localStorage.token
      let time = localStorage.time
      if (token && time) {
        if (((Date.now() - time) < 600000)) {
          let { id, role, fname } = jwt_decode(token)
          dispatch({ type: "LOGIN", payload: { id, role, fname } })
        }
        else {
          let { id, role, fname } = jwt_decode(token)
          dispatch({ type: "LOGOUT" })
        }
      }


    })()


  }, [])


  return (
    <Router>
      <div className="App">
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/vacations" component={Vacations} />
        <Route path="/edit/:id" component={Edit} />
        <Route path="/add" component={Add} />
        <Route path="/reports" component={Reports} />
      </div>

    </Router>
  )
}

export default App;
