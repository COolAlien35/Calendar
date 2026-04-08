'use client';

import { useCallback, useRef } from 'react';

export default function DayCell({ day, type, dateKey, isToday, isWeekend, hasNote, selectionState, onSelect, onHover }) {
  const cellRef = useRef(null);

  const addRipple = useCallback((e) => {
    const cell = cellRef.current;
    if (!cell) return;
    const rect = cell.getBoundingClientRect();
    const r = document.createElement('div');
    r.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    cell.appendChild(r);
    setTimeout(() => r.remove(), 550);
  }, []);

  const handleClick = useCallback((e) => {
    if (type !== 'current') return;
    addRipple(e);
    onSelect(dateKey);
  }, [type, dateKey, onSelect, addRipple]);

  const handleMouseEnter = useCallback(() => {
    if (type !== 'current') return;
    onHover(dateKey);
  }, [type, dateKey, onHover]);

  // Build className
  let className = 'day-cell';
  if (type === 'other-month') className += ' other-month';
  if (type === 'current') {
    if (isToday) className += ' today';
    if (isWeekend) className += ' weekend-tint';
    if (hasNote) className += ' has-note';
    if (selectionState === 'selected-start') className += ' selected-start';
    else if (selectionState === 'selected-end') className += ' selected-end';
    else if (selectionState === 'in-range') className += ' in-range';
    else if (selectionState === 'selected-both') className += ' selected-start selected-end';
  }

  return (
    <div
      ref={cellRef}
      className={className}
      data-date={dateKey || undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {day}
    </div>
  );
}
