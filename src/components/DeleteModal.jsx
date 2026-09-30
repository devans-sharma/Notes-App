import React from 'react'

const DeleteModal = ({ isOpen, noteTitle, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
      role="presentation"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" aria-hidden="true" />

      {/* Dialog */}
      <div
        className="modal-content relative bg-white rounded-2xl p-6 w-full max-w-sm mx-auto shadow-xl border border-[#DED6C8]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <h2
          id="delete-modal-title"
          className="text-base font-bold mb-1 text-[#1D1D1B]"
        >
          Delete this note?
        </h2>
        <p className="text-xs mb-6 text-[#6F6B63] leading-relaxed">
          &ldquo;{noteTitle}&rdquo; will be permanently removed. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-[#DED6C8] text-[#6F6B63] hover:bg-[#EEE6D5] transition-colors cursor-pointer"
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#B84A43] text-white hover:bg-[#9E3C36] transition-colors cursor-pointer shadow-xs"
            aria-label="Confirm deletion"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
