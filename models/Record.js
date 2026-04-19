import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['folder', 'document'], required: true },
    icon: { type: String, default: '📁' },
    color: { type: String, default: '#0d9488' },
    userId: { type: String, required: true },
    folderId: { type: String, default: null },
    fileUrl: { type: String, default: null },
    fileType: { type: String, default: null },
    fileSize: { type: Number, default: 0 },
    summary: { type: String, default: null },
    highlights: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Record || mongoose.model('Record', RecordSchema);
