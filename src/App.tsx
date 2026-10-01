import './App.css'
import { Route, Routes } from 'react-router';
import { Login } from './routes/Login';
import { Home } from './routes/Home';
import { RequireAuth } from './auth/RequireAuth';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      </Routes>
    </>
  )
}

export default App
