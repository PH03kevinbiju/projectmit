const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection string

const uri = 'mongodb+srv://Kedar:mitwpuproject@cluster0.juc3gzl.mongodb.net/'; // Make sure to specify the correct database name at the end of the URI


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Define a User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Hash passwords in production
});

const User = mongoose.model('User', userSchema);

// Define a Patient schema
const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bloodType: { type: String, required: true },
  medicalCondition: { type: String, required: true },
  dateOfAdmission: { type: Date, required: true },
  doctor: { type: String, required: true },
  hospital: { type: String, required: true },
  insuranceProvider: { type: String, required: true },
  billingAmount: { type: Number, required: true },
  roomNumber: { type: String, required: true },
  admissionType: { type: String, required: true },
  dischargeDate: { type: Date, required: true },
  medication: { type: String, required: true },
  testResults: { type: String, required: true }
});

const Patient = mongoose.model('Patient', PatientSchema);

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// New route for patient details
app.post('/api/patient-details', async (req, res) => {
  const {
    name,
    age,
    gender,
    bloodType,
    medicalCondition,
    dateOfAdmission,
    doctor,
    hospital,
    insuranceProvider,
    billingAmount,
    roomNumber,
    admissionType,
    dischargeDate,
    medication,
    testResults
  } = req.body;

  try {
    const patient = new Patient({
      name,
      age,
      gender,
      bloodType,
      medicalCondition,
      dateOfAdmission,
      doctor,
      hospital,
      insuranceProvider,
      billingAmount,
      roomNumber,
      admissionType,
      dischargeDate,
      medication,
      testResults
    });
    
    await patient.save();
    res.status(201).json({ message: 'Patient details saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving patient details', error: error.message });
  }
});

// Fraud Detection endpoint
app.post('/api/fraud-detection', async (req, res) => {
  const patientData = req.body;

  try {
    // Save patient data
    const newPatient = new Patient(patientData);
    await newPatient.save();
    console.log('Patient data saved for fraud detection.');

    // Log the patient data being passed to Python
    console.log('Patient data sent to Python script:', patientData);

    // Call Python script
    const python = spawn('python', ['C:\\Users\\Kevin\\Downloads\\H1_Projects\\H1_Projects\\react-admin\\src\\anomaly_detection\\FraudDetect.py', JSON.stringify(patientData)]);
    let fraudDetected; // To store the result from Python script
    let pythonError = false; // To handle Python script errors

    // Log output from Python script
    python.stdout.on('data', (data) => {
      const result = data.toString().trim();
      console.log(`Python Output: ${result}`);
      fraudDetected = result === '-1'; // Adjust based on actual logic
    });

    // Log any errors from Python script
    python.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
      pythonError = true;
    });

    python.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);

      if (code !== 0 || pythonError) {
        if (!res.headersSent) {
          return res.status(500).json({ error: 'Python script exited with an error' });
        }
      } else {
        if (!res.headersSent) {
          return res.json({ fraudDetected });
        }
      }
    });
  } catch (error) {
    console.error('Error in fraud detection route:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Error in fraud detection' });
    }
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
