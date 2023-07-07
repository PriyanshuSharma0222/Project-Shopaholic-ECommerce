import mongoose from "mongoose";

const MetaDataSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean
    },
    userID: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('metadatas', MetaDataSchema);