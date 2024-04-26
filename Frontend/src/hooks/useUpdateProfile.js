import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import { toast } from "react-hot-toast"

function useUpdateProfile() {
    const [updateProfileLoading, setLoading] = useState(false)
    const { authUser, setAuthUser } = useAuthContext()

    const updateProfile = async ({ name, email, password, profilePic, resume, branch, year }) => {
        const success = handleInputErrors(name, email)
        if (!success) return

        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('id', authUser._id);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('profilePic', profilePic);
            formData.append('resume', resume);
            formData.append('branch', branch);
            formData.append('year', year);

            // console.log({ name, email, password, profilePic, resume, branch, year });

            const res = await fetch('http://localhost:8000/api/user/update', {
                method: 'PUT',
                body: formData
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)

            // localstorage
            localStorage.setItem('localuser', JSON.stringify(data))
            // context
            setAuthUser(data.user)
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    return { updateProfileLoading, updateProfile }
}

export default useUpdateProfile

function handleInputErrors(name, email) {
    if (!name || !email) {
        toast.error('Name and email are required')
        return false
    }
    return true
}