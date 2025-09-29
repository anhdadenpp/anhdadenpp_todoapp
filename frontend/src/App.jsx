import {Toaster} from 'sonner'
import {BrowserRouter , Route, Routes} from 'react-router'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
 
  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>   
      </BrowserRouter>
    </>
  )
}

export default App
