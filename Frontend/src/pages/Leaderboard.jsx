import logo from '../assets/logoFull.png';
import logoHalf from '../assets/logoHalf.png';
import LeaderBoardTable from '@/components/LeaderBoardTable'
import { Link } from 'react-router-dom';
import JoinedCandidatesSheet from '@/components/JoinedCandidatesSheet';
import { useEffect, useState } from 'react';

function Leaderboard() {
    document.title = "Leaderboard - InterViewify"
    const [testCode, setTestCode] = useState('');

    useEffect(() => {
        const urlPath = window.location.pathname;
        const parts = urlPath.split("/");
        const testCode = parts[parts.length - 1];
        setTestCode(testCode);
    }, []);

    return (
        <>
            <nav className='fixed flex px-6 py-8 sm:px-0 justify-evenly w-full items-center z-10 bg-[#09090b]'>
                <Link to={'/'}>
                    <img src={logo} alt="" className='hidden sm:block' />
                    <img src={logoHalf} alt="" className='block sm:hidden' />
                </Link>
                <div className='hidden w-1/3 text-white sm:block'>
                    <h2 className="pb-2 text-3xl font-semibold tracking-tight text-center scroll-m-20 first:mt-0">
                        Leaderboard
                    </h2>
                </div>
                <div>
                    <JoinedCandidatesSheet testCode={testCode}></JoinedCandidatesSheet>
                </div>
            </nav>
            <LeaderBoardTable />
        </>
    )
}

export default Leaderboard