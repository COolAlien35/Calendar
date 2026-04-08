'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { MONTHS, MONTH_THEMES } from '../lib/constants';
import { formatDate } from '../lib/dateUtils';

const CalendarContext = createContext(null);

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
}

export function CalendarProvider({ children }) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [notes, setNotes] = useState({});
  const [mood, setMood] = useState('calm');
  const [handwrittenMode, setHandwrittenMode] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [veilActive, setVeilActive] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cc_notes');
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  // Save notes to localStorage
  const saveNotes = useCallback((newNotes) => {
    setNotes(newNotes);
    try {
      localStorage.setItem('cc_notes', JSON.stringify(newNotes));
    } catch {}
  }, []);

  const selectDay = useCallback((dateKey) => {
    if (!selecting || !rangeStart) {
      setRangeStart(dateKey);
      setRangeEnd(null);
      setSelecting(true);
    } else {
      setRangeEnd(dateKey);
      setSelecting(false);
    }
  }, [selecting, rangeStart]);

  const hoverDay = useCallback((dateKey) => {
    if (selecting && rangeStart) {
      setRangeEnd(dateKey);
    }
  }, [selecting, rangeStart]);

  const goToMonth = useCallback((delta) => {
    setVeilActive(true);
    setTransitioning(true);

    setTimeout(() => {
      setCurrentMonth(prev => {
        let newMonth = prev + delta;
        let newYear = currentYear;
        if (newMonth > 11) { newMonth = 0; setCurrentYear(y => y + 1); }
        if (newMonth < 0) { newMonth = 11; setCurrentYear(y => y - 1); }
        return newMonth;
      });
      setRangeStart(null);
      setRangeEnd(null);
      setSelecting(false);
      setTransitioning(false);
      setVeilActive(false);
    }, 350);
  }, [currentYear]);

  const addNote = useCallback((text) => {
    const date = rangeStart || formatDate(currentYear, currentMonth, 1);
    const key = `${date}_${Date.now()}`;
    const newNotes = { ...notes, [key]: text };
    saveNotes(newNotes);
  }, [rangeStart, currentYear, currentMonth, notes, saveNotes]);

  const deleteNote = useCallback((key) => {
    const newNotes = { ...notes };
    delete newNotes[key];
    saveNotes(newNotes);
  }, [notes, saveNotes]);

  const toggleHandwriting = useCallback(() => {
    setHandwrittenMode(prev => !prev);
  }, []);

  const clearSelection = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelecting(false);
  }, []);

  const theme = MONTH_THEMES[currentMonth];

  return (
    <CalendarContext.Provider value={{
      currentYear, currentMonth,
      rangeStart, rangeEnd, selecting,
      notes, mood, handwrittenMode,
      transitioning, veilActive, theme,
      setMood, selectDay, hoverDay,
      goToMonth, addNote, deleteNote,
      toggleHandwriting, clearSelection
    }}>
      {children}
    </CalendarContext.Provider>
  );
}
