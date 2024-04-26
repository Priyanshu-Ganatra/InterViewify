import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import useGetJoinedCandidates from "@/hooks/useGetJoinedCandidates"

function JoinedCandidatesSheet({ testCode }) {
    const { loading, candidates, message, getJoinedCandidates } = useGetJoinedCandidates()

    const handleClick = async () => {
        await getJoinedCandidates( testCode )
        // console.log(candidates);
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button onClick={handleClick}>All candidates</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Candidates</SheetTitle>
                    <SheetDescription>
                        {(candidates.length == 0) ? message : 'These candidates have/had joined this test.'}
                    </SheetDescription>
                </SheetHeader>
                <div className='w-full h-[95%] py-4 flex flex-wrap content-start justify-center overflow-auto'>
                    {/* user cards */}
                    {loading ? <span className='flex justify-center'><span className="loading loading-spinner"></span></span> :
                        (candidates.length != 0) ? candidates.map(candidate => (
                            <div key={candidate.name} className='flex flex-col w-20 h-20 p-1 m-1 rounded-lg shadow-lg bg-slate-200 border-slate-100'>
                                <div className='flex justify-center'>
                                    <Avatar>
                                        <AvatarImage src={candidate.profilePic} alt={candidate.name} />
                                        <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='flex justify-center'>
                                    <p className='text-xs text-center'>{candidate.name}</p>
                                </div>
                            </div>
                        )) : ''
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default JoinedCandidatesSheet