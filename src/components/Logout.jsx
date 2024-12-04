import React, { useContext, useEffect }  from 'react'

import { Navigate } 					from 'react-router-dom';

import AppContext 						from '../AppContext';


export default function Logout() {

  const { setUser } = useContext(AppContext);

  useEffect(() => {
    setUser({
        username: null,
        isAdmin: false
    });
    localStorage.clear();
});

  return (
    <Navigate to="/" />
  )
}
