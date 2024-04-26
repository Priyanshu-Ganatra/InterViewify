import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useGetLeaderboardData() {
    const [loading, setLoading] = useState(false)

    const getLeaderboardData = async (testCode) => {
        const success = handleInputErrors(testCode)
        if (!success) return

        setLoading(true)
        try {
            // Fetch test details
            const res = await fetch(`http://localhost:8000/api/tests/leaderboard/${testCode}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)

            return data
            
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, getLeaderboardData }
}

function handleInputErrors(testCode) {
    if (!testCode) {
        toast.error("Test code is required")
        return false
    }

    return true
}