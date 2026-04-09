# ChronoCanvas
Deployed Link: https://aquamarine-croquembouche-ba02a2.netlify.app/
ChronoCanvas is a cinematic calendar built with Next.js App Router, React, and plain CSS. It combines a split-screen month view, animated ambient backgrounds, date-range selection, and lightweight note-taking into a single full-screen interface.

The current app is intentionally client-driven: month navigation, theme changes, range selection, particle effects, and note persistence all run in the browser without a backend.

## What It Does

- Shows the current month in a full-screen two-panel layout.
- Lets users move between months with the header arrows or keyboard arrows.
- Supports date-range selection directly inside the calendar grid.
- Displays a live "Time Bridge" summary for the active range.
- Stores notes in `localStorage` and filters them by the currently visible month.
- Offers three visual moods:
  - `Calm`
  - `Vivid`
  - `Minimal`
- Renders a reactive animated background that changes with the month theme.

## Product Layout

The page is split into two primary regions:

- Left panel:
  - Brand and mood switcher
  - Current month name, year, and quote
  - "Time Bridge" range summary
- Right panel:
  - Calendar grid with weekday headings and day cells
  - Monthly notes panel

Supporting layers sit behind and above the main layout:

- `Scene` draws the month gradient and particles.
- `TransitionVeil` provides a short visual veil during month changes.
- `NoteModal` is rendered at the page level for note creation.

## Tech Stack

- Next.js `16.2.2`
- React `19.2.4`
- React DOM `19.2.4`
- App Router with a client-rendered page shell
- Plain CSS in `app/globals.css`
- Canvas-based particle rendering for the background scene
- `localStorage` for note persistence

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Other scripts:

```bash
npm run build
npm run start
```

## Controls

- `←` / `→`: move between months
- `Escape`: close the note modal and clear the current range selection
- Click a day once: start a range
- Click another day: complete the range
- Click `+` in the notes panel: add a note for the selected range or current month
- Toggle `Aa`: switch note cards into handwritten mode

## State and Data Model

Application state lives in `app/context/CalendarContext.js`.

It owns:

- visible month and year
- active date-range selection
- notes map
- current mood
- handwritten notes toggle
- transition flags for month navigation

Notes are stored as an object keyed by:

```text
YYYY-MM-DD_timestamp
```

This keeps note storage simple and lets the notes panel filter entries by the visible month.

## Code Structure

```text
app/
  components/
    CalendarGrid.js
    DayCell.js
    Header.js
    HeroContent.js
    NoteCard.js
    NoteModal.js
    NotesPanel.js
    RangeInfo.js
    Scene.js
    TransitionVeil.js
  context/
    CalendarContext.js
  lib/
    constants.js
    dateUtils.js
    particles.js
  globals.css
  layout.js
  page.js
```

## Component Guide

### `app/page.js`

Builds the page shell, wires keyboard navigation, mounts the modal, and wraps the UI in `CalendarProvider`.

### `app/context/CalendarContext.js`

Central state container for month navigation, range selection, notes, mood, and transition state.

### `app/components/Scene.js`

Runs the animated background. It:

- sizes a full-screen canvas
- swaps particle presets by month and mood
- updates a gradient layer
- adds pointer-based parallax

### `app/components/HeroContent.js`

Shows month navigation, month name, year, and the per-month quote.

### `app/components/CalendarGrid.js`

Builds the visible month grid from date utilities and annotates cells with:

- today state
- weekend tint
- note indicator
- range selection state

### `app/components/DayCell.js`

Owns individual day interactions and the click ripple effect.

### `app/components/RangeInfo.js`

Turns the selected range into human-readable text and duration metadata for the "Time Bridge" card.

### `app/components/NotesPanel.js`

Filters notes to the current month and exposes the add-note and handwriting-mode controls.

### `app/components/NoteModal.js`

Collects note text and attaches it to the currently selected range or current month.

## Visual System

The app uses a single global stylesheet, `app/globals.css`, to define:

- glassmorphism panels
- serif/sans/handwritten typography
- responsive split-to-stack layout
- calendar cell interaction states
- note card styles
- modal styling
- background and transition layers

Month-specific mood comes from `app/lib/constants.js`, which pairs each month with:

- a three-stop background palette
- an accent color
- a particle type

## Date Utilities

`app/lib/dateUtils.js` provides the small date helpers the app depends on:

- `getDaysInMonth`
- `getFirstDayOfWeek`
- `formatDate`
- `parseDateKey`

These utilities keep calendar rendering deterministic and avoid date math being spread across components.

## Particle System

`app/lib/particles.js` implements the ambient scene particles. Different months map to different particle behaviors such as:

- snow
- rain
- bloom
- leaves
- shimmer
- stars

Each particle type has its own draw and update logic, which is why the background feels materially different across the year rather than just recolored.

## Persistence

There is no server or database. Notes are loaded from and saved to `localStorage` under:

```text
cc_notes
```

If `localStorage` is unavailable, the app fails softly and continues rendering.

## Responsive Behavior

At narrower widths the app collapses from a two-column layout into a single-column layout:

- left panel moves above the calendar
- spacing tightens
- calendar padding and cell sizing are reduced

This behavior is defined entirely in `app/globals.css`.

## Current Constraints

- Notes are local to the browser and device.
- There is no sync, auth, or backend.
- Month transitions are client-side only.
- Fonts are loaded from Google Fonts.
- The project currently uses plain JavaScript rather than TypeScript.

## Development Notes

- This repository uses the App Router.
- The main experience is implemented as a client component in `app/page.js`.
- The codebase is intentionally simple: no external state library, no UI framework, no CSS-in-JS.

If you extend the app, keep the existing split between:

- context for shared interactive state
- presentational components for the layout
- small utility modules for date and particle behavior
