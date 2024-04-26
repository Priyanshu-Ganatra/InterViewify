import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useGetJoinedCandidates() {
    const [loading, setLoading] = useState(false)
    const [candidates, setCandidates] = useState([])
    const [message, setMessage] = useState('')

    const getJoinedCandidates = async (testCode) => {
        const success = handleInputErrors(testCode)
        if (!success) return

        setLoading(true)
        try {
            const res = await fetch(`http://localhost:8000/api/tests/joinedCandidates/${testCode}`, {
                method: 'GET',
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)
            if (data.message) {
                setMessage(data.message)
                return  
            }

            setCandidates(data.candidateDetails)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, candidates, message ,getJoinedCandidates }
}

function handleInputErrors(testCode) {
    if (!testCode) {
        toast.error("Test code is required")
        return false
    }

    return true
}