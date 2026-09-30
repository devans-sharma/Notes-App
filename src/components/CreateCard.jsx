import React from 'react'
import { useState } from 'react'
import Calendar from 'react-calendar'
import "react-calendar/dist/Calendar.css"

function CreateCard({setNotes}) {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
   
    const submitHandler = (e) =>{

        const newNote = {
            title, 
            description
        }

        setNotes(prev => [
            ...prev,
            {
                title,
                description,
            }
    ]);
        e.preventDefault()
        console.log('form submitted')

        setTitle('')
        setDescription('')
    }    

    return (
        
        <div className='flex flex-row mt-5 gap-5 pr-6 h-75'>
            <div className='flex p-4 bg-[#E8DCC4] w-2/3 rounded-4xl flex-row items-center justify-center'>
                <form className='flex flex-col gap-3 h-50 justify-center items-center'
                    onSubmit={(e)=>{
                        submitHandler(e)
                    }}>
                    <h1 className='text-3xl'>New Work?</h1>
                    <input type="text" placeholder='Enter Heading' className='outline-none border-2 w-100 px-2 py-1 rounded-2xl' value={title} onChange={(e)=>{
                        setTitle(e.target.value)
                    }}/>
                    <textarea placeholder='Enter Details outline-none' className='outline-none border-2 w-100 px-2 py-1 rounded-2xl h-50' value={description} onChange={(e)=>{
                        setDescription(e.target.value)
                    }}></textarea>
                    <button className='bg-white w-40 h-10 rounded-4xl'>Add Note</button>
                </form>
            </div>

            <div className=''>
                <Calendar />
            </div>
        </div>
        
        
    )
}

export default CreateCard