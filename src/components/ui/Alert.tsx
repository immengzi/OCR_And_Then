'use client'

import {useEffect} from 'react'
import {usePathname} from 'next/navigation'
import {useAlert} from '@/hooks/use-alert'
import {X} from 'lucide-react'

const alertStyles = {
    success: 'bg-green-400 text-green-900 border-green-600',
    error: 'bg-red-400 text-red-900 border-red-600',
    warning: 'bg-yellow-400 text-yellow-900 border-yellow-600',
    info: 'bg-blue-400 text-blue-900 border-blue-600'
}

export function Alert() {
    const pathname = usePathname()
    const {alert, clearAlert} = useAlert()

    useEffect(() => {
        clearAlert()
    }, [pathname, clearAlert])

    if (!alert) return null

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className={`
                shadow-lg rounded-lg border p-4 transition-opacity duration-300
                ${alertStyles[alert.type]}
            `}>
                <div className="flex items-center gap-2">
                    <span className="flex-1">{alert.message}</span>
                    <button
                        onClick={clearAlert}
                        className="hover:bg-black/10 p-1 rounded-full transition-colors"
                        aria-label="Close alert"
                    >
                        <X className="h-4 w-4"/>
                    </button>
                </div>
            </div>
        </div>
    )
}