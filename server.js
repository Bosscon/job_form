import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Ensure submissions directory exists
if (!fs.existsSync('submissions')) {
    fs.mkdirSync('submissions');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Handle form submission
app.post('/api/submit', upload.fields([
    { name: 'license_front', maxCount: 1 },
    { name: 'license_back', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
]), 
(req, res) => {
    try {
        const formData = req.body;
        const files = req.files;

        // Log form data (in a real application, you'd save this to a database)
        console.log('Form submission received:');
        console.log(formData);

        // Log file paths
        if (files) {
            Object.keys(files).forEach(key => {
                console.log(`${key} uploaded:`, files[key][0].path);
            });
        }

        // Save form data to a JSON file in the submissions directory
        const submission = {
            formData,
            files: Object.keys(files).reduce((acc, key) => {
                acc[key] = files[key][0].path;
                return acc;
            }, {})
        };

        const submissionPath = path.join('submissions', `${Date.now()}.json`);
        fs.writeFileSync(submissionPath, JSON.stringify(submission, null, 2));

        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({ message: 'Error processing form submission' });
    }
});

// Endpoint to get list of uploads
app.get('/api/uploads', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ files });
    });
});

// Endpoint to get list of submissions
app.get('/api/submissions', (req, res) => {
    fs.readdir('submissions', (err, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const submissions = files.map(file => JSON.parse(fs.readFileSync(`submissions/${file}`)));
        res.json({ submissions });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
