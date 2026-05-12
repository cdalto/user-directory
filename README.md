# Coding Practice Project: User Directory

## The Brief

Build a filterable, sortable user directory using the JSONPlaceholder API.

**API endpoint:** `https://jsonplaceholder.typicode.com/users`
**Time target:** 3-4 hours total, including tests

---

## Requirements

### Data & Types

- Define a `User` interface that matches the JSONPlaceholder response shape. Include at minimum: `id`, `name`, `email`, `phone`, `website`, and `company` (with `company.name` as a nested object)
- Define a generic `Column<T>` interface with `key: keyof T`, `header: string`, and optional `sortable?: boolean`
- Define a generic `DataTableProps<T>` interface that accepts `data: T[]` and `columns: Column<T>[]`

### Custom Hooks

**`useFetch<T>(url: string)`**
- Generic hook — caller specifies the return type
- Returns `{ data: T | null, loading: boolean, error: Error | null }`
- Handles cleanup (abort controller or ignore flag) to avoid setting state on unmounted components
- No external libraries — plain `fetch` + `useEffect`

**`useDebounce<T>(value: T, delay: number)`**
- Generic hook — works for any value type, not just strings
- Returns the debounced value
- Used to debounce the filter input so the table doesn't re-filter on every keystroke

### Components

**`DataTable<T>`**
- Generic component — typed against the column definition
- Renders a shadcn `Table` with headers and rows driven by the `columns` prop
- `key` on `Column<T>` must be `keyof T` — the cell value is accessed via `row[column.key]`
- Supports sorting: clicking a sortable column header toggles asc/desc for that column
- Shows a shadcn `Skeleton` in place of rows while loading
- Renders an empty state message when filtered results are zero

**`UserDirectory` (page/container component)**
- Calls `useFetch<User[]>` to load data
- Wraps `DataTable` in a React error boundary (use `react-error-boundary` or write a class component) — error boundary renders a fallback UI, not just a console error
- Renders a shadcn `Input` for the filter
- Filter is debounced via `useDebounce`
- Filters across at least two fields: `name` and `company.name`
- Passes typed `Column<User>[]` config to `DataTable`

### shadcn/ui Components to Use

- `Input` — filter field
- `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` — data table
- `Badge` — use for one field (e.g. company name or website)
- `Skeleton` — loading state rows

---

## TypeScript Requirements

- No `any` — everything explicitly typed
- `useFetch<T>` and `useDebounce<T>` must be genuinely generic, not hardcoded to `User`
- `Column<T>.key` must be `keyof T` — TypeScript should catch an invalid column key at compile time
- `DataTable<T>` must extend a constraint (e.g. `T extends { id: number }`) so rows have a stable key
- Type the `fetch` response explicitly: `const data = await res.json() as T`
- Type sort state: `{ key: keyof User | null, direction: 'asc' | 'desc' }`

---

## Tests (RTL + Vitest)

Write tests for `UserDirectory` and `DataTable`. Mock `fetch` globally — do not make real network calls in tests.

**Loading state**
- Mock fetch to return a promise that hasn't resolved yet
- Assert that skeleton rows are visible

**Success state**
- Mock fetch to return a fixed array of 3 users
- Assert that all 3 names appear in the document

**Filter behavior**
- Render with mock data
- Type a name into the filter input
- Assert that only the matching row is visible and non-matching rows are not

**Empty state**
- Type a string that matches no users
- Assert the empty state message is visible

**Error state**
- Mock fetch to reject
- Assert that the error boundary fallback renders (not the table)

**Sorting**
- Click a sortable column header once — assert rows are in ascending order
- Click again — assert rows are in descending order

---

## Stretch Goals (only if time permits)

- Add pagination using a `usePagination` hook — returns current page slice, total pages, and `nextPage` / `prevPage` handlers
- Add a column visibility toggle using shadcn `DropdownMenu`
- Make `useDebounce` delay configurable via a second argument with a default value

---

## File Structure

```
src/
  hooks/
    useFetch.ts
    useDebounce.ts
  components/
    DataTable/
      DataTable.tsx
      DataTable.test.tsx
    UserDirectory/
      UserDirectory.tsx
      UserDirectory.test.tsx
  types/
    user.ts
```

---

## What This Covers

| Topic | Where |
|---|---|
| TypeScript generics | `useFetch<T>`, `useDebounce<T>`, `DataTable<T>`, `Column<T>` |
| `keyof T` pattern | `Column<T>.key`, sort state typing |
| Custom hooks | `useFetch`, `useDebounce` |
| useEffect + cleanup | Inside `useFetch` |
| Error boundaries | Wrapping `DataTable` in `UserDirectory` |
| shadcn/ui | Input, Table, Badge, Skeleton |
| Tailwind CSS | Page layout, sortable header hover states, empty state, error fallback — utility classes written directly, not via shadcn |
| RTL + Vitest | All test cases above |
| Loading / error / success states | `useFetch` return shape + component rendering |
| Controlled input | Filter `Input` with `useState` |
| Derived state (filter + sort) | `useMemo` over fetched data |
