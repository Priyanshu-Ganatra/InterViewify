import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useGetTestDetails() {
    const [loading, setLoading] = useState(false)

    const getTestDetails = async (testCode) => {
        const success = handleInputErrors(testCode)
        if (!success) return

        setLoading(true)
        try {
            // Fetch test details
            const res = await fetch(`http://localhost:8000/api/tests/testDetails/${testCode}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            
            return data.test
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, getTestDetails }
}

function handleInputErrors(testCode) {
    if (!testCode) {
        toast.error("Test code is required")
        return false
    }

    return true
}