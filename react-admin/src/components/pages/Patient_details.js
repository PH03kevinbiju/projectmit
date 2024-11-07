import React, { useState } from 'react';
import '../styles/Patient_details.css';
import axios from 'axios';

const PatientDetailsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bloodType: '',
    medicalCondition: '',
    dateOfAdmission: '',
    doctor: '',
    hospital: '',
    insuranceProvider: '',
    billingAmount: '',
    roomNumber: '',
    admissionType: '',
    dischargeDate: '',
    medication: '',
    testResults: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Submit form data to backend for patient details
      const response = await axios.post('http://localhost:5001/api/patient-details', formData);
      console.log(response.data); // Log response data for debugging
      
      // Call fraud detection API with the same form data
      const fraudResponse = await axios.post('http://localhost:5001/api/fraud-detection', formData);
      console.log(fraudResponse.data); // Log fraud detection response

      // Check if fraud was detected and alert the user
      if (fraudResponse.data && fraudResponse.data.fraudDetected) {
        alert('Fraud Detected!');
      } else {
        alert('No Fraud Detected.');
      }
    } catch (error) {
      console.error('Error submitting patient details:', error);
      alert('There was an error submitting the patient details. Please try again.');
    } finally {
      // Optionally reset the form or show a success message
      setFormData({
        name: '',
        age: '',
        gender: '',
        bloodType: '',
        medicalCondition: '',
        dateOfAdmission: '',
        doctor: '',
        hospital: '',
        insuranceProvider: '',
        billingAmount: '',
        roomNumber: '',
        admissionType: '',
        dischargeDate: '',
        medication: '',
        testResults: ''
      });
      
      alert('Patient details submitted successfully!');
    }
  };

  return (
    <div className="patient-details-container">
      <h2>Patient Details Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Blood Type</label>
          <input type="text" name="bloodType" value={formData.bloodType} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Medical Condition</label>
          <input type="text" name="medicalCondition" value={formData.medicalCondition} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date of Admission</label>
          <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Doctor</label>
          <input type="text" name="doctor" value={formData.doctor} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Hospital</label>
          <input type="text" name="hospital" value={formData.hospital} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Insurance Provider</label>
          <input type="text" name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Billing Amount</label>
          <input type="number" name="billingAmount" value={formData.billingAmount} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Room Number</label>
          <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Admission Type</label>
          <input type="text" name="admissionType" value={formData.admissionType} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Discharge Date</label>
          <input type="date" name="dischargeDate" value={formData.dischargeDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Medication</label>
          <input type="text" name="medication" value={formData.medication} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Test Results</label>
          <input type="text" name="testResults" value={formData.testResults} onChange={handleChange} required />
        </div>
        
        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PatientDetailsPage;