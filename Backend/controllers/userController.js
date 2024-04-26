import UserModel from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { v2 as cloudinary } from 'cloudinary';

async function uploadFileToCloudinary(file, folder) {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, { folder, resource_type: "auto" });
        return result;
    } catch (error) {
        throw error;
    }
}

// logout user
const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password);
        generateTokenAndSetCookie(user._id, res)

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// signup user
const signupUser = async (req, res) => {
    let { name, email, password, confPass } = req.body;
    name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    try {
        const user = await UserModel.signup(name, email, password, confPass);
        generateTokenAndSetCookie(user._id, res)

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// register user
const registerUser = async (req, res) => {
    const { id, branch, year } = req.body;

    try {
        // fetch resume pdf file
        let resume = req.files.resume;

        // validation 
        const supportedType = "pdf"
        const fileType = resume.name.split('.')[1].toLowerCase()

        if (fileType !== supportedType) {
            throw new Error("Only pdf files are supported")
        }

        // Check file size (in bytes)
        const maxSizeBytes = 2 * 1024 * 1024; // 2MB
        if (resume.size > maxSizeBytes) {
            throw new Error("Pdf should be max 2MB in size");
        }

        // file format is supported
        const response = await uploadFileToCloudinary(resume, "resumes")
        // console.log({ response });
        resume = response.secure_url;

        const user = await UserModel.register(id, branch, year, resume);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
}

// update user
const updateUser = async (req, res) => {
    let resume, profilePic, id, name, email, password, branch, year;

    if (req.files) {
        if (req.files.resume && req.files.profilePic) {
            resume = req.files.resume
            profilePic = req.files.profilePic
        }
        else if (req.files.resume && !req.files.profilePic) {
            resume = req.files.resume
            profilePic = req.body.profilePic;
        }
        else if (!req.files.resume && req.files.profilePic) {
            profilePic = req.files.profilePic
            resume = req.body.resume;
        }
    }
    else {
        profilePic = req.body.profilePic;
        resume = req.body.resume;
    }
    id = req.body.id;
    name = req.body.name;
    email = req.body.email;
    password = req.body.password;
    branch = req.body.branch;
    year = req.body.year;

    // console.log({ resume, profilePic, id, name, email, password, branch, year });
    // console.log('\n');

    try {
        const supportedTypes = ['jpeg', 'jpg', 'png', 'jfif']
        const resumeSupportedType = "pdf"

        if (req.files) {
            if (req.files.resume && req.files.profilePic) {
                const fileTypeResume = resume.name.split('.')[1].toLowerCase()
                const fileTypePfp = profilePic.name.split('.')[1].toLowerCase()

                if (!supportedTypes.includes(fileTypePfp)) {
                    throw new Error("Only jpeg, jpg & png image files are supported for pfp")
                }
                if (fileTypeResume !== resumeSupportedType) {
                    throw new Error("Resume should be in pdf format")
                }

                // Check file size (in bytes)
                const maxSizeBytes = 2 * 1024 * 1024; // 2MB
                if (resume.size > maxSizeBytes || profilePic.size > maxSizeBytes) {
                    throw new Error("Files should be max 2MB in size");
                }

                // file format is supported
                const response1 = await uploadFileToCloudinary(resume, "resumes")
                const response2 = await uploadFileToCloudinary(profilePic, "pfps")
                // console.log({ response1, response2 });
                resume = response1.secure_url;
                profilePic = response2.secure_url;
            }
            else if (req.files.resume && !req.files.profilePic) {
                const fileTypeResume = resume.name.split('.')[1].toLowerCase()

                if (fileTypeResume !== resumeSupportedType) {
                    throw new Error("Resume should be in pdf format")
                }

                // Check file size (in bytes)
                const maxSizeBytes = 2 * 1024 * 1024; // 2MB
                if (resume.size > maxSizeBytes) {
                    throw new Error("Resume should be max 2MB in size");
                }

                // file format is supported
                const response = await uploadFileToCloudinary(resume, "resumes")
                // console.log({ response });
                resume = response.secure_url;
            }
            else if (!req.files.resume && req.files.profilePic) {
                const fileTypePfp = profilePic.name.split('.')[1].toLowerCase()

                if (!supportedTypes.includes(fileTypePfp)) {
                    throw new Error("Only jpeg, jpg & png image files are supported for pfp")
                }

                // Check file size (in bytes)
                const maxSizeBytes = 2 * 1024 * 1024; // 2MB
                if (profilePic.size > maxSizeBytes) {
                    throw new Error("Pfp should be max 2MB in size");
                }

                // file format is supported
                const response = await uploadFileToCloudinary(profilePic, "pfps")
                // console.log({ response });
                profilePic = response.secure_url;
            }
        }

        const user = await UserModel.update(id, name, email, password, branch, profilePic, year, resume);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
}

// all users
const allUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        if (!users) throw new Error("No users found");
        res.status(200).json({ users });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// one user
const oneUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        if (!user) throw new Error("User not found");
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export { loginUser, logoutUser, signupUser, registerUser, updateUser, allUsers, oneUser } 