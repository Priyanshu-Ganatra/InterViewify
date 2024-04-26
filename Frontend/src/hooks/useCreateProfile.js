import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function useCreateProfile() {
    const [loading, setLoading] = useState(false)
    const { authUser, setAuthUser } = useAuthContext()

    const createProfile = async ({ resume, branch, year }) => {
        const success = handleInputErrors(resume, branch, year)
        if (!success) return

        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('id', authUser._id);
            formData.append('resume', resume);
            formData.append('branch', branch);
            formData.append('year', year);

            const res = await fetch('http://localhost:8000/api/user/register', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()

            if (data.error) throw new Error(data.error)

            // localstorage
            localStorage.setItem('localuser', JSON.stringify(data))
            // context
            setAuthUser(data.user)
            // toast.success("Profile created successfully")
            window.location.reload();
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, createProfile }
}

function handleInputErrors(resume, branch, year) {
    if (!resume || !branch || !year) {
        toast.error('Please fill in all fields')
        return false
    }
    return true
}