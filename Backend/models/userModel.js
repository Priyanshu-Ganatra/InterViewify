import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registrationDetails: {
        branch: {
            type: String,
            default: null
        },
        year: {
            type: Number,
            default: null
        },
        resume: {
            type: String,
            default: null
        }
    },
    profilePic: {
        type: String,
        default: ""
    }
});

// static signup method
userSchema.statics.signup = async function (name, email, password, confPass) {

    // validation
    if (!email || !password || !name || !confPass) throw new Error("All fields are required");
    if (!validator.isEmail(email)) throw new Error("Invalid email");
    if (!validator.isStrongPassword(password)) throw new Error("Password is not strong enough");
    if (password !== confPass) throw new Error("Passwords do not match");
    name = name.trim()
    const nameArr = name.split(" ");
    if (nameArr.length < 2 || nameArr.length > 2) throw new Error("Name should have two words separated by a space");
    if (nameArr[1] == "") throw new Error("Enter first and last name");

    const exists = await this.findOne({ email });
    if (exists) throw new Error("Email already in use");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const profilePic = `https://ui-avatars.com/api/?name=${nameArr[0]}+${nameArr[1]}`;

    const user = await this.create({ name, email, password: hash, profilePic });
    return user;
}

// static login method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) throw new Error("All fields are required");
    const user = await this.findOne({ email });
    if (!user) throw new Error("Invalid email");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid password");
    return user;
}

// static register method
userSchema.statics.register = async function (id, branch, year, resume) {
    if (!id || !branch || !year || !resume) throw new Error("All fields are required");
    const user = await this.findById(id);
    if (!user) throw new Error("User not found");

    const updatedUser = await this.findByIdAndUpdate(id, { registrationDetails: { branch, year, resume } }, { new: true });

    return updatedUser;
}

// static update method
userSchema.statics.update = async function (id, name, email, password, branch, profilePic, year, resume) {
    if (typeof year == "string") year = parseInt(year);
    if (!id || !name || !email) throw new Error("Name and email are required");
    name = name.trim()
    const nameArr = name.split(" ");
    if (nameArr.length < 2 || nameArr.length > 2) throw new Error("Name should have two words separated by a space");
    if (nameArr[1] == "") throw new Error("Enter first and last name");
    const user = await this.findById(id);
    if (!user) throw new Error("User not found");
    if (!validator.isEmail(email)) throw new Error("Invalid email");
    const exists = await this.findOne({ email });
    if (exists && email != user.email) throw new Error("Email already in use");

    if (password) {
        if (!validator.isStrongPassword(password)) throw new Error("Password is not strong enough");
        const match = await bcrypt.compare(password, user.password);
        if (match) throw new Error("New password cannot be same as old password");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const updatedUser = await this.findByIdAndUpdate(id, { name, email, password: hash, profilePic, registrationDetails: { branch, year, resume } }, { new: true });
        return updatedUser;
    }
    else {
        const pfpArray = profilePic.split("/");
        if (pfpArray.includes("ui-avatars.com")) {
            profilePic = `https://ui-avatars.com/api/?name=${nameArr[0]}+${nameArr[1]}`;
        }
        const updatedUser = await this.findByIdAndUpdate(id, { name, email, profilePic, registrationDetails: { branch, year, resume } }, { new: true });
        return updatedUser;
    }
}

const UserModel = mongoose.model("User", userSchema);
export default UserModel;