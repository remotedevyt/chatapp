import { useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import { Nopage } from './pages/Nopage';
import { Auth } from './pages/Auth';
import AuthProvider from './context/authProvider';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/auth' element={<Auth />} />
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
