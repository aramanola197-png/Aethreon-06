const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  clientId: { type: String, index: true, required: true },
  tag: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ clientId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
