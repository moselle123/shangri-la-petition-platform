import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	name: {type: String},
	password: {type: String, required: true},
	dob: {type: Date},
	bioId: {type: String},
	role: {type: String, default: 'petitioner'},
});

let User = mongoose.model('User', userSchema);
export default User;
