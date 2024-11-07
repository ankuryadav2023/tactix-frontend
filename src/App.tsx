import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './redux/store'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Game from './components/Game'

function App() {
  const { socket } = useSelector((states: RootState) => states);
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket === null) {
      dispatch({
        type: 'INITIALIZE_SOCKET'
      })
    }
  }, [socket])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/:roomID/:usertype' element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
