'use client';

import { useCalendar } from '../context/CalendarContext';
import { parseDateKey } from '../lib/dateUtils';

export default function RangeInfo() {
  const { rangeStart, rangeEnd } = useCalendar();

  let datesText = 'Select a date range';
  let durationText = '';
  let showBridge = false;

  const fmt = (k) => parseDateKey(k).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (rangeStart) {
    if (!rangeEnd || rangeStart === rangeEnd) {
      datesText = fmt(rangeStart);
      durationText = 'Click another date to complete the bridge';
    } else {
      const a = parseDateKey(rangeStart);
      const b = parseDateKey(rangeEnd);
      const [start, end] = a < b ? [a, b] : [b, a];
      const diff = Math.round((end - start) / 86400000) + 1;
      datesText = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      durationText = `${diff} day${diff !== 1 ? 's' : ''} bridged`;
      showBridge = true;
    }
  }

  return (
    <div id="range-info">
      <div id="range-label">Time Bridge</div>
      <div id="range-dates">{datesText}</div>
      <div id="range-duration">{durationText}</div>
      <div id="range-bridge" style={{ display: showBridge ? 'flex' : 'none' }}>
        <div className="bridge-dot" />
        <div className="bridge-line" />
        <div className="bridge-dot-end" />
      </div>
    </div>
  );
}
