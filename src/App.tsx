import './App.css'
import { Route, Routes } from 'react-router';
import { Login } from './routes/Login';
import { Home } from './routes/Home';
import { NewLift } from './routes/NewLift';
import { NewRun } from './routes/NewRun';
import { RequireAuth } from './auth/RequireAuth';

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/activities/new/lift" element={<RequireAuth><NewLift /></RequireAuth>} />
        <Route path="/activities/new/run" element={<RequireAuth><NewRun /></RequireAuth>} />
      </Routes>
    </>
  )
}

export default App
