import { useState } from 'react'
import Oauth from './components/Oauth';
import './App.css'

function App() {
  const handleLoginClick = () => {
    window.location.href = "http://localhost:8080/login";
  };

  return (
    <div>
      <h1>Chatroom</h1>
      <button onClick={handleLoginClick}>Login</button>
      <Oauth />
    </div>
  );
}

export default App
