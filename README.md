# Typing Speed Test

A responsive typing speed test built with React, TypeScript, and Vite. Choose a difficulty and test mode, type the displayed passage, and track your speed, accuracy, and personal best.

![Typing Speed Test](./preview.jpg)

## Live Demo

[View the live site](https://typing-speed-test-lime-nine.vercel.app/)

## Features

- Timed mode with a 60-second countdown
- Passage mode that ends when the passage is complete
- Easy, medium, and hard passage difficulties
- Live WPM, accuracy, and time tracking
- Correct and incorrect character feedback while typing
- Personal best score saved in `localStorage`
- New personal best result state with animations
- Responsive layout for desktop, tablet, and mobile screens
- Mobile difficulty and mode controls with radio-style dropdown options
- Automatic scrolling that keeps the active typing position visible

## Built With

- React 19
- TypeScript
- Vite
- React Router
- CSS custom properties
- CSS Flexbox and Grid
- Browser `localStorage`

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal to use the application.

### Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## How It Works

The application stores the typing session in `TestContext`, including the selected difficulty, mode, passage, typed text, elapsed time, and personal best. The context also calculates WPM and accuracy and decides when a test is complete.

React Router maps each test state to a route:

- `/idle` for the initial test screen
- `/started` while the user is typing
- `/results` for a completed test
- `/first-test` after the first completed test
- `/new-personal-best` when a new high score is achieved

The visual components are separated into focused files for the header, statistics, controls, passages, typing input, results, animations, and restart action. Component-specific styles are kept alongside the relevant components where practical.

## What I Learned

This project provided practice with:

- Managing related application state with React context
- Using TypeScript union types for difficulty, mode, and test states
- Running and cleaning up interval timers with `useEffect`
- Calculating typing metrics from user input
- Persisting user data with `localStorage`
- Creating responsive layouts with media queries
- Building accessible custom controls with ARIA roles and states
- Using routes to represent different application screens
- Keeping the active typing cursor visible with automatic scrolling

## Future Improvements

- Add keyboard shortcuts for starting, restarting, and changing modes
- Add a settings panel for timer duration and text preferences
- Store a history of previous scores
- Add more passages and allow users to choose a passage category
- Improve keyboard navigation for the custom mobile dropdowns
- Add automated tests for scoring, timer completion, and route transitions

## AI Collaboration

AI tools were used as development assistants during this project for debugging, responsive layout improvements, component organization, routing, accessibility suggestions, and README editing. All generated suggestions were reviewed and adapted to fit the project.

## Author

- Frontend Mentor: [@youngjorisky](https://www.frontendmentor.io/profile/youngjorisky)
- X: [@_youngjojo_](https://x.com/_youngjojo_)

## Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io/) for the original challenge
- [React](https://react.dev/) and [Vite](https://vite.dev/) for the development tools
