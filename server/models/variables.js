import mongoose from "mongoose";

let Variables = mongoose.model('Variables', {}, 'variables');

export function getSignatureThreshold() {
	return Variables.findOne({ _id: '67487ce4bb0529f6e1844676' })
	.then((variables) => {
		let threshold = variables.toObject().threshold;
		return threshold;
	})
	.catch((err) => {
		console.error("Error getting threshold:", err);
	})
}

export function getValidBioIds() {
	return Variables.findOne({ _id: '67487ce4bb0529f6e1844676' })
	.then((variables) => {
		let validBioIds = variables.toObject().validBioIds;
		return validBioIds;
	})
	.catch((err) => {
		console.error("Error getting valid bio ids:", err);
	})
}

export function updateThreshold(newThreshold) {
	return Variables.updateOne( { _id: '67487ce4bb0529f6e1844676' }, { threshold: newThreshold })
	.then(({threshold}) => {
		console.log("Threshold updated successfully");
		return threshold;
	})
	.catch((err) => {
		console.error("Error updating threshold:", err);
	});
}
