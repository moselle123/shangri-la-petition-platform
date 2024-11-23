import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	name: {type: String, required: true},
	password: {type: String, required: true},
	dob: {type: Date, required: true},
	bioId: {type: String, required: true},
	role: {type: String, default: 'petitioner'},
});

let User = mongoose.model('User', userSchema);
export default User;
