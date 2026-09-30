import React from 'react'

const Navbar = () => {
  return (
    <div className='h-20 flex flex-row p-5 justify-between items-center mt-1'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-3xl font-serif'>
          Hi, Amanda!
        </h1>
        <p className='text-xs'>
          Lets take a look at your activity today
        </p>
      </div>

      <div className='flex flex-row gap-3'>
        <input type="text" placeholder='Search for pending notes' 
        className='bg-white h-10 p-3 text-black outline-none rounded-4xl' />

        <button className='bg-black text-white p-2 rounded-3xl w-30'>
          Upgrade
        </button>
      </div>
      
    </div>
  )
}

export default Navbar