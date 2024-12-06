import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import authenticate from '../middleware/authenticate.js';
import {getValidBioIds} from '../models/variables.js';

let router = express.Router();

router.post('/register', (req, res) => {
	let {email, name, password, dob, bioId} = req.body;
	if (!(email && name && password && dob && bioId)) {
		res.status(400).json({ status: 400, message: 'Insufficient data provided.' });
	}

	if (!getValidBioIds().includes(bioId)) {
		res.status(400).json({ status: 400, message: 'Invalid Biometric ID.' });
	}

	User.findOne({ bioId })
	.then((existingUser) => {
		if (existingUser) {
			return Promise.reject({ status: 400, message: 'Biometric ID is already in use.' });
		}
		return User.findOne({ email })
	})
	.then((existingUser) => {
		if (existingUser) {
			return Promise.reject({ status: 400, message: 'Email is already in use.' });
		}
		return bcrypt.hash(req.body.password, 10)
	})
	.then((hashedPassword) => {
		let newUser = new User({
			email,
			name,
			password: hashedPassword,
			dob,
			bioId,
		});

		return newUser.save();
	})
	.then((savedUser) => {
		let token = jwt.sign({email: savedUser.email, role: savedUser.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
		res.status(201).json({token});
	})
	.catch((err) => {
		err.status === 400 ? res.status(400).send(err.message) : res.status(500).send('Error creating user.');
		console.error('Error creating user: ', err);
	});
});

router.post('/register-admin', (req, res) => {
	let {email, password, role} = req.body;
	bcrypt.hash(req.body.password, 10)
	.then((hashedPassword) => {
		let newUser = new User({
			email,
			password: hashedPassword,
			role,
		});
		return newUser.save()
	})
	.then((savedUser) => {
		res.status(201);
	})
	.catch((err) => {
		err.status === 400 ? res.status(400).send('Error creating user.') : res.status(500).send('Error creating user.');
		console.error('Error creating user: ', err);
	});
});

router.post('/login', (req, res) => {
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
			let accessToken = jwt.sign({email: user.email, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
			let refreshToken = jwt.sign({email: user.email, role: user.role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'Strict',
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});
			res.status(200).json({accessToken});
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

router.post('/logout', (req, res) => {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'Strict',
	});
	res.status(200).send('Logged out successfully');
});

router.get('/user', authenticate, (req, res) => {
	res.status(200).json({email: req.user.email, role: req.user.role});
});

router.post('/refresh-token', (req, res) => {
	let refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
	  	return res.status(401).send('No refresh token provided');
	}
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) {
			return res.status(403).send('Invalid or expired refresh token');
		}
		let newAccessToken = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
		res.status(200).json({ accessToken: newAccessToken });
	});
});

export default router;