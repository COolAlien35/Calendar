'use client';

import { useCalendar } from '../context/CalendarContext';

export default function NoteCard({ noteKey, text, date, handwritten }) {
  const { deleteNote } = useCalendar();

  return (
    <div className={`note-card${handwritten ? ' handwritten' : ''}`}>
      <span>{text}</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
        <span className="note-date">
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <button
          className="note-del"
          onClick={(e) => { e.stopPropagation(); deleteNote(noteKey); }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
