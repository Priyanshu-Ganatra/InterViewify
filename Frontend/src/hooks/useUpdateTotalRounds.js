import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useUpdateTotalRounds() {
    const [loading, setLoading] = useState(false)
    const {authUser} = useAuthContext()

    const updateTotalRounds = async (totalRounds, testCode) => {
        let id = authUser._id
        setLoading(true)
        try {
            const res = await fetch("http://localhost:8000/api/tests/updateTotalRounds", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, testCode, totalRounds })
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error)
            }

            // toast.success(data.message)

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, updateTotalRounds }
}
