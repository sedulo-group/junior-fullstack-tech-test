# Interview guide

Aim for 30–45 minutes. Let the candidate run the app and explain what they see before opening the code. Familiarity with Nest or Chakra API names is less important than explaining data flow, state, and a small change.

## Interviewer notes — spoilers

Use the single app as it is; there is no good/bad mode or second version. Let the candidate explore before sharing this guide. The README and tests also disclose that an exercise is present, so begin in the browser if you want unprompted observations.

### Good examples to discuss

- Clear heading hierarchy, a prominent primary action, and a shared navigation shell.
- Summary counts derived from the same task data, with status names as well as colours.
- Responsive grids, consistent card boundaries, and generous space around controls.
- Persistent field labels, focused title input, character limits, preserved drafts after failures, and inline feedback.
- A separated, quieter destructive action on the detail page, with one confirmation before deletion.

### Deliberate UX mistakes

1. **Excessive confirmation:** submit a valid new task. Two native confirmation prompts repeat the same decision before one POST request. Either Cancel leaves the draft intact. Ask whether creating a reversible task needs a confirmation, and contrast it with deletion. The two `window.confirm` calls are in `apps/web/src/app/tasks/new/page.tsx`.
2. **Low contrast:** card descriptions use `gray.400` on white in `components/task-card.tsx`; the title helper on the create form has the same treatment. Compare these with the readable task description on the detail page. Ask how to measure contrast and choose a better text token.
3. **Subtle misalignment:** on screens at least 640px wide, the status filter is 6px lower than the search field. Inspect `mt={{ base: "0", sm: "1.5" }}` on its `Field.Root` in `app/tasks/page.tsx`. The mobile layout removes the offset. Ask them to identify the shared baseline before editing styles.

### Deliberate code bug: API URL typo, visible immediately

**Reproduce:** open DevTools → Console, then reload `/tasks`. No typing or clicking is needed. The browser reports `GET /api/task 404` and `[Taskroom] Failed to load tasks: Error: Cannot GET /task`. The page displays the API error and a retry button. The server logs the failed request too.

**Cause:** the `list` function in `apps/web/src/lib/api.ts` requests `/task` (singular). NestJS exposes `/tasks` (plural) in `apps/api/src/tasks/tasks.controller.ts`. Next.js forwards `/api/task` to `/task`, so this is a real failed request, not a fabricated console message. The catch block in `hooks/use-tasks.ts` logs the actual error and its stack.

**Fix:** add the missing `s` to the list URL. This is a one-character fix. Ask the candidate to compare the Network request with the controller route, make the change, reload, and confirm that the three task cards appear and the console is clear.

Once the URL is fixed, search should update immediately, including clearing, mixed-case input, and no matches. The intended contrast, alignment, and confirmation mistakes remain for the next part of the discussion. The create and detail pages are still accessible before fixing the list.

**Tests:** `tests/initial-load.spec.ts` runs against the untouched application and marks the list-loading assertion as an expected failure. Remove `test.fail` after the fix. The other browser tests explicitly forward the known bad list URL to the real working API in a test-only route handler so the UX flows can still be checked; this handler never runs in the app and becomes unnecessary after the correction.

Do not treat these intentional issues as accidental regressions. Keep the initial interview branch available if you want to reuse the exercise after the candidate fixes it.

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

## 4. Simple TypeScript discussion (5 minutes)

Open `apps/web/src/lib/tasks.ts`, `components/task-card.tsx`, `hooks/use-tasks.ts`, and `lib/api.ts`.

- Which fields are required by the `Task` interface? Why does `NewTask` omit `id` and `status`?
- What values does the `TaskStatus` union allow? What would happen if you assigned `"finished"`?
- What does `TaskCardProps` tell you about the data its parent must pass?
- Why can the detail page's task be `Task | null` while it is loading?
- How does the `UseTasksResult` interface help a page use the hook?
- What is the difference between an async method returning one task and a list of tasks?
- Why do the Nest DTO classes still need validation decorators when the inputs have interfaces?

Stick to interfaces, union types, optional fields, typed function parameters and return values. The code has no custom generics; standard React hook and Promise annotations name the values involved. TypeScript does not validate HTTP JSON at runtime, so discuss that boundary separately from compile-time checks.

## 5. Pick one small change (10–20 minutes)

After discussing or repairing the seeded defects, choose one extension.

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
