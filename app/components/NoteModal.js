'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { MONTHS } from '../lib/constants';
import { parseDateKey } from '../lib/dateUtils';

export default function NoteModal({ open, onClose }) {
  const { rangeStart, rangeEnd, currentMonth, currentYear, addNote } = useCalendar();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open) {
      setText('');
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open]);

  let subtitle = `Note for ${MONTHS[currentMonth]} ${currentYear}`;
  if (rangeStart) {
    if (rangeEnd && rangeEnd !== rangeStart) {
      subtitle = 'Attaching to selected range';
    } else {
      subtitle = `Attaching to ${parseDateKey(rangeStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
    }
  }

  const handleSave = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addNote(trimmed);
    onClose();
  }, [text, addNote, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  }, [handleSave]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <div
      id="note-input-overlay"
      className={open ? 'open' : ''}
      onClick={handleOverlayClick}
    >
      <div id="note-modal">
        <h3>New Memory</h3>
        <div id="note-modal-sub">{subtitle}</div>
        <textarea
          id="note-textarea"
          ref={textareaRef}
          placeholder="Write something memorable…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div id="note-modal-btns">
          <button className="modal-btn" id="cancel-note" onClick={onClose}>Cancel</button>
          <button className="modal-btn primary" id="save-note" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
