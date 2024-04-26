import React, { useState } from "react";
import { Button } from '../components/ui/button'
import useCreateProfile from "@/hooks/useCreateProfile";
import { useAuthContext } from "@/context/AuthContext";

export default function CreateProfile() {
    document.title = "Create your profile - InterViewify"
    const [file, setFile] = useState(null); // State to store the selected file
    const [branch, setBranch] = useState(''); // State to store the selected branch
    const [year, setYear] = useState(''); // State to store the selected year
    const { authUser } = useAuthContext()
    const firstName = authUser.name.split(" ")[0]


    const { loading, createProfile } = useCreateProfile();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createProfile({ resume: file, branch, year });
    }

    return (
        <>
            <section className='bg-[#09090b] min-h-screen p-12 flex-col flex items-center justify-center'>
                <h1 className="text-4xl font-bold text-[#00D8FF] capitalize scroll-m-20 lg:text-5xl">
                    Welcome {firstName}! Now Create Your Profile
                </h1>

                <h4 className="mt-5 text-lg tracking-tight text-white scroll-m-20">
                    This is what viewers will see when they click on your profile through the leaderboard. You can edit this information at any time.
                </h4>

                <form className="w-full mt-8 flex flex-col items-center" onSubmit={handleSubmit}>
                    <div className="w-[300px] flex-col items-center">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Upload your resume</span>
                            </div>
                            <input type="file" className="file-input text-white file-input-bordered w-full max-w-xs" onChange={handleFileChange} />
                        </label>
                        <select id="branch" className="select select-bordered border-white w-full max-w-xs bg-[#09090b] mt-10 text-white" onChange={(e) => setBranch(e.target.value)}>
                            <option disabled selected>Select your branch of study</option>
                            <option value="cse">Computer science engineering</option>
                            <option value="etc">Electronics & telecommunication</option>
                            <option value="mech">Mechanical Engineering</option>
                            <option value="civil">Civil Engineering</option>
                            <option value="elec">Electrical Engineering</option>
                            <option value="other">Other</option>
                        </select>
                        <select id="year" className="select select-bordered border-white w-full max-w-xs mt-10 bg-[#09090b] text-white" onChange={(e) => setYear(e.target.value)}>
                            <option disabled selected>Select your current year in college</option>
                            <option value="1">First</option>
                            <option value="2">Second</option>
                            <option value="3">Third</option>
                            <option value="4">Fourth</option>
                            <option value="5">Graduated</option>
                        </select>
                        <div className="flex justify-center mt-10">
                            <Button disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Save & proceed'}
                            </Button>
                        </div>
                    </div>
                </form>
            </section>
        </>
    )
}
