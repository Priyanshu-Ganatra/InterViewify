import { toast } from "react-hot-toast"
import Navbar from './Navbar';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Label } from '@radix-ui/react-dropdown-menu';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { CopyIcon } from "@radix-ui/react-icons"
import { useAuthContext } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import useConfigureTest from '@/hooks/useConfigureTest';
import useStartTest from "@/hooks/useStartTest";
import { useNavigate } from 'react-router-dom';
import JoinedCandidatesSheet from "@/components/JoinedCandidatesSheet";

function TestAdminPage() {
    document.title = "Test Admin - InterViewify"
    const copyToClipboard = () => {
        navigator.clipboard.writeText(testCode)
            .then(() => {
                toast.success("Code copied to clipboard")
            })
            .catch((error) => {
                console.log(error.message);
                toast.error('Unable to copy text to clipboard')
            });
    };

    const { authUser } = useAuthContext()
    const username = authUser.name
    const firstName = username.split(' ')[0]

    const [passingCriteria, setPassingCriteria] = useState(50)
    const [selectedRounds, setSelectedRounds] = useState([]);
    const [testCode, setTestCode] = useState('')

    const [timeLimits, setTimeLimits] = useState({
        "apti": "10",
        "coding": "10",
        "cs": "10"
    })
    const handleRoundToggle = (value) => {
        if (selectedRounds.includes(value)) {
            setSelectedRounds(selectedRounds.filter((round) => round !== value));
        } else {
            setSelectedRounds([...selectedRounds, value]);
        }
    };

    useEffect(() => {
        function generateTestCode(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let testCode = '';
            for (let i = 0; i < length; i++) {
                testCode += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return testCode;
        }

        setTestCode(generateTestCode(6));
    }, []);

    const { err, loading, configureTest } = useConfigureTest()
    const { startTestLoading, startTest } = useStartTest()

    const handleGenerateCode = async () => {
        let rounds = selectedRounds.map((round) => {
            return {
                name: round,
                timeLimit: timeLimits[round]
            }
        })
        await configureTest({ testCode, rounds, passingCriteria })
    }

    const navigate = useNavigate();
    const handleStartTest = async () => {
        await startTest({ testCode })
        navigate('/leaderboard/' + testCode);
    }

    return (
        <>
            <Navbar />
            <section className='bg-[#09090b] min-h-screen flex items-center justify-center overflow-y-auto max-sm:pb-10'>
                {/* container */}
                <div className='z-0 w-full sm:flex pt-28 sm:pt-10 sm:h-1/2 h-3/4 '>
                    {/* left div */}
                    <div className='sm:w-[60%] pl-6 sm:pl-20 text-white'>
                        <h1 className="scroll-m-20 text-[#00D8FF] pb-2 text-4xl font-semibold tracking-tight mt-0">
                            Hey {firstName}! <br /> you've joined in as a Test Admin.
                        </h1>
                        <ul className="py-5 mx-4 mt-2 space-y-3 list-disc">
                            <li>You can conduct this test using your phone as well.</li>
                            <li>As the test starts you can access the leaderboard.</li>
                            <li>The amount of questions are decided by the time limits.</li>
                            <li>Candidates will appear on the leaderboard as soon as they score some points.</li>
                            <li>When you are done with the test configurations, click on the Generate Code button and <br /> share the generated code to the candidates then click on Start Test to begin.</li>
                            <li>The passing percentage applies to Aptitude & CS Fundamentals rounds only, candidates <br /> must pass all input test cases in the coding round to proceed to the next round.</li>
                        </ul>
                    </div>
                    {/* right div */}
                    <div className='sm:mt-0 flex-col mt-8 justify-center sm:w-[40%] text-white pl-6'>
                        <h1 className="scroll-m-20 text-[#00D8FF] tcen pb-2 text-4xl font-semibold tracking-tight mt-0">
                            Test configuration:
                        </h1>
                        <Label htmlFor="rounds" className='mt-5'>Select rounds for the test:</Label>
                        <ToggleGroup type="multiple" className="inline-block">
                            <ToggleGroupItem
                                value="apti"
                                aria-label="apti"
                                className="mr-3"
                                checked={selectedRounds.includes('apti')}
                                onClick={() => handleRoundToggle('apti')}
                            >
                                General Aptitude
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="coding"
                                aria-label="coding"
                                className="mr-3"
                                checked={selectedRounds.includes('coding')}
                                onClick={() => handleRoundToggle('coding')}
                            >
                                Coding
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="cs"
                                aria-label="cs"
                                checked={selectedRounds.includes('cs')}
                                onClick={() => handleRoundToggle('cs')}
                            >
                                CS Fundamentals
                            </ToggleGroupItem>
                        </ToggleGroup>

                        <div className='flex h-[70%] sm:w-[70%] pb-4'>
                            <div className='flex flex-col w-1/2'>
                                <Label htmlFor="box1" className='mt-3'>Select time limits:</Label>
                                <div className='flex flex-col pt-2 space-y-2' id='box1'>
                                    <Label htmlFor="aptiTime" className="text-white">General Aptitude</Label>
                                    <Select id="aptiTime" onValueChange={val => setTimeLimits({ ...timeLimits, "apti": val })}>
                                        <SelectTrigger className="w-24 text-white">
                                            <SelectValue placeholder="10 mins" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="10">10 mins</SelectItem>
                                                <SelectItem value="20">20 mins</SelectItem>
                                                <SelectItem value="30">30 mins</SelectItem>
                                                <SelectItem value="40">40 mins</SelectItem>
                                                <SelectItem value="60">60 mins</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Label htmlFor="codingTime" className="text-white">Coding</Label>
                                    <Select id="codingTime" onValueChange={val => setTimeLimits({ ...timeLimits, "coding": val })}>
                                        <SelectTrigger className="w-24 text-white">
                                            <SelectValue placeholder="10 mins" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="10">10 mins</SelectItem>
                                                <SelectItem value="20">20 mins</SelectItem>
                                                <SelectItem value="30">30 mins</SelectItem>
                                                <SelectItem value="40">40 mins</SelectItem>
                                                <SelectItem value="60">60 mins</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Label htmlFor="csTime" className="text-white">CS Fundamentals</Label>
                                    <Select id="csTime" onValueChange={val => setTimeLimits({ ...timeLimits, "cs": val })}>
                                        <SelectTrigger className="w-24 text-white">
                                            <SelectValue placeholder="10 mins" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="10">10 mins</SelectItem>
                                                <SelectItem value="20">20 mins</SelectItem>
                                                <SelectItem value="30">30 mins</SelectItem>
                                                <SelectItem value="40">40 mins</SelectItem>
                                                <SelectItem value="60">60 mins</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-col w-1/2'>
                                <Label htmlFor="box1" className='mt-3'>Other:</Label>
                                <div className='flex flex-col pt-2 space-y-2' id='box1'>
                                    <Label htmlFor="aptiTime" className="text-white">Passing percentage</Label>
                                    <Select id="aptiTime" onValueChange={val => setPassingCriteria(val)}>
                                        <SelectTrigger className="w-24 text-white">
                                            <SelectValue placeholder="50%" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="50">50%</SelectItem>
                                                <SelectItem value="60">60%</SelectItem>
                                                <SelectItem value="70">70%</SelectItem>
                                                <SelectItem value="75">75%</SelectItem>
                                                <SelectItem value="90">90%</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <div></div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className='w-1/2'>
                                                <Button onClick={handleGenerateCode} disabled={loading}>
                                                    {loading ? <span className='flex justify-center'><span className="loading loading-spinner"></span></span> : 'Generate code'}
                                                </Button>
                                            </div>
                                        </DialogTrigger>
                                        {!err && <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Share this code with candidates</DialogTitle>
                                                <DialogDescription>
                                                    Candidates will join the test using this code.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex items-center space-x-2">
                                                <div className="grid flex-1 gap-2">
                                                    <Label htmlFor="link" className="sr-only">
                                                        Code
                                                    </Label>
                                                    <Input
                                                        id="link"
                                                        defaultValue={testCode}
                                                        readOnly
                                                    />
                                                </div>
                                                <Button type="submit" size="sm" className="px-3">
                                                    <span className="sr-only">Copy</span>
                                                    <CopyIcon className="w-4 h-4" onClick={copyToClipboard} />
                                                </Button>
                                            </div>

                                            <DialogFooter className="sm:justify-start">
                                                <JoinedCandidatesSheet testCode={testCode}></JoinedCandidatesSheet>
                                                <DialogClose asChild>
                                                    <Button type="button" disabled={startTestLoading} className="max-sm:mb-2" onClick={handleStartTest}>
                                                        {startTestLoading ? <span className='flex justify-center'><span className="loading loading-spinner"></span></span> : 'Start test'}
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>}
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default TestAdminPage