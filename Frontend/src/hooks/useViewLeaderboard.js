import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useViewLeaderboard() {
    const [loading, setLoading] = useState(false)

    const viewLeaderboard = async ({ testCode }) => {
        const success = handleInputErrors(testCode)
        if (!success) return   

        setLoading(true)
        try {
            const res = await fetch(`http://localhost:8000/api/tests/leaderBoardExists/${testCode}`)

            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, viewLeaderboard }
}

function handleInputErrors(testCode) {
    if (!testCode) {
        toast.error("Test code is required")
        return false
    }

    return true
}