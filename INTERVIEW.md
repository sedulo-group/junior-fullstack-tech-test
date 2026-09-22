# Interview guide

Aim for 30–45 minutes. Let the candidate run the app and explain what they see before opening the code. Familiarity with Nest or Chakra API names is less important than explaining data flow, state, and a small change.

## 1. Walk through one task (5–10 minutes)

Ask them to create a task, change its status, refresh, then find it in the list. Trace the create request from `apps/web/src/app/tasks/new/page.tsx` through `lib/api.ts` to the backend controller and service.

- Which code runs in the browser? Which code runs on the server?
- What happens after pressing Create task, before the response arrives?
- Why does refreshing preserve the task, but restarting the API remove it?
- What are the controller and service each responsible for?

## 2. React hooks and state (10 minutes)

Open `apps/web/src/app/tasks/page.tsx` and `hooks/use-tasks.ts`.

- What does `useState` store? What triggers another render?
- Why are the filtered tasks and completion count calculated from existing data?
- When does the effect run? What does its dependency array mean?
- Why does the effect return a function that aborts the fetch?
- What could happen if the user leaves the page before a request finishes?
- Why does the retry use `setAttempt((current) => current + 1)`?
- Why does the mapped task card have a stable `key`?

Open `app/tasks/new/page.tsx`.

- What makes the title input controlled?
- How is a ref different from state? Why is the title element a ref?
- Why call `preventDefault()`? Why disable controls while saving?
- What stays on the screen after a failed save?

Useful expectations: the candidate connects a state update to rendering, explains an effect in terms of synchronising with an external request, and understands that changing a ref does not render the component. No need to add `useMemo` or `useCallback` to these tiny calculations.

## 3. Styling, components, and navigation (5–10 minutes)

Open `components/task-card.tsx`, `components/app-shell.tsx`, and the detail page.

- How does the task card receive its data? Why extract it?
- How do Chakra's spacing tokens and responsive props work?
- Where would you change the status badge colour consistently?
- How do `Link` and `router.push()` differ in this app?
- Where does `[id]` come from? What happens on a direct visit to a detail URL?
- Which controls have labels? How would you test the page with only a keyboard?

Useful expectations: they can find a style, change it without copying a component, explain route parameters, and identify a loading/error state.

## 4. Pick one small change (10–20 minutes)

### A. Add a “Clear filters” button — easiest

Add a button beside the filters that clears the search text and selects All statuses. Disable it when both filters are already at their defaults. Keep it usable on a narrow screen.

Check: search, apply a status, reset both, and confirm the full list returns. Ask whether another state variable is needed.

### B. Add title sorting — easy

Add a dropdown for “Original order”, “Title A–Z”, and “Title Z–A”. Keep search and status filtering working. Avoid mutating the original task array when sorting.

Check: both sort directions, combined filters, and switching back to original order. Ask why `.sort()` needs care with React state.

### C. Allow editing a task title — full stack

Add a title input and save action on the detail page, with a small PATCH endpoint and DTO on the API. Preserve the existing status action. Trim the title and enforce the existing 1–80 character rule on both sides.

Check: valid changes survive a refresh, whitespace-only titles are rejected, and a failed request keeps the user's draft. Ask why TypeScript types alone cannot validate an HTTP request body.

## What to assess

- Can they explain the current code before changing it?
- Can they make a small change in the right place without adding unnecessary abstractions?
- Do they check loading, empty, invalid, failed, and successful outcomes where relevant?
- Do they use labels and test both a narrow and wide layout?
- Can they explain a bug, inspect the request/response, and verify their fix?

Finish with one discussion: **How would you keep the tasks after restarting the server?** A simple explanation of moving storage into a database is enough; database implementation is outside this short session.
