import React, { useState, useEffect } from 'react'

const toDateString = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const CATEGORIES = ['Personal', 'Work', 'Study', 'Ideas', 'Important']
const PRIORITIES = ['Normal', 'Important']

function CreateCard({
  onAddNote,
  editingNote,
  onEditNote,
  onCancelEdit,
}) {
  const todayStr = toDateString(new Date())

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(todayStr)
  const [category, setCategory] = useState('Personal')
  const [priority, setPriority] = useState('Normal')
  const [validationError, setValidationError] = useState('')

  // When editingNote changes, populate form fields
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '')
      setDescription(editingNote.description || '')
      setDate(editingNote.date || todayStr)
      setCategory(editingNote.category || 'Personal')
      setPriority(editingNote.priority || 'Normal')
      setValidationError('')
    }
  }, [editingNote, todayStr])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDate(todayStr)
    setCategory('Personal')
    setPriority('Normal')
    setValidationError('')
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setValidationError('Please enter a title for the note.')
      return
    }

    setValidationError('')

    const now = Date.now()

    if (editingNote) {
      onEditNote({
        ...editingNote,
        title: title.trim(),
        description: description.trim(),
        date: date || todayStr,
        category,
        priority,
        updatedAt: now,
      })
    } else {
      onAddNote({
        id: now.toString(),
        title: title.trim(),
        description: description.trim(),
        date: date || todayStr,
        category,
        priority,
        pinned: false,
        createdAt: now,
        updatedAt: now,
      })
    }

    resetForm()
  }

  const handleCancel = () => {
    resetForm()
    if (onCancelEdit) onCancelEdit()
  }

  const isEditing = !!editingNote

  return (
    <div className="px-5 pb-4 max-w-6xl mx-auto w-full">
      <div className="bg-white rounded-2xl border border-[#DED6C8] p-5 shadow-sm">
        <form onSubmit={submitHandler} className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#DED6C8]/60 pb-2">
            <h2 className="text-sm font-semibold text-[#1D1D1B]">
              {isEditing ? 'Edit Note' : 'Quick Note Creation'}
            </h2>
            {isEditing && (
              <span className="text-xs text-[#607A59] font-medium bg-[#607A59]/10 px-2.5 py-0.5 rounded-full">
                Editing Mode
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="note-title" className="block text-[11px] font-semibold text-[#6F6B63] uppercase tracking-wider mb-1">
              Title <span className="text-[#B84A43]">*</span>
            </label>
            <input
              id="note-title"
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (validationError) setValidationError('')
              }}
              aria-label="Note title"
              className={`w-full outline-none border rounded-lg px-3 py-2 text-sm bg-white text-[#1D1D1B] placeholder-[#99938A] transition-colors ${
                validationError
                  ? 'border-[#B84A43]'
                  : 'border-[#DED6C8] focus:border-[#607A59]'
              }`}
            />
            {validationError && (
              <p className="text-xs text-[#B84A43] mt-1" role="alert">
                {validationError}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="note-content" className="block text-[11px] font-semibold text-[#6F6B63] uppercase tracking-wider mb-1">
              Content
            </label>
            <textarea
              id="note-content"
              placeholder="Write your note description or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Note content"
              rows={3}
              className="w-full outline-none border border-[#DED6C8] rounded-lg px-3 py-2 text-sm bg-white text-[#1D1D1B] placeholder-[#99938A] resize-none focus:border-[#607A59] transition-colors"
            />
          </div>

          {/* Metadata Controls Row: Date, Category, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Date */}
            <div>
              <label htmlFor="note-date" className="block text-[11px] font-semibold text-[#6F6B63] uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                id="note-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Note date"
                className="w-full outline-none border border-[#DED6C8] rounded-lg px-3 py-1.5 text-sm bg-white text-[#1D1D1B] focus:border-[#607A59] transition-colors cursor-pointer"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="note-category" className="block text-[11px] font-semibold text-[#6F6B63] uppercase tracking-wider mb-1" title="What type of note is this?">
                Category
              </label>
              <select
                id="note-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Note category"
                className="w-full outline-none border border-[#DED6C8] rounded-lg px-3 py-1.5 text-sm bg-white text-[#1D1D1B] focus:border-[#607A59] transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="note-priority" className="block text-[11px] font-semibold text-[#6F6B63] uppercase tracking-wider mb-1" title="How important is this note?">
                Priority
              </label>
              <select
                id="note-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                aria-label="Note priority"
                className="w-full outline-none border border-[#DED6C8] rounded-lg px-3 py-1.5 text-sm bg-white text-[#1D1D1B] focus:border-[#607A59] transition-colors cursor-pointer"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-2">
            <button
              type="submit"
              className="bg-[#607A59] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#4F6849] active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              {isEditing ? 'Save Changes' : 'Add Note'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm px-4 py-2 rounded-lg border border-[#DED6C8] text-[#6F6B63] hover:bg-[#EEE6D5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCard