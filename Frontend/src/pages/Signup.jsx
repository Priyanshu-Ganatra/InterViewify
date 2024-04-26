import React, { useEffect, useRef, useState } from 'react'
import bgImage from '../assets/bg.png';
import { Link } from 'react-router-dom';
import useSignup from '@/hooks/useSignup';
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";

export default function Signup() {
    document.title = "Sign-up - InterViewify"
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [confPass, setConfPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);

    const passRef = useRef(null);
    const confPassRef = useRef(null);

    useEffect(() => {
        if (showPass) {
            passRef.current.type = 'text';
        } else {
            passRef.current.type = 'password';
        }
        if (showConfPass) {
            confPassRef.current.type = 'text';
        }
        else {
            confPassRef.current.type = 'password';
        }
    }, [showPass, showConfPass]);

    const { loading, signup } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup({ name, email, password, confPass });
    }

    return (
        <>
            <section className='bg-[#09090b] min-h-screen flex items-center justify-center'>
                {/* login container */}
                <div className='bg-[#323233] flex rounded-2xl shadow-lg max-w-3xl p-5 items-center min-h-[650px] scale-90'>
                    {/* form */}
                    <div className='px-8 md:w-1/2'>
                        <h2 className='text-2xl font-bold text-white'>Sign-up</h2>
                        <p className='mt-4 text-white'>Create your InterViewify account</p>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <input className='p-2 mt-8 border rounded-xl bg-white' type="text" name="username" placeholder='Full name' value={name} onChange={(e) => setName(e.target.value)} />
                            <input className='p-2 border rounded-xl bg-white' type="email" name="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <div className='relative'>
                                <input className='w-full p-2 border rounded-xl bg-white' type="password" name="password" placeholder='Create Password' value={password} onChange={(e) => setPass(e.target.value)} ref={passRef} />
                                {showPass ? < FiEyeOff id='passToggler' className='absolute -translate-y-1/2 cursor-pointer top-1/2 right-3' onClick={() => setShowPass(!showPass)} /> : < FiEye id='passToggler' className='absolute -translate-y-1/2 cursor-pointer top-1/2 right-3' onClick={() => setShowPass(!showPass)} />}
                            </div>
                            <div className='relative'>
                                <input className='w-full p-2 border rounded-xl bg-white' type="password" name="conf_password" placeholder='Confirm Password' value={confPass} onChange={(e) => setConfPass(e.target.value)} ref={confPassRef} />
                                {showConfPass ? < FiEyeOff id='confPassToggler' className='absolute -translate-y-1/2 cursor-pointer top-1/2 right-3' onClick={() => setShowConfPass(!showConfPass)} /> : < FiEye id='confPassToggler' className='absolute -translate-y-1/2 cursor-pointer top-1/2 right-3' onClick={() => setShowConfPass(!showConfPass)} />}
                            </div>
                            <button className='bg-[#D62F18] rounded-xl text-white py-2 hover:scale-105 duration-300' type='submit' disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Sign Up'}
                            </button>
                        </form>

                        <div className='grid items-center grid-cols-3 mt-10 text-gray-400'>
                            <hr className='border-gray-400' />
                            <p className='text-sm text-center'>OR</p>
                            <hr className='border-gray-400' />
                        </div>

                        <button className='flex items-center justify-center w-full py-2 mt-5 text-sm duration-300 bg-white border rounded-xl hover:scale-105'>
                            <img width="25px" className='mr-3' src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="" />
                            Sign-up using Google
                        </button>

                        <div className='flex items-center justify-between text-xs mt-9'>
                            <p className='text-white'>Got an account?</p>
                            <Link to="/login" className='px-5 py-2 ml-6 duration-300 bg-white border rounded-xl hover:scale-110'>Login</Link>
                        </div>
                    </div>

                    {/* image */}
                    <div className='hidden w-1/2 md:block'>
                        <img src={bgImage} className='rounded-2xl' alt="Background" />
                    </div>
                </div>
            </section>
        </>
    )
}
