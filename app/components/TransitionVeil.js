'use client';

import { useCalendar } from '../context/CalendarContext';

export default function TransitionVeil() {
  const { veilActive } = useCalendar();
  return <div id="transition-veil" className={veilActive ? 'active' : ''} />;
}
