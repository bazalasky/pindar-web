import './App.css'
import { Route, Routes } from 'react-router';
import { Login } from './routes/Login';
import { Home } from './routes/Home';
import { NewLift } from './routes/NewLift';
import { RequireAuth } from './auth/RequireAuth';

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/activities/new/lift" element={<RequireAuth><NewLift /></RequireAuth>} />
      </Routes>
    </>
  )
}

export default App
