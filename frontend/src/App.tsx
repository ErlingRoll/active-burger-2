import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Gamescreen from './views/gamescreen/gamescreen'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Gamescreen />
    </div>
  )
}

export default App
