import React from 'react'

const ShowCard = ({ notes }) => {
  return (
    <div className='bg-red-300 mt-3 mr-6 p-6 rounded-4xl h-55 flex flex-row overflow-x-auto gap-2'>
      {notes.map((note, index) => {
        return (
          <div key={index} className='bg-white w-40 shrink-0 p-2 rounded-2xl flex flex-col items-start gap-2'>
            <h1 className='text-xl font-bold'>{note.title}</h1>
            <p className='text-xs'>{note.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ShowCard;