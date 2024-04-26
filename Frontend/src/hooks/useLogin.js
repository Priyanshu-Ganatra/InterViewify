import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

function useLogin() {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const login = async ({email, password}) => {
        const success = handleInputErrors(email, password)
        if (!success) return

        setLoading(true)
        try {
            const res = await fetch("http://localhost:8000/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (data.error) {
                throw new Error(data.error)
            }

            // localstorage
            localStorage.setItem('localuser', JSON.stringify(data))
            // context
            setAuthUser(data.user)
            // toast.success("Login successful")
            window.location.reload();
        } catch (error) {
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    return { loading, login }
}

export default useLogin

function handleInputErrors(email, password) {
    if (!email || !password) {
        toast.error("Please fill in all fields")
        return false
    }

    return true
}
