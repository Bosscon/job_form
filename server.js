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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your HTML and JS)
app.use(express.static('public'));

// Handle form submission
app.post('/api/submit', upload.fields([
  { name: 'license_front', maxCount: 1 },
  { name: 'license_back', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), (req, res) => {
  try {
    const formData = req.body;
    const files = req.files;

    // Log form data
    console.log('Form submission received:');
    console.log(JSON.stringify(formData, null, 2));

    // Log file paths
    if (files) {
      Object.keys(files).forEach(key => {
        console.log(`${key} uploaded:`, files[key][0].path);
      });
    }

    // Here you would typically save the data to a database
    // For demonstration, we'll write to a JSON file
    const submission = {
      timestamp: new Date().toISOString(),
      formData: formData,
      files: files ? Object.fromEntries(Object.entries(files).map(([key, value]) => [key, value[0].path])) : {}
    };

    fs.writeFileSync(`submissions/${Date.now()}.json`, JSON.stringify(submission, null, 2));

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ message: 'Error processing form submission' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// For demonstration purposes, let's simulate a form submission
const simulateFormSubmission = async () => {
  const formData = new FormData();
  formData.append('name', 'John Doe');
  formData.append('email', 'john@example.com');
  formData.append('phone', '1234567890');
  formData.append('dob', '1990-01-01');
  formData.append('address', '123 Main St, Anytown, USA');
  formData.append('employment_status', 'employed');
  formData.append('work_experience', '5');
  formData.append('academic_grade', 'bachelor');
  formData.append('gender', 'male');
  formData.append('ssn', '123-45-6789');
  formData.append('work_type', 'onsite');
  formData.append('hours_per_week', '40');
  formData.append('same_hours', 'yes');
  formData.append('last_job_pay', '20');
  formData.append('accept_same_pay', 'yes');
  formData.append('authorized_to_work', 'yes');
  formData.append('payment_method', 'bank');

  // Simulate file uploads
  formData.append('license_front', new Blob(['fake image data'], { type: 'image/jpeg' }), 'license_front.jpg');
  formData.append('license_back', new Blob(['fake image data'], { type: 'image/jpeg' }), 'license_back.jpg');
  formData.append('selfie', new Blob(['fake image data'], { type: 'image/jpeg' }), 'selfie.jpg');

  try {
    const response = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Form submitted successfully');
    } else {
      console.log('Error submitting form');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

simulateFormSubmission();