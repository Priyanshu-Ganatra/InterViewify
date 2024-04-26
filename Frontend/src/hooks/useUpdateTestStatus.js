import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useUpdateTestStatus() {
    const [loading, setLoading] = useState(false)
    const { authUser } = useAuthContext()

    const updateTestStatus = async (testStatus, testCode) => {
        
        setLoading(true)
        let id = authUser._id
        try {
            const res = await fetch("http://localhost:8000/api/tests/updateTestStatus", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, testCode, testStatus })
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error)
            }

            // toast.success("Test status updated")
            // console.log("Test status updated")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, updateTestStatus }
}
