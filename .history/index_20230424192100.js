
const express = require("express");
const app = express();
const port = 8000;
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const multer = require('multer');

app.set('view engine', 'ejs');

// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
});
const upload = multer({ storage: storage });

app.get('/senemail', (req, res) => {
	const data = {
		passengerName: 'Mr. Test Test',
		travelDate: '29 May 2023',
		travelTime: '10:30 A.M',
		pnr: 'XQG5UZ',
		flightNo: '6E 514',
		sector: 'Bagdogra - Hyderabad',
		passengerDetails: [
			{name: 'Mr. Test Test', type: 'Adult', price: '9650'},
			{name: 'Mstr Test Infant', type: 'Infant', price: '1500'}
		],
		totalPrice: '11150'
	};
	
	// Render the EJS template
	ejs.renderFile(path.join(__dirname, 'views', 'email.ejs'), data, (err, html) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}
		
		// PDF options
		const options = { format: 'A4' };

		// Generate PDF from HTML
		pdf.create(html, options).toBuffer((err, buffer) => {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			
			// Set the HTTP headers to serve the PDF file as an attachment
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', 'attachment; filename=email.pdf');
			
			// Send the PDF buffer to the client
			res.send(buffer);
		});
	});
});

// Route to handle PDF uploads
app.post('/upload', upload.single('pdf'), (req, res) => {
	if (req.file) {
		console.log(req.file);
		res.status(200).send('File uploaded successfully');
	} else {
		res.status(400).send('No file uploaded');
	}
});

app.listen(port, (err) => {
    if (err)
     throw err
    else
    console.log("Server running on port %d:",  port);
});
