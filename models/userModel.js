import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    avatar: {
        type: String,
        default: "https://png.pngtree.com/png-clipart/20200701/original/pngtree-character-default-avatar-png-image_5407167.jpg",
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "manager", "admin"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: Number,
    },
    verificationExpiration: {
        type: Date,
    },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
}, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;

