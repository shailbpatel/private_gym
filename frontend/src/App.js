import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
 
  
function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/"  element={<Dashboard/>} />
          <Route path="/register"  element={<Register/>} />
          <Route path="/login"  element={<Login/>} />
      </Routes>
    </Router>
  );
}
  
export default App;