'use client'

import { useEffect } from 'react'
import { toast } from 'sonner' // oder 'use-toast' je nach Wahl
import { Button } from '@/components/ui/button'

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Toast wird angezeigt wenn Error auftritt
        toast.error('Fehler beim Laden', {
            description: error.message || 'Ein unerwarteter Fehler ist aufgetreten',
        })

        // Optional: Error logging
        console.error('App Error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <h2 className="text-2xl font-semibold">Etwas ist schiefgelaufen</h2>
            <p className="text-muted-foreground">{error.message}</p>
            <Button onClick={reset}>Erneut versuchen</Button>
        </div>
    )
}