import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { DataTable } from './DataTable'
import type { Column } from '@/types/Column'

type TestRow = { id: number; name: string; age: number }

const columns: Column<TestRow>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
  { key: 'id', header: 'ID' },
]

const rows: TestRow[] = [
  { id: 1, name: 'Charlie', age: 30 },
  { id: 2, name: 'Alice', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
]

function getAgeValues() {
  return screen.getAllByRole('row').slice(1).map(
    row => within(row).getAllByRole('cell')[1].textContent
  )
}

describe('DataTable', () => {
  it('sorts rows ascending when a sortable column header is clicked once', async () => {
    const user = userEvent.setup()
    render(<DataTable data={rows} columns={columns} rowKey="id" />)

    await user.click(screen.getByRole('columnheader', { name: /Age/ }))

    expect(getAgeValues()).toEqual(['25', '30', '35'])
  })

  it('sorts rows descending when a sortable column header is clicked twice', async () => {
    const user = userEvent.setup()
    render(<DataTable data={rows} columns={columns} rowKey="id" />)

    await user.click(screen.getByRole('columnheader', { name: /Age/ }))
    await user.click(screen.getByRole('columnheader', { name: /Age/ }))

    expect(getAgeValues()).toEqual(['35', '30', '25'])
  })
})
