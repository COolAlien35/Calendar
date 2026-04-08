'use client';

import { useCalendar } from '../context/CalendarContext';
import { MONTHS, QUOTES } from '../lib/constants';

export default function HeroContent() {
  const { currentMonth, currentYear, transitioning, goToMonth } = useCalendar();

  return (
    <div id="hero-content">
      <div id="month-nav">
        <button className="nav-arrow" id="prev-btn" aria-label="Previous month" onClick={() => goToMonth(-1)}>
          &#8592;
        </button>
        <div id="month-display">
          <span id="month-name" className={transitioning ? 'transitioning' : ''}>
            {MONTHS[currentMonth]}
          </span>
          <span id="year-display">{currentYear}</span>
          <div id="month-quote">{QUOTES[currentMonth]}</div>
        </div>
        <button className="nav-arrow" id="next-btn" aria-label="Next month" onClick={() => goToMonth(1)}>
          &#8594;
        </button>
      </div>
    </div>
  );
}
