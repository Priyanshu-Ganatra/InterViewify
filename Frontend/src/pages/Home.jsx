import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from './Navbar';
import { Link, useNavigate } from "react-router-dom";
import useJoinTest from "@/hooks/useJoinTest";
import { useEffect, useState } from "react";
import { useTestContext } from "@/context/TestContext";
import useGetTestDetails from "@/hooks/useGetTestDetails";
import useViewLeaderboard from "@/hooks/useViewLeaderboard";
import { toast } from "react-hot-toast";

export default function Home() {
    document.title = "Home - InterViewify"
    const [testCode, setTestCode] = useState('')
    const { loading, success, joinTest } = useJoinTest()
    const navigate = useNavigate()
    const { loading: getTestDetailsLoading, getTestDetails } = useGetTestDetails()
    const { setContextTestCode, setCurrentRound, setRounds, setPassingCriteria } = useTestContext()
    const { loading: viewLeaderboardLoading, viewLeaderboard } = useViewLeaderboard()

    function isLaptopOrPC() {
        // Check screen size
        if (window.screen.width >= 1024 && window.screen.height >= 768) {
            return true; // Assuming laptop or PC based on screen size
        }

        // Check for mouse or touch input
        if (matchMedia("(pointer:fine)").matches) {
            return true; // Assuming laptop or PC based on fine pointer input (e.g., mouse)
        }

        // Check if device is capable of running desktop-class browsers
        var isDesktopBrowser = !(/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        if (isDesktopBrowser) {
            return true; // Assuming laptop or PC based on browser capabilities
        }

        // If none of the above conditions are met, assume it's not a laptop or PC
        return false;
    }

    const isAllWhitespace = (str) => {
        return !str.replace(/\s/g, '').length;
    }

    const handleViewLeaderboard = async () => {
        if (isAllWhitespace(testCode)) {
            return;
        }
        const doesTestExist = await viewLeaderboard({ testCode });
        if (doesTestExist) {
            navigate('/leaderboard/' + testCode)
        }
    }

    const handleJoinTest = async () => {
        if (!isLaptopOrPC()) {
            toast.error("Please join the test using a laptop or PC only.")
            return;
        }
        if (isAllWhitespace(testCode)) {
            return;
        }
        await joinTest({ testCode });
    }

    useEffect(() => {
        // Check if 'success' state has changed
        if (success) {
            try {
                // Perform actions here after successful joinTest()
                const fetchData = async () => {
                    const testDetails = await getTestDetails(testCode);
                    setContextTestCode(testCode);
                    setCurrentRound(testDetails.rounds[0].name);
                    setRounds(testDetails.rounds);
                    setPassingCriteria(testDetails.passingCriteria);
                    navigate(`/waiting/${testCode}`);
                };
                fetchData();
            } catch (error) {
                console.error('Error fetching test details:', error);
            }
        }
    }, [success]);

    return (
        <>
            <Navbar />
            <section className='bg-[#09090b] min-h-screen flex items-center justify-center overflow-y-auto max-sm:pb-10'>
                {/* container */}
                <div className='sm:flex w-full pt-28 sm:py-10 sm:h-1/2 h-3/4 z-0'>
                    {/* left div */}
                    <div className='sm:w-[70%] pl-6 sm:pl-20 text-white'>
                        <h1 className="scroll-m-20 text-[#00D8FF] pb-2 text-4xl font-semibold tracking-tight mt-0">
                            How it works:
                        </h1>
                        <ul className="list-disc py-5 space-y-3 mt-2 mx-4">
                            <li>The test admin chooses which rounds to conduct in the test, the time limit for each round and the passing criteria for each round.</li>
                            <li>When the configuration is completed by test admin, a unique code is generated for the test, candidates can join the test using the same code.</li>
                            <li>Candidates must join the test via a laptop/PC only, any other means will not be allowed.</li>
                            <li>If the candidates try to change the window, exit fullscreen, or get any notifications, it will be counted as a violation. After three warnings a candidate will be disqualified.</li>
                            <li>Candidates get bonus points for faster and correct answers.</li>
                        </ul>
                    </div>

                    {/* right div */}
                    <div className='flex flex-col sm:mt-0 mt-8 justify-center sm:w-[30%]'>
                        <div className='flex flex-col space-y-6 items-center justify-center h-full'>
                            <Link to="/admin">
                                <Button className="w-40">Join as a test admin</Button>
                            </Link>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-40">Join as a candidate</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Join as a candidate</DialogTitle>
                                        <DialogDescription>
                                            Enter the test code provided by your test admin to join their test.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Test Code
                                            </Label>
                                            <Input id="name" value={testCode} onChange={(e) => setTestCode(e.target.value)} className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleJoinTest} disabled={loading}>
                                            {loading && getTestDetailsLoading ? <span className="loading loading-spinner"></span> : 'Join'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Dialog className="bg-black">
                                <DialogTrigger asChild>
                                    <Button className="w-40">View leaderboard</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>View leaderboard</DialogTitle>
                                        <DialogDescription>
                                            View leaderboard of an ongoing/finished test.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Code
                                            </Label>
                                            <Input id="name" value={testCode} onChange={(e) => setTestCode(e.target.value)} className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleViewLeaderboard} disabled={viewLeaderboardLoading}>
                                            {viewLeaderboardLoading ? <span className="loading loading-spinner"></span> : 'View'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}