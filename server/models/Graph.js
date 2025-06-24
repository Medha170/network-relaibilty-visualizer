const mongoose = require('mongoose');

const GraphSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nodes: { type: Number, required: true },
  edges: [[Number]],
  readOnly: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Graph', GraphSchema);