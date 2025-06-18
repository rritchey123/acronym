import { useEffect, useState } from 'react'

export function CountdownTimer({
    roundStartTime,
    duration,
}: {
    roundStartTime: string
    duration: number
}) {
    const [timeLeft, setTimeLeft] = useState(duration)

    useEffect(() => {
        const start = new Date(roundStartTime).getTime()

        const interval = setInterval(() => {
            const now = Date.now()
            const elapsed = Math.floor((now - start) / 1000)
            const remaining = Math.max(duration - elapsed, 0)
            setTimeLeft(remaining)
        }, 1000)

        return () => clearInterval(interval)
    }, [roundStartTime, duration])

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
    const seconds = String(timeLeft % 60).padStart(2, '0')

    return (
        <div className="text-center">
            <div className="text-sm uppercase text-muted-foreground tracking-wider">
                Time Left
            </div>
            <div
                className={`text-3xl font-bold ${
                    timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'
                }`}
            >
                {minutes}:{seconds}
            </div>
        </div>
    )
}
