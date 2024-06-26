import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

const useLogout = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const logout = async () => {
        setLoading(true)
        try {
            const res = await fetch("http://localhost:8000/api/user/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            const data = await res.json()

            if (data.error) {
                throw new Error(data.error)
            }

            localStorage.removeItem('localuser')
            setAuthUser(null)
            // toast.success(data.message)
        } catch (error) {
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    return { loading, logout }
}

export default useLogout