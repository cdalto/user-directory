import { ErrorBoundary } from "react-error-boundary";
import { DataTable } from "../DataTable/DataTable";
import type { Column } from "@/types/Column"
import type { User } from "@/types/User";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useState } from "react";

export function UserDirectory() {
  const { data: users, loading, error } = useFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );

  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 500);

  const query = debouncedInput.toLowerCase();
  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.phone.toLowerCase().includes(query) ||
    user.website.toLowerCase().includes(query) ||
    user.company.name.toLowerCase().includes(query)
  );

  const columns: Column<User>[] = [
    { sortable: true, key: 'id', header: 'ID', render: (value) => (<Badge variant="outline">{value.toString()}</Badge>) },
    { sortable: true, key: 'name', header: 'Name' },
    { sortable: true, key: 'username', header: 'Username' },
    { sortable: true, key: 'email', header: 'Email' },
    { sortable: true, key: 'phone', header: 'Phone' },
    { sortable: true, key: 'website', header: 'Website' },
    { sortable: true, key: 'company', header: 'Company', sortValue: (value) => (value as unknown as { name: string })?.name ?? '', render: (value) => (value as unknown as { name: string })?.name || 'N/A' },
  ]

  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <Input placeholder="Search..." value={input} onChange={(e) => setInput(e.target.value)} />
      <ErrorBoundary fallback={<div>An error occurred while rendering the data table.</div>}>
        <DataTable<User> data={filteredUsers ?? []} columns={columns} rowKey={"id"} loading={loading} />
      </ErrorBoundary>
    </>
  )
}