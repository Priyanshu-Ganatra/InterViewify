import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import { toast } from "react-hot-toast"

function useSignup() {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const signup = async ({ name, email, password, confPass }) => {
        const success = handleInputErrors(name, email, password, confPass)
        if (!success) return

        setLoading(true)
        try {
            const res = await fetch('http://localhost:8000/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, confPass })
            })

            const data = await res.json()

            if (data.error) throw new Error(data.error)

            // localstorage
            localStorage.setItem('localuser', JSON.stringify(data))
            // context
            setAuthUser(data.user)
            // toast.success("Signup successful")
            window.location.reload();
        } catch (error) {
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    return { loading, signup }
}

export default useSignup

function handleInputErrors(name, email, pass, confpass) {
    if (!name || !email || !pass || !confpass) {
        toast.error('Please fill in all fields')
        return false
    }

    if (pass !== confpass) {
        toast.error('Passwords do not match')
        return false
    }
    return true
}