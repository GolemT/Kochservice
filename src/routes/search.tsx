import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search')({
    component: SearchPage
})

export function SearchPage() {
  return (
    <>
      <h1>Search</h1>
    </>
  )
}
