const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	signatures: [{ userId: mongoose.Schema.Types.ObjectId, signedAt: Date }],
});

module.exports = mongoose.model('Petition', petitionSchema);
