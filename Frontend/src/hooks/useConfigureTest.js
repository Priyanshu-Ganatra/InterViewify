import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useConfigureTest() {
    const [loading, setLoading] = useState(false)
    const [err, setError] = useState(false)

    const configureTest = async ({ testCode, rounds, passingCriteria }) => {
        const success = handleInputErrors(rounds)
        if (!success){ 
            setError(true)
            return
        }
        else setError(false)

        setLoading(true)
        try {
            // console.log(rounds, testCode, passingCriteria);

            const res = await fetch('http://localhost:8000/api/tests/configure', {
                method: 'POST',
                body: JSON.stringify({ testCode, rounds, passingCriteria }),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)

            // toast.success(data.message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { err, loading, configureTest }
}

function handleInputErrors(rounds) {
    if (rounds.length === 0) {
        toast.error("Please add atleast one round")
        return false
    }
    return true
}