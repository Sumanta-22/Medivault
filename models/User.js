import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountType: { type: String, enum: ['individual', 'family'], default: 'individual' },
    familyMembers: [
        {
            name: String,
            relation: String,
            age: Number,
        },
    ],
    emergencyProfile: {
        bloodGroup: { type: String, default: '' },
        allergies: [String],
        medications: [String],
        emergencyContacts: [
            {
                name: String,
                phone: String,
                relation: String,
            },
        ],
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
