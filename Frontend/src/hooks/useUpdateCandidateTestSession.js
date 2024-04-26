import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useUpdateCandidateTestSession() {
    const [loading, setLoading] = useState(false)
    const { authUser } = useAuthContext()

    const updateCandidateTestSession = async (score, round, testCode) => {
        setLoading(true)
        try {
            let id = authUser._id
            // console.log(id, score, round);
            const res = await fetch("http://localhost:8000/api/tests/updateCandidateTestSession", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, score, round, testCode })
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error)
            }

            // toast.success("Test session updated")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, updateCandidateTestSession }
}
