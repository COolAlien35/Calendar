'use client';

import { useCallback, useMemo } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { getDaysInMonth, getFirstDayOfWeek, formatDate, parseDateKey } from '../lib/dateUtils';
import DayCell from './DayCell';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarGrid() {
  const {
    currentYear, currentMonth,
    rangeStart, rangeEnd,
    notes, selectDay, hoverDay
  } = useCalendar();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
  const prevDays = getDaysInMonth(currentYear, currentMonth - 1);
  const today = new Date();

  // Compute range bounds
  let rangeMin = null, rangeMax = null;
  if (rangeStart && rangeEnd) {
    const a = parseDateKey(rangeStart);
    const b = parseDateKey(rangeEnd);
    rangeMin = a < b ? rangeStart : rangeEnd;
    rangeMax = a < b ? rangeEnd : rangeStart;
  }

  const noteKeys = Object.keys(notes);

  // Build cells
  const cells = useMemo(() => {
    const result = [];

    // Previous month trailing days
    for (let i = 0; i < firstDay; i++) {
      result.push({
        key: `prev-${i}`,
        day: prevDays - firstDay + i + 1,
        type: 'other-month'
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = formatDate(currentYear, currentMonth, d);
      const isToday = today.getDate() === d && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
      const dow = (firstDay + d - 1) % 7;
      const isWeekend = dow === 5 || dow === 6;
      const hasNote = noteKeys.some(k => k.startsWith(dateKey));

      let selectionState = null;
      if (rangeStart && rangeEnd && rangeMin && rangeMax) {
        if (dateKey === rangeMin) selectionState = 'selected-start';
        else if (dateKey === rangeMax) selectionState = 'selected-end';
        else if (dateKey > rangeMin && dateKey < rangeMax) selectionState = 'in-range';
      } else if (rangeStart && dateKey === rangeStart) {
        selectionState = 'selected-both';
      }

      result.push({
        key: dateKey,
        day: d,
        type: 'current',
        dateKey,
        isToday,
        isWeekend,
        hasNote,
        selectionState
      });
    }

    // Next month leading days
    const totalCells = firstDay + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
      result.push({
        key: `next-${i}`,
        day: i,
        type: 'other-month'
      });
    }

    return result;
  }, [currentYear, currentMonth, firstDay, daysInMonth, prevDays, rangeStart, rangeEnd, rangeMin, rangeMax, noteKeys, today]);

  return (
    <div id="calendar-wrapper">
      <div id="weekday-header">
        {WEEKDAYS.map((wd, i) => (
          <div key={wd} className={`weekday-label${i >= 5 ? ' weekend' : ''}`}>
            {wd}
          </div>
        ))}
      </div>
      <div id="calendar-grid">
        {cells.map(cell => (
          <DayCell
            key={cell.key}
            day={cell.day}
            type={cell.type}
            dateKey={cell.dateKey}
            isToday={cell.isToday}
            isWeekend={cell.isWeekend}
            hasNote={cell.hasNote}
            selectionState={cell.selectionState}
            onSelect={selectDay}
            onHover={hoverDay}
          />
        ))}
      </div>
    </div>
  );
}
