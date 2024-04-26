import logo from '../assets/logoFull.png';
import logoHalf from '../assets/logoHalf.png';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthContext } from "@/context/AuthContext";
import useLogout from '@/hooks/useLogout';
import { useState } from 'react';
import useUpdateProfile from '@/hooks/useUpdateProfile';
import { Link } from 'react-router-dom';

function Navbar() {
    const { authUser } = useAuthContext()
    const { loading, logout } = useLogout()
    const pfp = authUser.profilePic
    const username = authUser.name
    const authEmail = authUser.email
    const authYear = authUser.registrationDetails.year
    const authBranch = authUser.registrationDetails.branch
    const authResume = authUser.registrationDetails.resume

    const [name, setName] = useState(username);
    const [email, setEmail] = useState(authEmail);
    const [password, setPass] = useState('');
    const [profilePic, setProfilePic] = useState(pfp);
    const [resume, setResume] = useState(authResume);
    const [branch, setBranch] = useState(authBranch);
    const [year, setYear] = useState(authYear);

    const handlePfpChange = (e) => {
        const selectedFile = e.target.files[0];
        setProfilePic(selectedFile);
    }
    const handleResumeChange = (e) => {
        const selectedFile = e.target.files[0];
        setResume(selectedFile);
    }

    const { updateProfileLoading, updateProfile } = useUpdateProfile()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProfile({ name, email, password, profilePic, resume, branch, year })
    }

    return (
        <>
            <nav className='fixed flex px-6 justify-center py-8 sm:px-0 sm:justify-evenly w-full items-center z-10 bg-[#09090b]'>
                <Link to={'/'}>
                    <img src={logo} alt="" className='hidden sm:block' />
                    <img src={logoHalf} alt="" className='block sm:hidden' />
                </Link>
                <div className='w-1/3'></div>

                <div className='flex space-x-6'>
                    <Avatar>
                        <AvatarImage src={pfp} alt="@shadcn" />
                        <AvatarFallback><span className="loading loading-spinner"></span></AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='text-white outline-none'>{username}</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <p className='text-center hover:bg-slate-100 rounded cursor-pointer text-sm p-1'>Edit Profile</p>
                                </DialogTrigger>
                                <form>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit profile</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Name
                                                </Label>
                                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="email" className="text-right">
                                                    Email
                                                </Label>
                                                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="pass" className="text-right">
                                                    Change Password
                                                </Label>
                                                <Input id="pass" value={password} onChange={(e) => setPass(e.target.value)} className="col-span-3" placeholder="Create a new password or leave blank" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">
                                                    Update pfp
                                                </Label>
                                                <input type="file" className="file-input col-span-3 file-input-ghost bg-white w-full max-w-xs" onChange={handlePfpChange} />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">
                                                    Update resume
                                                </Label>
                                                <input type="file" className="file-input col-span-3 file-input-ghost bg-white w-full max-w-xs" onChange={handleResumeChange} />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right" htmlFor="branch">
                                                    Update branch
                                                </Label>
                                                <select id="branch" value={branch} className="select col-span-3 select-bordered border-white w-full max-w-xs bg-white" onChange={(e) => setBranch(e.target.value)}>
                                                    <option disabled>Select your branch</option>
                                                    <option value="cse">Computer science engineering</option>
                                                    <option value="etc">Electronics & telecommunication</option>
                                                    <option value="mech">Mechanical Engineering</option>
                                                    <option value="civil">Civil Engineering</option>
                                                    <option value="elec">Electrical Engineering</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right" htmlFor="year">
                                                    Update year
                                                </Label>
                                                <select id="year" value={year} className="select col-span-3 select-bordered border-white w-full max-w-xs bg-white" onChange={(e) => setYear(e.target.value)}>
                                                    <option disabled>Select current year in college</option>
                                                    <option value="1">First</option>
                                                    <option value="2">Second</option>
                                                    <option value="3">Third</option>
                                                    <option value="4">Fourth</option>
                                                </select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button>
                                                <a href={authUser.registrationDetails.resume} download="resume.pdf" target="_blank">
                                                    Download Resume
                                                </a>
                                            </Button>
                                            <Button disabled={updateProfileLoading} className="max-sm:mb-2" onClick={handleSubmit} type="submit">
                                                {updateProfileLoading ? <span className="loading loading-spinner"></span> : 'Save changes'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </form>
                            </Dialog>

                            <span onClick={logout}>
                                {loading ? <span className='flex justify-center'><span className="loading loading-spinner"></span></span> : <p className='text-center hover:bg-slate-100 rounded cursor-pointer text-sm p-1'>Log out</p>}
                            </span>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav >
        </>
    )
}

export default Navbar