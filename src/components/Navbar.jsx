import React from 'react'

const Navbar = ({ searchQuery, onSearch, searchInputRef }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="flex flex-col sm:flex-row gap-3 px-5 py-4 justify-between items-start sm:items-center max-w-6xl mx-auto w-full">
      {/* Title & Date */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <h1 className="text-xl font-bold text-[#1D1D1B] tracking-tight">
          Notes Dashboard
        </h1>
        <p className="text-xs text-[#6F6B63] font-medium">{today}</p>
      </div>

      {/* Global Search Bar */}
      <div className="relative w-full sm:w-72">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#99938A] pointer-events-none"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search by title, description, or category…"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search notes"
          className="bg-white h-9.5 pl-9 pr-8 text-xs text-[#1D1D1B] placeholder-[#99938A] outline-none rounded-xl border border-[#DED6C8] w-full transition-all focus:border-[#607A59] focus:ring-2 focus:ring-[#607A59]/20 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#99938A] hover:text-[#1D1D1B] text-xs p-1"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar