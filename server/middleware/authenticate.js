import jwt from 'jsonwebtoken';

function authenticate(req, res, next) {
	let token = req.cookies.authToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
	if (!token) {
		return res.status(401).send('Unauthorized. No token provided.');
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			console.error('Token verification failed:', err.message);
			return res.status(403).send('Invalid or expired token.');
		}
		req.user = decoded;
		next();
	});
}

export default authenticate;
