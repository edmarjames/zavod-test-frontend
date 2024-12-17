// react imports
import { useState, useEffect }              from 'react';

// external imports
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
}                                           from 'react-router-dom';

// internal imports
import { AppProvider }                      from './AppContext';
import AllNews                              from './components/AllNews';
import Logout                               from './components/Logout';
import NewsView                             from './components/NewsView';
import ErrorPage                            from './components/ErrorPage';


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
          <Route path='/' element={<Navigate to='/news'/>}/>
          <Route path='/news' element={<AllNews/>}/>
          <Route path='/news/:newsId' element={<NewsView/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path='*' element={<ErrorPage/>}/>
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
