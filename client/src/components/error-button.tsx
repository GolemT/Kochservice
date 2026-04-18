import * as Sentry from '@sentry/react'
// Add this button component to your app to test Sentry's error tracking
export function ErrorButton() {
  return (
    <button
      onClick={() => {
        Sentry.captureException(new Error('This is your first error!'))
      }}
    >
      Break the world
    </button>
  )
}
