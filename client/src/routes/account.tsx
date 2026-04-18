import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  component: AccountPage,
})

function AccountPage() {
  return (
    <>
      <h1>Account</h1>
    </>
  )
}
