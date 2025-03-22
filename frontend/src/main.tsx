import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="bg-[url('../public/Login.png')] bg-cover bg-center bg-no-repeat min-h-screen">
    <App />
  </div>
)
