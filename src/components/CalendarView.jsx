import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const toDateString = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function CalendarView({
  notes,
  selectedDate,
  setSelectedDate,
  onStartEdit,
  onDeleteNote,
  onTogglePin,
}) {
  const activeDate = selectedDate || toDateString(new Date())

  // Map of dates -> array of notes for fast tile dot lookup
  const notesByDate = notes.reduce((acc, note) => {
    if (note.date) {
      if (!acc[note.date]) acc[note.date] = []
      acc[note.date].push(note)
    }
    return acc
  }, {})

  const handleDateChange = (value) => {
    const dateStr = toDateString(value)
    setSelectedDate(dateStr)
  }

  const notesForSelectedDate = notesByDate[activeDate] || []

  // Calendar tileDot renderer
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dStr = toDateString(date)
      const count = notesByDate[dStr]?.length || 0
      if (count > 0) {
        return (
          <div className="flex justify-center items-center mt-1">
            <span
              className="size-1.5 rounded-full bg-[#607A59]"
              title={`${count} note${count > 1 ? 's' : ''}`}
            />
          </div>
        )
      }
    }
    return null
  }

  return (
    <div className="px-5 pb-6 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Calendar view header */}
      <div className="border-b border-[#DED6C8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-[#1D1D1B]">Calendar</h2>
          <p className="text-xs text-[#6F6B63]">
            View your notes by date.
          </p>
        </div>
        <button
          onClick={() => setSelectedDate(toDateString(new Date()))}
          className="self-start sm:self-auto text-xs px-3 py-1.5 rounded-lg border border-[#DED6C8] text-[#1D1D1B] bg-white hover:bg-[#EEE6D5] transition-colors cursor-pointer"
        >
          Today
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Calendar */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-[#DED6C8] shadow-sm flex flex-col items-center">
          <Calendar
            onChange={handleDateChange}
            value={new Date(activeDate + 'T00:00:00')}
            tileContent={tileContent}
          />
          <div className="mt-3 text-xs text-[#6F6B63] flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#607A59]" />
            <span>Dates containing notes</span>
          </div>
        </div>

        {/* Right: Notes list for selected date */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#EEE6D5]/50 px-4 py-3 rounded-xl border border-[#DED6C8] flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#6F6B63]">
                Selected Date
              </span>
              <h3 className="text-base font-semibold text-[#1D1D1B]">
                {formatDisplayDate(activeDate)}
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#DED6C8] text-[#1D1D1B] font-medium">
              {notesForSelectedDate.length} note{notesForSelectedDate.length === 1 ? '' : 's'}
            </span>
          </div>

          {notesForSelectedDate.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#DED6C8] p-8 text-center">
              <p className="text-sm font-medium text-[#6F6B63]">No notes for this date.</p>
              <p className="text-xs text-[#99938A] mt-1">
                Select another date on the calendar or create a note on Home.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {notesForSelectedDate.map((note) => (
                <article
                  key={note.id}
                  className="bg-white rounded-xl border border-[#DED6C8] p-4 flex flex-col gap-2 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[#1D1D1B] leading-snug line-clamp-2">
                      {note.title}
                    </h4>
                    {note.pinned && (
                      <span className="text-xs" title="Pinned note">
                        📌
                      </span>
                    )}
                  </div>

                  {note.description && (
                    <p className="text-xs text-[#6F6B63] leading-relaxed line-clamp-3">
                      {note.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#EEE6D5] text-[#1D1D1B]">
                      Category: {note.category || 'Personal'}
                    </span>
                    {note.priority === 'Important' && (
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#B84A43]/10 text-[#B84A43]">
                        Priority: Important
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#DED6C8]/60 mt-auto">
                    <time className="text-[11px] text-[#99938A]">
                      {formatDisplayDate(note.date)}
                    </time>
                    <div className="flex gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onTogglePin(note.id)}
                        className="text-[#6F6B63] hover:text-[#607A59] p-1 rounded text-xs transition-colors cursor-pointer"
                        title={note.pinned ? 'Unpin' : 'Pin'}
                      >
                        {note.pinned ? '📌' : '📍'}
                      </button>
                      <button
                        onClick={() => onStartEdit(note)}
                        className="text-[#6F6B63] hover:text-[#607A59] p-1 rounded transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteNote(note)}
                        className="text-[#6F6B63] hover:text-[#B84A43] p-1 rounded transition-colors cursor-pointer"
                        title="Delete"
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
      </div>
    </div>
  )
}
