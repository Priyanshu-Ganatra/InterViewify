import CreateProfile from './CreateProfile.jsx'
import Home from './Home.jsx'
import Leaderboard from './Leaderboard.jsx'
import Login from './Login.jsx'
import Quiz from './Quiz.jsx'
import Signup from './Signup.jsx'
import TestAdminPage from './TestAdminPage.jsx'
import WaitingPage from './WaitingPage.jsx'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from '@/context/AuthContext.jsx'
import { Navigate } from 'react-router-dom'

function App() {
  const { authUser } = useAuthContext()
  const isRegistered = authUser && authUser?.registrationDetails?.branch !== null

  return (
    <>
      <Routes>
        <Route path='/createProfile' element={authUser && !isRegistered ? <CreateProfile /> : authUser && isRegistered ? <Navigate to={'/'} /> : <Navigate to={'/login'} />}></Route>
        <Route path='/' element={authUser && isRegistered ? <Home /> : authUser && !isRegistered ? <Navigate to={'/createProfile'} /> : <Navigate to={'/login'} />} />
        <Route path='/login' element={authUser && isRegistered ? <Navigate to={'/'} /> : authUser && !isRegistered ? <Navigate to={'/createProfile'} /> : <Login />} />
        <Route path='/signup' element={authUser && isRegistered ? <Navigate to={'/'} /> : authUser && !isRegistered ? <Navigate to={'/createProfile'} /> : <Signup />} />
        <Route path='/leaderboard/:id' element={authUser && isRegistered ? <Leaderboard /> : authUser && !isRegistered ? <Navigate to={'/createProfile'} /> : <Navigate to={'/login'} />} />
        <Route path='/admin' element={authUser && isRegistered ? <TestAdminPage /> : authUser && !isRegistered ? <Navigate to={'/createProfile'} /> : <Navigate to={'/login'} />} />
        <Route path='/test/:id' element={authUser && isRegistered ? <Quiz /> : authUser && !isRegistered ? <Navigate to={'/createProfile'} /> : <Navigate to={'/login'} />} />
        <Route path='/waiting/:id' element={<WaitingPage/>}/>
      </Routes>
      <Toaster />
    </>
  )
}

export default App;
