import { useState, useEffect } from 'react'

export function formatAge(milliseconds) {

    const [currentUtcTime, setCurrentUtcTime] = useState('')

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date()
            const utcTime = now.getTime()
            setCurrentUtcTime(utcTime)
        }, 1000)
        return () => clearInterval(intervalId)
    }, [])

    const second = 1000
    const minute = 60 * second
    const hour = 60 * minute
    const day = 24 * hour

    const days = Math.floor(milliseconds / day)
    milliseconds -= days * day
    const hours = Math.floor(milliseconds / hour)
    milliseconds -= hours * hour
    const minutes = Math.floor(milliseconds / minute)
    milliseconds -= minutes * minute
    const seconds = Math.floor(milliseconds / second)

    const parts = []
    if (days) {
        parts.push(`${days}d `)
    }
    if (hours) {
        parts.push(`${hours}h `)
    }
    if (minutes) {
        parts.push(`${minutes}m `)
    }
    if (seconds) {
        parts.push(`${seconds}s `)
    }
    return parts
}