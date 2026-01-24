import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  component: AccountPage,
})

export function AccountPage() {
  return (
    <>
      <h1>Account</h1>
    </>
  )
}
