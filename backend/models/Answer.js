
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  body: String,
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);
