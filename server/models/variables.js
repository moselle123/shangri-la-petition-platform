import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
let filePath = path.resolve(__dirname, '../variables.json');
let variables = {};

fs.readFile(filePath, 'utf-8', (err, data) => {
	if (err) {
		console.error('Error reading file:', err);
		return;
	}
	variables = JSON.parse(data);
});

function writeVariables() {
    	return fs.writeFile(filePath, JSON.stringify(variables, null, 4), 'utf-8', (err) => {
		if (err) {
			console.error('Error reading file:', err);
			return;
		}
	});
}

export function getThreshold() {
	return variables.threshold;
}

export function updateThreshold(newThreshold) {
	variables.threshold = newThreshold;
	writeVariables();
	return variables.threshold;
}

export function getValidBioIds() {
	return variables.validBioIds;
}
