import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useStartTest() {
    const [startTestLoading, setLoading] = useState(false)

    const startTest = async ({ testCode }) => {
        const success = handleInputErrors(testCode)
        if (!success) return   

        setLoading(true)
        try {
            const res = await fetch('http://localhost:8000/api/tests/start', {
                method: 'POST',
                body: JSON.stringify({ testCode }),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)

            toast.success(data.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { startTestLoading, startTest }
}

function handleInputErrors(testCode) {
    if (!testCode) {
        toast.error("Test code is required")
        return false
    }

    return true
}