import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useJoinTest() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { authUser } = useAuthContext()

    const joinTest = async ({ testCode }) => {
        const success = handleInputErrors(testCode)
        if (!success) return   

        setLoading(true)
        try {
            const res = await fetch('http://localhost:8000/api/tests/join', {
                method: 'POST',
                body: JSON.stringify({ testCode, _id: authUser._id}),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)

            setSuccess(true)
            toast.success(data.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, success, joinTest }
}

function handleInputErrors(testCode) {
    if (!testCode) {
        toast.error("Test code is required")
        return false
    }

    return true
}