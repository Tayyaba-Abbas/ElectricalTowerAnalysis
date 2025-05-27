const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  email: { type: String, required: true },
  pdfFile: { type: String, required: true },
  downloadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('History', HistorySchema);