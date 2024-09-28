import { useState } from 'react'
import './App.css'
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom'
import Signup from './assets/Components/SignUp'
import Signin from './assets/Components/SignIn'
import Home from './assets/Components/Home'
import AppBar from './assets/Components/AppBar'
import AddCourse from './assets/Components/AddCourse'
import Course from './assets/Components/Course'



function App() {
  

  return (
    <>
    
    <Router>
      <AppBar/>
      <Routes>
          <Route path = '/' element = {<Home/>}></Route>
          <Route path='/Signin'element={<Signin/>}></Route>
          <Route path='/SignUp'element={<Signup/>}></Route>
          <Route path='/addCourses'element={<AddCourse/>}></Route>
          <Route path='/course/:courseId' element={<Course/>}></Route>
          
      </Routes>
    </Router> 
    
    </>
  )
}

export default App
