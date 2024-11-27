import express from 'express';
import authenticate from '../middleware/authenticate.js';
import Petition from '../models/petition.js';

let router = express.Router();

router.post('/create', authenticate, (req, res) => {
	let { title, content } = req.body;
	if (!title || !content) {
		return res.status(400).json({ error: 'Title and content are required' });
	}

	let newPetition = new Petition({
		title,
		content,
		petitioner: req.user.id,
	});

	newPetition.save()
	.then((savedPetition) => {
		res.status(201).json({
			message: 'Petition created successfully',
			petition: savedPetition,
		});
	})
	.catch((err) => {
		console.error('Error creating petition:', err);
		res.status(500).json({ error: 'Error creating petition' });
	});
});

router.put('/sign-petition/:id', authenticate, async (req, res) => {
	let petitionId = req.params.id;
	let userId = req.user.id;

	Petition.findById(petitionId)
	.then((petition) => {
		if (!petition) {
			return res.status(404).json({ error: 'Petition not found' });
		}

		if (petition.status !== 'open') {
			return res.status(400).json({ error: 'This petition is closed for signatures' });
		}

		if (petition.signatures.includes(userId)) {
			return res.status(400).json({ error: 'You have already signed this petition' });
		}

		petition.signatures.push(userId);
		petition.signatureCount += 1;
		return petition.save();
	})
	.then((updatedPetition) => {
		res.status(200).json({
			message: 'Petition signed successfully',
			petitionId: updatedPetition._id,
			signatureCount: updatedPetition.signatureCount,
		});
	})
	.catch((err) => {
		console.error('Error signing petition:', err);
		res.status(500).json({ error: 'An error occurred while signing the petition' });
	});
});

router.get('/', (req, res) => {
	let { status, sort = '-createdAt' } = req.query;

	let query = {};
	if (status) {
		query.status = status
	};

	Petition.find(query)
	.sort(sort)
	.then((petitions) => {
		res.status(200).json({
			message: 'Petitions retrieved successfully',
			petitions,
		});
	})
	.catch((err) => {
		console.error('Error fetching petitions:', err);
		res.status(500).json({error: 'Error fetching petitions'});
	});
});

router.get('/threshold', authenticate, (req, res) => {
    	res.json({threshold: process.env.PETITION_THRESHOLD});
});


export default router;