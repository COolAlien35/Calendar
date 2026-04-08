'use client';

import { useCalendar } from '../context/CalendarContext';

const MOODS = [
  { key: 'calm', label: 'Calm' },
  { key: 'energetic', label: 'Vivid' },
  { key: 'minimal', label: 'Minimal' },
];

export default function Header() {
  const { mood, setMood } = useCalendar();

  return (
    <div id="header">
      <div id="logo">ChronoCanvas</div>
      <div id="mood-switcher">
        {MOODS.map(m => (
          <button
            key={m.key}
            className={`mood-btn${mood === m.key ? ' active' : ''}`}
            data-mood={m.key}
            onClick={() => setMood(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
