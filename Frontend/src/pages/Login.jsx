import bgImage from '../assets/bg.png'; // Import the image file
import React, { useEffect, useRef, useState } from 'react'
import useLogin from '@/hooks/useLogin';
import { Link } from 'react-router-dom';
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";

export default function Login() {
    document.title = "Login - InterViewify"
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const passRef = useRef(null);
    const [showPass, setShowPass] = useState(false);

    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email, password: pass })
    }

    useEffect(() => {
        if (showPass) {
            passRef.current.type = 'text';
        } else {
            passRef.current.type = 'password';
        }
    }, [showPass]);

    return (
        <>
            <section className='bg-[#09090b] min-h-screen flex items-center justify-center'>
                {/* login container */}
                <div className='bg-[#323233] flex rounded-2xl shadow-lg max-w-3xl p-5 items-center min-h-[650px] scale-90'>
                    {/* form */}
                    <div className='px-8 md:w-1/2'>
                        <h2 className='text-2xl font-bold text-white'>Login</h2>
                        <p className='mt-4 text-white'>Welcome to InterViewify!</p>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <input className='p-2 mt-8 border rounded-xl bg-white' type="text" name="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <div className='relative'>
                                <input className='w-full p-2 bg-white border rounded-xl' type="password" name="password" placeholder='Password' value={pass} ref={passRef} onChange={(e) => setPass(e.target.value)} />
                                {showPass ? < FiEyeOff id='passToggler' className='absolute -translate-y-1/2 cursor-pointer top-1/2 right-3' onClick={() => setShowPass(!showPass)} /> : < FiEye id='passToggler' className='absolute -translate-y-1/2 cursor-pointer top-1/2 right-3' onClick={() => setShowPass(!showPass)} />}
                            </div>
                            <button disabled={loading} className='bg-[#D62F18] rounded-xl text-white py-2 hover:scale-105 duration-300 disabled:cursor-wait'>
                                {loading ? <span className="loading loading-spinner"></span> : 'Login'}
                            </button>
                        </form>

                        <div className='grid items-center grid-cols-3 mt-10 text-gray-400'>
                            <hr className='border-gray-400' />
                            <p className='text-sm text-center'>OR</p>
                            <hr className='border-gray-400' />
                        </div>

                        <button className='flex items-center justify-center w-full py-2 mt-5 text-sm duration-300 bg-white border rounded-xl hover:scale-105'>
                            <img width="25px" className='mr-3' src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="" />
                            Login with Google
                        </button>

                        <a href="">
                            <div className='py-6 mt-5 text-xs text-white border-b'>Forgot your password?</div>
                        </a>

                        <div className='flex items-center justify-between mt-3 text-xs'>
                            <p className='text-white'>Don't have an account?</p>
                            <Link to="/signup" className='px-5 py-2 ml-6 duration-300 bg-white border rounded-xl hover:scale-110'>Register</Link>
                        </div>
                    </div>

                    {/* image */}
                    <div className='hidden w-1/2 md:block'>
                        <img src={bgImage} className='rounded-2xl' alt="Background" />
                    </div>
                </div>
            </section>
        </>
    );
}

