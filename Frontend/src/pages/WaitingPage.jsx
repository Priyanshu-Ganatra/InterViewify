import { useTestContext } from '@/context/TestContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export default function WaitingPage() {
    document.title = "Waiting for the test to start - InterViewify"
    const { testCode } = useTestContext();
    const navigate = useNavigate();


    useEffect(() => {
        const interval = setInterval(() => {
            // Make a request to the backend to check if the test has started
            fetch(`http://localhost:8000/api/tests/hasTestStarted/${testCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.testStarted) {
                        // If the test has started, redirect to the test page
                        navigate(`/test/${testCode}`);
                        clearInterval(interval); // Stop checking once the test has started
                    }
                })
                .catch(error => {
                    console.error('Error checking test status:', error);
                });
        }, 1000);

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, [navigate]);

    return (
        <section className='bg-[#09090b] min-h-screen flex items-center justify-center overflow-y-auto'>
            <div className='flex flex-col space-y-6 items-center justify-center h-full'>
                <h1 className='text-4xl text-white'>Waiting for the admin to start the test...</h1>
            </div>
        </section>
    )
}