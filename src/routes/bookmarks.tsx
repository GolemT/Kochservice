import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/bookmarks')({
  component: BookmarksPage,
})

export function BookmarksPage() {
  return (
    <>
      <h1>Bookmarks</h1>
    </>
  )
}
