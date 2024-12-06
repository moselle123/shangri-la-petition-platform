import mongoose from 'mongoose';

const petitionSchema = new mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	petitioner: {type: String, required: true},
	status: {type: String, default: 'open'},
	response: {type: String},
	signatures: [{ type: String }],
}, { timestamps: true });

let Petition = mongoose.model('Petition', petitionSchema);
export default Petition;
