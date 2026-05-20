const mongoose = require('mongoose');

const SavedSearchSchema = new mongoose.Schema({
  clientId: { type: String, index: true, required: true },
  utility: { type: String, required: true },       // wallet-intelligence | reputation | compare | activity | analytics | discover
  label: { type: String, required: true },
  query: { type: Object, default: {} },
  payload: { type: Object, default: {} },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

SavedSearchSchema.index({ clientId: 1, createdAt: -1 });

module.exports = mongoose.model('SavedSearch', SavedSearchSchema);
