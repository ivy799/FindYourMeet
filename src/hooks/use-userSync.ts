import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";

export function userSync() {
    const { user, isLoaded } = useUser()
    const [isSyncing, setSyncing] = useState(false)
    const [syncError, setSyncError] = useState<string | null>(null)
    const [hasSync, setHasSync] = useState(false)
    const syncAttemted = useRef(false)


    useEffect(() => {
        const syncUser = async () => {
            if (!isLoaded || !user || isSyncing || hasSync || syncAttemted.current) {
                return
            }

            const syncStatus = localStorage.getItem(`user-sync-${user.id}`)
            if (syncStatus === "completed") {
                setHasSync(true)
                return
            }

            syncAttemted.current = true
            setSyncing(true)
            setSyncError(null)

            try {
                const response = await fetch('/api/user/sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error('Failed to sync user')
                }

                const data = await response.json()
                if (data.success) {
                    localStorage.setItem(`user-sync-${user.id}`, 'completed')
                    setHasSync(true)
                }
            } catch (error) {
                console.error('Error syncing user:', error)
                setSyncError('Failed to sync user data')
                syncAttemted.current = false
            } finally {
                setSyncing(false)
            }
        }

        syncUser()
    }, [user, isLoaded, isSyncing, hasSync])

    useEffect (() =>{
        if (user?.id) {
            const syncStatus = localStorage.getItem(`user-sync-${user.id}`)
            if (syncStatus == "completed") {
                setHasSync(true)
                syncAttemted.current = true
            } else {
                setHasSync(false)
                syncAttemted.current = false
            }
        }
    }, [user?.id])

    const resetSync = () => {
        if (user?.id) {
            localStorage.removeItem(`user-sync-${user.id}`)
            setHasSync(false)
            syncAttemted.current = false
            setSyncError(null)
        }
    }

    return {isSyncing, syncError, hasSync, resetSync}
}