import React from 'react'

const SideBar = ({ activeView, setActiveView, onFocusSearch }) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      ),
    },
    {
      id: 'pinned',
      label: 'Pinned',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c.11.128.19.278.232.441l1.71 6.54c.148.566-.118 1.16-.628 1.417l-3.32 1.67a6.388 6.388 0 0 1-2.887.69h-.44l-2.025 4.557a.75.75 0 0 1-1.37-.61l1.455-3.275a6.4 6.4 0 0 1-1.282-1.082l-3.79-3.79a.75.75 0 0 1 .53-1.28h.746c.866 0 1.706-.307 2.378-.868l2.97-2.476c.453-.377 1.096-.464 1.636-.219l3.418 1.554Z" />
        </svg>
      ),
    },
  ]

  const handleNavClick = (id) => {
    if (id === 'search') {
      if (onFocusSearch) onFocusSearch()
      return
    }
    setActiveView(id)
  }

  return (
    <aside className="w-16 md:w-56 bg-white border-r border-[#DED6C8] flex flex-col justify-between py-6 px-3 flex-shrink-0">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="size-9 rounded-xl bg-[#607A59] text-white flex items-center justify-center font-bold text-lg shadow-xs flex-shrink-0">
          N
        </div>
        <div className="hidden md:block">
          <h1 className="text-base font-bold text-[#1D1D1B] tracking-tight leading-none">
            Notes App
          </h1>
          <p className="text-[11px] text-[#6F6B63] mt-0.5">Personal Workspace</p>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex flex-col gap-1.5" role="navigation" aria-label="Main navigation">
        <span className="hidden md:block text-[10px] uppercase font-bold text-[#99938A] px-3 mb-1 tracking-wider">
          Views
        </span>
        {navItems.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#607A59] text-white shadow-xs'
                  : 'text-[#6F6B63] hover:bg-[#EEE6D5] hover:text-[#1D1D1B]'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          )
        })}

        {/* Search trigger */}
        <button
          onClick={() => handleNavClick('search')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#6F6B63] hover:bg-[#EEE6D5] hover:text-[#1D1D1B] transition-all cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="hidden md:inline">Search</span>
        </button>
      </nav>

      <div className="flex-1" />

      {/* Footer information */}
      <div className="border-t border-[#DED6C8]/60 pt-4 px-1 hidden md:block">
        <div className="bg-[#EEE6D5]/60 rounded-xl p-3 text-[11px] text-[#6F6B63]">
          <p className="font-semibold text-[#1D1D1B] mb-0.5">Clean & Organized</p>
          <p className="leading-tight">All notes persist locally in your browser storage.</p>
        </div>
      </div>
    </aside>
  )
}

export default SideBar