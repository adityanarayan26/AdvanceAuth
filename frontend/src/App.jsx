import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import FloatingShape from './components/FloatingShape'

const App = () => {

  return (
    <div className='h-screen w-full relative bg-gradient-to-br  from-slate-800 to-green-700 flex justify-center items-center overflow-hidden'>

      <FloatingShape color='bg-green-800' size='w-32 h-32' y='300' x='30' top='0%' left='-3%'  delay='1' duration='10' />
      <FloatingShape  color='bg-green-800' y='100' x='100' size='w-72 h-72' top='-5%' left='25%'  delay='2' duration='5'/>
      <FloatingShape color='bg-slate-800' size='w-40 h-40' y='-30' x='-500' top='95%' left='90%' delay='1' duration='10'/>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App