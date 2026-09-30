import React, { useState, useEffect, useCallback, useRef } from 'react'
import Navbar from './components/Navbar'
import CreateCard from './components/CreateCard'
import ShowCard from './components/ShowCard'
import SideBar from './components/SideBar'
import CalendarView from './components/CalendarView'

const STORAGE_KEY = 'notes-app-notes'

const toDateString = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Safely load notes from localStorage and migrate legacy schemas.
 */
const loadNotes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        const todayStr = toDateString(new Date())
        return parsed
          .filter((n) => n && typeof n.id !== 'undefined' && typeof n.title === 'string')
          .map((n) => ({
            id: String(n.id),
            title: n.title,
            description: n.description || '',
            date: n.date || todayStr,
            category: n.category || 'Personal',
            priority: n.priority || 'Normal',
            pinned: Boolean(n.pinned),
            createdAt: n.createdAt || Date.now(),
            updatedAt: n.updatedAt || Date.now(),
          }))
      }
    }
  } catch (e) {
    console.error('Failed to load notes from localStorage:', e)
  }
  return []
}

/**
 * Persist notes array to localStorage.
 */
const saveNotes = (notes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (e) {
    console.error('Failed to save notes to localStorage:', e)
  }
}

const App = () => {
  const [notes, setNotes] = useState(() => loadNotes())
  const [searchQuery, setSearchQuery] = useState('')
  const [activeView, setActiveView] = useState('home') // 'home' | 'calendar' | 'pinned'
  const [selectedCategory, setSelectedCategory] = useState('All') // 'All' | 'Personal' | 'Work' | 'Study' | 'Ideas' | 'Important'
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'oldest' | 'updated' | 'alphabetical'
  const [selectedDate, setSelectedDate] = useState(() => toDateString(new Date()))
  const [editingNote, setEditingNote] = useState(null)

  const searchInputRef = useRef(null)

  // Persist notes whenever they change
  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const addNote = useCallback((newNote) => {
    setNotes((prev) => [newNote, ...prev])
  }, [])

  const editNote = useCallback((updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    )
    setEditingNote(null)
  }, [])

  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (editingNote?.id === id) setEditingNote(null)
  }, [editingNote])

  const togglePin = useCallback((id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n))
    )
  }, [])

  const startEdit = useCallback((note) => {
    setEditingNote(note)
    setActiveView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingNote(null)
  }, [])

  const focusSearch = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  // Derive filtered & sorted notes
  const filteredNotes = notes.filter((note) => {
    // 1. Search filter across title, description, category
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const titleMatch = note.title.toLowerCase().includes(q)
      const descMatch = (note.description || '').toLowerCase().includes(q)
      const catMatch = (note.category || '').toLowerCase().includes(q)
      if (!titleMatch && !descMatch && !catMatch) return false
    }

    // 2. Sidebar active view filter
    if (activeView === 'pinned') {
      if (!note.pinned) return false
    }

    // 3. Category filter tab
    if (selectedCategory !== 'All') {
      if (note.category !== selectedCategory) return false
    }

    return true
  })

  // Apply sorting
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // In Home view, pinned notes stay at top unless sorting alphabetically
    if (activeView === 'home' && sortBy !== 'alphabetical') {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
    }

    if (sortBy === 'newest') {
      return (b.createdAt || 0) - (a.createdAt || 0) || (b.date || '').localeCompare(a.date || '')
    }
    if (sortBy === 'oldest') {
      return (a.createdAt || 0) - (b.createdAt || 0) || (a.date || '').localeCompare(b.date || '')
    }
    if (sortBy === 'updated') {
      return (b.updatedAt || 0) - (a.updatedAt || 0)
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  return (
    <div className="min-h-screen w-full flex bg-[#F4EFE5] text-[#1D1D1B] font-sans antialiased">
      {/* Sidebar navigation for desktop */}
      <SideBar
        activeView={activeView}
        setActiveView={setActiveView}
        onFocusSearch={focusSearch}
      />

      {/* Main container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Navbar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchInputRef={searchInputRef}
        />

        {/* Mobile View Switcher Tabs */}
        <div className="flex md:hidden px-5 pb-3 gap-2 border-b border-[#DED6C8] mb-3">
          <button
            onClick={() => setActiveView('home')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeView === 'home'
                ? 'bg-[#607A59] text-white'
                : 'bg-white text-[#6F6B63] border border-[#DED6C8]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeView === 'calendar'
                ? 'bg-[#607A59] text-white'
                : 'bg-white text-[#6F6B63] border border-[#DED6C8]'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveView('pinned')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeView === 'pinned'
                ? 'bg-[#607A59] text-white'
                : 'bg-white text-[#6F6B63] border border-[#DED6C8]'
            }`}
          >
            Pinned
          </button>
        </div>

        {/* View Router */}
        {activeView === 'calendar' ? (
          <CalendarView
            notes={notes}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onStartEdit={startEdit}
            onDeleteNote={deleteNote}
            onTogglePin={togglePin}
          />
        ) : (
          <>
            <CreateCard
              onAddNote={addNote}
              editingNote={editingNote}
              onEditNote={editNote}
              onCancelEdit={cancelEdit}
            />
            <ShowCard
              allNotes={notes}
              notes={sortedNotes}
              onStartEdit={startEdit}
              onDeleteNote={deleteNote}
              onTogglePin={togglePin}
              searchQuery={searchQuery}
              activeView={activeView}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App