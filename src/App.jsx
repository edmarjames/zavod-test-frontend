// react imports
import { useState, useEffect } from 'react';
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
import { AppProvider } from './AppContext';
import AllNews from './components/AllNews';
import Logout from './components/Logout';
import NewsView from './components/NewsView';


function App() {

  const [user, setUser] = useState({
    username: null,
    isAdmin: false
  });

  const localStorageUsername = localStorage.getItem('username');
  const localStorageIsAdmin = localStorage.getItem('isAdmin');

  function getUserData(username, isAdmin) {
    if (username !== null && isAdmin !== null) {
      setUser({
        username: username,
        isAdmin: isAdmin
      })
    }
  };

  useEffect(() => {
    getUserData(localStorageUsername, localStorageIsAdmin);
  }, [localStorageUsername, localStorageIsAdmin]);

  return (
    <AppProvider value={{user, setUser}}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/news"/>}/>
          <Route path="/news" element={<AllNews/>}/>
          <Route path="/news/:newsId" element={<NewsView/>}/>
          <Route path="/logout" element={<Logout/>}/>
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
