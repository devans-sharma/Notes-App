import React, { useState } from 'react'
import DeleteModal from './DeleteModal'

const CATEGORIES = ['All', 'Personal', 'Work', 'Study', 'Ideas', 'Important']

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const ShowCard = ({
  allNotes,
  notes,
  onStartEdit,
  onDeleteNote,
  onTogglePin,
  searchQuery,
  activeView,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) => {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteNote(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  // Dashboard Summary stats
  const totalCount = allNotes.length
  const pinnedCount = allNotes.filter((n) => n.pinned).length
  const studyCount = allNotes.filter((n) => n.category === 'Study').length
  const workCount = allNotes.filter((n) => n.category === 'Work').length

  const getEmptyMessage = () => {
    if (searchQuery) return `No notes matching "${searchQuery}".`
    if (activeView === 'pinned') return 'No pinned notes. Pin a note to see it here!'
    if (selectedCategory !== 'All') return `No notes found under "${selectedCategory}" category.`
    return 'No notes yet. Create your first note above!'
  }

  const getViewTitle = () => {
    if (activeView === 'pinned') return 'Pinned Notes'
    if (searchQuery) return `Search Results (${notes.length})`
    return `All Notes (${notes.length})`
  }

  return (
    <>
      <div className="px-5 pb-6 flex flex-col gap-5 max-w-6xl mx-auto w-full">
        {/* Dashboard Summary Statistics (shown on Home view) */}
        {activeView === 'home' && !searchQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-[#DED6C8] flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase font-semibold text-[#6F6B63] tracking-wider">Total Notes</p>
                <p className="text-xl font-bold text-[#1D1D1B] mt-0.5">{totalCount}</p>
              </div>
              <span className="text-xl opacity-75">📝</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-[#DED6C8] flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase font-semibold text-[#6F6B63] tracking-wider">Pinned</p>
                <p className="text-xl font-bold text-[#1D1D1B] mt-0.5">{pinnedCount}</p>
              </div>
              <span className="text-xl opacity-75">📌</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-[#DED6C8] flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase font-semibold text-[#6F6B63] tracking-wider">Study Notes</p>
                <p className="text-xl font-bold text-[#1D1D1B] mt-0.5">{studyCount}</p>
              </div>
              <span className="text-xl opacity-75">🎓</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-[#DED6C8] flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase font-semibold text-[#6F6B63] tracking-wider">Work Notes</p>
                <p className="text-xl font-bold text-[#1D1D1B] mt-0.5">{workCount}</p>
              </div>
              <span className="text-xl opacity-75">💼</span>
            </div>
          </div>
        )}

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#DED6C8]">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-[#6F6B63] mr-1 hidden md:inline">
              Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#607A59] text-white shadow-xs'
                      : 'text-[#6F6B63] hover:bg-[#EEE6D5] hover:text-[#1D1D1B]'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label htmlFor="sort-notes" className="text-xs font-semibold text-[#6F6B63] whitespace-nowrap">
              Sort:
            </label>
            <select
              id="sort-notes"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort notes"
              className="bg-white text-xs font-medium text-[#1D1D1B] border border-[#DED6C8] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#607A59] cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="updated">Recently updated</option>
              <option value="alphabetical">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1D1D1B] tracking-tight">
            {getViewTitle()}
          </h2>
          {selectedCategory !== 'All' && (
            <span className="text-xs text-[#6F6B63]">
              Filtered by: <strong className="text-[#1D1D1B]">{selectedCategory}</strong>
            </span>
          )}
        </div>

        {/* Notes Grid or Empty State */}
        {notes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#DED6C8] py-12 px-4 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-[#6F6B63]">{getEmptyMessage()}</p>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All')
                }}
                className="mt-3 text-xs text-[#607A59] underline hover:text-[#4F6849] cursor-pointer"
              >
                Clear active filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note) => (
              <article
                key={note.id}
                className={`bg-white rounded-xl border p-4 flex flex-col gap-2.5 hover:shadow-md transition-all group relative ${
                  note.pinned
                    ? 'border-[#607A59] shadow-xs bg-[#FBF9F5]'
                    : 'border-[#DED6C8]'
                }`}
              >
                {/* Header: Title + Pin button */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#1D1D1B] leading-snug line-clamp-2 pr-4">
                    {note.title}
                  </h3>
                  <button
                    onClick={() => onTogglePin(note.id)}
                    aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                    title={note.pinned ? 'Unpin note' : 'Pin note'}
                    className={`p-1 text-xs rounded transition-colors cursor-pointer ${
                      note.pinned
                        ? 'text-[#607A59] hover:bg-[#EEE6D5]'
                        : 'text-[#99938A] hover:text-[#607A59] hover:bg-[#EEE6D5]'
                    }`}
                  >
                    📌
                  </button>
                </div>

                {/* Content preview */}
                {note.description && (
                  <p className="text-xs text-[#6F6B63] leading-relaxed line-clamp-3">
                    {note.description}
                  </p>
                )}

                <div className="flex-1" />

                {/* Badges: Distinct Category & Priority */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-[#1D1D1B] bg-[#EEE6D5] px-2 py-0.5 rounded-md border border-[#DED6C8]/60">
                    Category: {note.category || 'Personal'}
                  </span>
                  {note.priority === 'Important' && (
                    <span className="text-[10px] font-semibold text-[#B84A43] bg-[#B84A43]/10 px-2 py-0.5 rounded-md border border-[#B84A43]/20">
                      Priority: Important
                    </span>
                  )}
                </div>

                {/* Footer: Date & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#DED6C8]/60">
                  <time dateTime={note.date} className="text-[11px] text-[#99938A]">
                    {formatDisplayDate(note.date)}
                  </time>

                  <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onStartEdit(note)}
                      aria-label={`Edit "${note.title}"`}
                      title="Edit"
                      className="text-[#6F6B63] hover:text-[#607A59] p-1 rounded transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(note)}
                      aria-label={`Delete "${note.title}"`}
                      title="Delete"
                      className="text-[#6F6B63] hover:text-[#B84A43] p-1 rounded transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        noteTitle={deleteTarget?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

export default ShowCard