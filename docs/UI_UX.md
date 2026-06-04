# UI/UX — TaskFlow Web Client

## UX purpose
The interface should communicate a real product flow. It should be understandable, responsive and resilient to loading, empty and error states.

## Main flows
- authentication
- projects
- tasks
- task status transitions
- comments
- dashboard

## Required UI states
For every major page:
- loading;
- empty;
- error;
- success/confirmation when relevant;
- disabled/pending action state;
- validation feedback when forms are present.

## Responsive behavior
- Navigation remains usable on small screens.
- Grids collapse cleanly.
- Tables use responsive overflow or stacked alternatives.
- Forms remain readable on mobile.
- Primary actions remain visible and reachable.

## Accessibility baseline
- Use semantic HTML.
- Use visible labels for inputs.
- Use accessible names for icon buttons.
- Keep keyboard focus visible.
- Do not rely only on color for state.
- Prefer accessible queries in tests.
