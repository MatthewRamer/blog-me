import { useState } from 'react'
import Oauth from './components/Oauth';
import './App.css'

function App() {

  return (
    <div>
      <h1>Chatroom</h1>
      <h2>Login</h2>
      <Oauth />
    </div>
  );
}

export default App
