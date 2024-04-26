import { Input } from "@/components/ui/input"
import { Label } from '@radix-ui/react-dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import useGetLeaderboardData from "@/hooks/useGetLeaderboardData";
import { useEffect, useState } from "react";

function LeaderBoardTable({ inTest }) {
    const { getLeaderboardData } = useGetLeaderboardData()
    const [candidatesData, setCandidatesData] = useState([])

    const getYear = (year) => {
        if (year === '1') {
            return 'First';
        }
        else if (year === '2') {
            return 'Second';
        }
        else if (year === '3') {
            return 'Third';
        }
        else if (year === '4') {
            return 'Fourth';
        }
        else {
            return 'Graduated';
        }
    }

    const getBranchName = (branch) => {
        if (branch === 'cse') {
            return 'Computer Science Engineering';
        }
        else if (branch === 'etc') {
            return 'Electronics & Telecommunication';
        }
        else if (branch === 'mech') {
            return 'Mechanical Engineering';
        }
        else if (branch === 'civil') {
            return 'Civil Engineering';
        }
        else if (branch === 'elec') {
            return 'Electrical Engineering';
        }
        else {
            return 'Other';
        }
    }

    const getRoundName = (round) => {
        if (round === 'apti') {
            return 'General Aptitude';
        }
        else if (round === 'cs') {
            return 'CS Fundamentals';
        }
        else if (round === 'coding') {
            return 'Coding quiz';
        }
    }

    useEffect(() => {
        const urlPath = window.location.pathname;
        const parts = urlPath.split("/");
        const testCode = parts[parts.length - 1];

        const getData = async () => {
            const data = await getLeaderboardData(testCode)
            if (data.length != 0) {
                const sortedCandidateDetails = data.candidateDetails.sort((a, b) => b.score - a.score);
                // console.log(sortedCandidateDetails);
                setCandidatesData(sortedCandidateDetails);
            }
        }
        setInterval(() => {
            getData()
        }, 1000);
    }, []);

    return (
        <div className={`${inTest ? '' : 'bg-[#09090b] text-white'} flex flex-col items-center ${inTest ? '' : 'w-screen h-screen pt-28'}`}>
            <h2 className="pb-2 text-3xl font-semibold tracking-tight text-center scroll-m-20 sm:hidden first:mt-0 max-sm:mb-4">
                Leaderboard
            </h2>
            <div className={`${inTest ? '' : 'sm:w-[900px] max-sm:w-[80vw]'}`}>
                <div className={`rounded ${candidatesData.length != 0 ? 'border' : ''}`}>
                    {candidatesData.length != 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center ">Rank</TableHead>
                                    <TableHead className="text-center ">Name</TableHead>
                                    <TableHead className="text-center">Score</TableHead>
                                    <TableHead className="text-center">Rounds Passed</TableHead>
                                    <TableHead className="text-center">Current round</TableHead>
                                    <TableHead className="text-center">Test status</TableHead>
                                    <TableHead className="text-center">Profile</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {candidatesData.length !== 0 && candidatesData.map((candidate, index) => (
                                    <TableRow key={candidate._id}>
                                        <TableCell className="text-center">{candidate.score ? index + 1 : "--"}</TableCell>
                                        <TableCell className="text-center">{candidate.candidateId.name}</TableCell>
                                        <TableCell className="text-center">{candidate.score}</TableCell>
                                        <TableCell className="text-center">{candidate.passedRounds}/{candidate.totalRounds}</TableCell>
                                        <TableCell className="text-center">{candidate.testStatus == "ended" ? getRoundName(candidate.currentRound) + " (last round)" : getRoundName(candidate.currentRound)}</TableCell>
                                        <TableCell className="text-center">{candidate.testStatus.charAt(0).toUpperCase() + candidate.testStatus.slice(1)}</TableCell>
                                        <TableCell className="text-center">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className='hover:cursor-pointer hover:text-green-400 hover:scale-105'>View Profile</div>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>{candidate.candidateId.name}'s Profile</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className='flex justify-center w-full'>
                                                            <Avatar>
                                                                <AvatarImage src={candidate.candidateId.profilePic} alt={candidate.candidateId.name} />
                                                                <AvatarFallback>{candidate.candidateId.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                        <div className="grid items-center grid-cols-4 gap-4">
                                                            <Label htmlFor="username" className="text-right">
                                                                Branch
                                                            </Label>
                                                            <Input disabled id="username" value={getBranchName(candidate.candidateId.registrationDetails.branch)} className="col-span-3" />
                                                        </div>
                                                        <div className="grid items-center grid-cols-4 gap-4">
                                                            <Label htmlFor="username" className="text-right">
                                                                Year
                                                            </Label>
                                                            <Input disabled id="username" value={getYear(candidate.candidateId.registrationDetails.year)} className="col-span-3" />
                                                        </div>
                                                        <div className='flex justify-center w-full'>
                                                            <div title={inTest ? "Can't download while a test is in progress" : ''}>
                                                                <Button disabled={inTest}>
                                                                    <a href={candidate.candidateId.registrationDetails.resume} download="resume.pdf" target="_blank">
                                                                        Download Resume
                                                                    </a>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className='text-center py-4 max-sm:px-4'>
                            Loading...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LeaderBoardTable