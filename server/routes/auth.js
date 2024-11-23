import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

let router = express.Router();

router.post('/register', (req, res) => {
	User.findOne({ email: req.body.email })
	.then((existingUser) => {
		if (existingUser) {
			return Promise.reject({ status: 400, message: 'Email is already in use.' });
		}
		return bcrypt.hash(req.body.password, 10)
	})
	.then((hashedPassword) => {
		let newUser = new User({
			email: req.body.email,
			name: req.body.name,
			password: hashedPassword,
			dob: req.body.dob,
			bioId: req.body.bioId,
			role: req.body.role,
		});

		return newUser.save();
	})
	.then((savedUser) => {
		let token = jwt.sign({id: savedUser._id, role: savedUser.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
		res.status(201).json({token});
	})
	.catch((err) => {
		err.status === 400 ? res.status(400).send('Error creating user.') : res.status(500).send('Error creating user.');
		console.error('Error creating user: ', err);
	});
});

router.post('/login', async (req, res) => {
	let user;
	let { email, password } = req.body;
	User.findOne({ email })
	.then((foundUser) => {
		if (foundUser) {
			user = foundUser;
			return bcrypt.compare(password, foundUser.password);
		}
		console.error('User not found');
		return false;
	})
	.then((authenticated) => {
		if (authenticated) {
			let token = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
			res.status(200).json({token});
		} else {
			res.status(401).send('Invalid credentials');
			console.error('Invalid credentials');
		}
	})
	.catch((err) => {
		res.status(500).send('Internal server error.');
		console.error('Error during login: ', err);
	});
});

export default router;