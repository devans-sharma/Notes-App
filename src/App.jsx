import React from 'react'
import Navbar from './components/Navbar'
import CreateCard from './components/CreateCard'
import { useState } from 'react'
import ShowCard from './components/ShowCard'
import SideBar from './components/SideBar'

const App = () => {

   const [notes, setNotes] = useState([])


  
  return (
    <div className='bg-[#E8DCC4] h-screen w-full flex justify-center'>
      <div className='bg-[#F5F5DC] mx-10 my-5 rounded-4xl w-full overflow-auto'>
        <div className='flex flex-row'>
          <div className='w-1/8'>
          <SideBar />
        </div>
        <div className='flex flex-col w-7/8'>
          <Navbar />
          <CreateCard setNotes={setNotes} />
          <ShowCard notes={notes} />
        </div>
        </div>
        
    </div>
    </div>
  )
}

export default App