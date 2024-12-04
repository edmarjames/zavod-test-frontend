// react imports
import { useState } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// external imports
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
}     from 'react-router-dom';

// internal imports
import AllNews from './components/AllNews';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/news" />} />
        <Route path="/news" element={<AllNews />} />
      </Routes>
    </Router>

  )
}

export default App
