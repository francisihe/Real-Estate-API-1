import mongoose from "mongoose";

const CaretakerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please provide a name"],
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: "caretaker",
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
}, { timestamps: true });

const CaretakerModel = mongoose.model("Caretaker", CaretakerSchema);
export default CaretakerModel;