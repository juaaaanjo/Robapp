import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRouter from './routes/router/Router'
import { Provider } from 'react-redux'
import store from './redux/store/store'

function App() {


  return (
    <Provider store={store}>
     <AppRouter />
  </Provider>
 
  )
}

export default App
