'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarProvider, useCalendar } from './context/CalendarContext';
import Scene from './components/Scene';
import TransitionVeil from './components/TransitionVeil';
import Header from './components/Header';
import HeroContent from './components/HeroContent';
import RangeInfo from './components/RangeInfo';
import CalendarGrid from './components/CalendarGrid';
import NotesPanel from './components/NotesPanel';
import NoteModal from './components/NoteModal';

function AppContent() {
  const { goToMonth, clearSelection } = useCalendar();
  const [modalOpen, setModalOpen] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') goToMonth(-1);
      if (e.key === 'ArrowRight') goToMonth(1);
      if (e.key === 'Escape') {
        setModalOpen(false);
        clearSelection();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [goToMonth, clearSelection]);

  return (
    <>
      <Scene />
      <TransitionVeil />
      <div id="app">
        {/* LEFT: HERO PANEL */}
        <div id="left-panel">
          <Header />
          <HeroContent />
          <RangeInfo />
        </div>

        {/* RIGHT: CALENDAR + NOTES */}
        <div id="right-panel">
          <CalendarGrid />
          <NotesPanel onOpenModal={() => setModalOpen(true)} />
        </div>
      </div>
      <NoteModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default function Home() {
  return (
    <CalendarProvider>
      <AppContent />
    </CalendarProvider>
  );
}
