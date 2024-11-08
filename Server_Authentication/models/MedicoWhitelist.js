// models/MedicoWhitelist.js
import mongoose from 'mongoose';

const MedicoWhitelistSchema = new mongoose.Schema({
    nip: {
        type: String,
        required: true,
        unique: true,
    },
});

export default mongoose.model('MedicoWhitelist', MedicoWhitelistSchema);
