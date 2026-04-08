'use client';

import { useCalendar } from '../context/CalendarContext';
import { parseDateKey } from '../lib/dateUtils';
import NoteCard from './NoteCard';

export default function NotesPanel({ onOpenModal }) {
  const { currentYear, currentMonth, notes, handwrittenMode, toggleHandwriting } = useCalendar();

  const dateNotes = Object.entries(notes).filter(([k]) => {
    const [y, m] = k.split('_')[0].split('-').map(Number);
    return y === currentYear && m - 1 === currentMonth;
  });

  return (
    <div id="notes-panel">
      <div id="notes-header">
        <div id="notes-label">Memory Layer</div>
        <div id="notes-actions">
          <button
            id="handwriting-toggle"
            className={handwrittenMode ? 'active' : ''}
            title="Toggle handwritten style"
            onClick={toggleHandwriting}
          >
            Aa
          </button>
          <button id="add-note-btn" title="Add note" onClick={onOpenModal}>
            +
          </button>
        </div>
      </div>
      <div id="notes-list">
        {dateNotes.length === 0 ? (
          <div id="note-empty">
            No memories yet.<br />Select dates and click + to add one.
          </div>
        ) : (
          dateNotes.map(([key, text]) => {
            const date = key.split('_')[0];
            const d = parseDateKey(date);
            return (
              <NoteCard
                key={key}
                noteKey={key}
                text={text}
                date={d}
                handwritten={handwrittenMode}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
