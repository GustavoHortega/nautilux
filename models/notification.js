
const { Schema } = require('mongoose');

const NotificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vulnerability: {
        type: String,
        required: true
    },
    technology: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate notifications for the same user and vulnerability
NotificationSchema.index(
    { user: 1, vulnerability: 1 },
    { unique: true }
);

module.exports = NotificationSchema;
