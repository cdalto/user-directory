import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserDirectory } from './UserDirectory'
import { DataTable } from '../DataTable/DataTable'
import type { User } from '@/types/User'

// Wrap DataTable in a spy so we can make it throw in the error boundary test.
// The factory uses importActual so the default behavior is the real component.
vi.mock('../DataTable/DataTable', async (importActual) => {
  const actual = await importActual<typeof import('../DataTable/DataTable')>()
  return { DataTable: vi.fn().mockImplementation(actual.DataTable) }
})

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Alice Adams',
    username: 'alice.a',
    email: 'alice@example.com',
    phone: '555-0001',
    website: 'alice.dev',
    company: { name: 'Acme Corp' },
  },
  {
    id: 2,
    name: 'Bob Baker',
    username: 'bob.b',
    email: 'bob@example.com',
    phone: '555-0002',
    website: 'bob.dev',
    company: { name: 'Beta Inc' },
  },
  {
    id: 3,
    name: 'Carol Carter',
    username: 'carol.c',
    email: 'carol@example.com',
    phone: '555-0003',
    website: 'carol.dev',
    company: { name: 'Gamma LLC' },
  },
]

describe('UserDirectory', () => {
  beforeEach(async () => {
    vi.resetAllMocks()
    // vi.resetAllMocks() clears the mockImplementation set by the factory above,
    // so we restore the real DataTable here for all tests except the one that overrides it.
    const { DataTable: Real } = await vi.importActual<typeof import('../DataTable/DataTable')>('../DataTable/DataTable')
    vi.mocked(DataTable).mockImplementation(Real as typeof DataTable)
  })

  it('shows skeleton rows while loading', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => { }))
    render(<UserDirectory />)
    expect(screen.getAllByRole('row')).toHaveLength(11) // 1 header + 10 skeletons
  })

  it('renders all users on successful fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response)

    render(<UserDirectory />)

    await screen.findByText('Alice Adams') // Wait for fetch to settle
    expect(screen.getAllByRole('row')).toHaveLength(4) // 1 header + 3 users
  })

  it('filters rows by name', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response)

    const user = userEvent.setup()
    render(<UserDirectory />)

    await screen.findByText('Alice Adams') // Confirm data loaded before typing
    await user.type(screen.getByRole('textbox'), 'alice')

    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(2)) // 1 header + 1 user
  })

  it('shows empty state when filter matches nothing', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response)

    const user = userEvent.setup()
    render(<UserDirectory />)

    await screen.findByText('Alice Adams') // Confirm data loaded before typing
    await user.type(screen.getByRole('textbox'), 'zzz')

    // findByText default timeout (1000ms) covers the 500ms debounce
    expect(await screen.findByText('No users found.')).toBeInTheDocument()
  })

  it('shows error message when fetch rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
    render(<UserDirectory />)
    expect(await screen.findByText('Error: Network error')).toBeInTheDocument()
  })

  it('renders error boundary fallback when DataTable throws', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => { }))
    vi.mocked(DataTable).mockImplementation(() => { throw new Error('render error') })
    vi.spyOn(console, 'error').mockImplementation(() => { }) // Suppress React's boundary log
    render(<UserDirectory />)
    expect(await screen.findByText('An error occurred while rendering the data table.')).toBeInTheDocument()
  })
})
