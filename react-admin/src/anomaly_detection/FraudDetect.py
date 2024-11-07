import sys
import json
import joblib
import pandas as pd
from sklearn.impute import SimpleImputer

# Load the pre-trained model
path = r'C:\Users\Kevin\Downloads\H1_Projects\H1_Projects\react-admin\src\anomaly_detection\isolation_forest_model.pkl'
model = joblib.load(path)

def preprocess_data(input_data):
    """
    Preprocess the input data to match the model's expected format.
    """
    # Convert input to DataFrame
    df = pd.DataFrame([input_data])
    
    # Define the expected column mapping
    column_mapping = {
        'name': 'Name',
        'age': 'Age',
        'gender': 'Gender',
        'bloodType': 'Blood Type',
        'medicalCondition': 'Medical Condition',
        'dateOfAdmission': 'Date of Admission',
        'doctor': 'Doctor',
        'hospital': 'Hospital',
        'insuranceProvider': 'Insurance Provider',
        'billingAmount': 'Billing Amount',
        'roomNumber': 'Room Number',
        'admissionType': 'Admission Type',
        'dischargeDate': 'Discharge Date',
        'medication': 'Medication',
        'testResults': 'Test Results'
    }
    
    # Convert all column names to lowercase for case-insensitive mapping
    df.columns = df.columns.str.lower()
    
    # Create a case-insensitive mapping dictionary
    case_insensitive_mapping = {k.lower(): v for k, v in column_mapping.items()}
    
    # Rename columns using the case-insensitive mapping
    df.rename(columns=case_insensitive_mapping, inplace=True)
    
    return df

def main():
    # Check if the correct argument is provided
    if len(sys.argv) < 2:
        print("No input data provided. Please provide input data as a JSON string.")
        return

    try:
        # Get patient data from Node.js (via command line)
        input_data = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        print("Error: Invalid JSON format.")
        return

    # Print input data for debugging
    print("Input data:", input_data)

    # Preprocess the data
    try:
        df = preprocess_data(input_data)
    except Exception as e:
        print(f"Error during preprocessing: {e}")
        return

    # Print DataFrame columns for debugging
    print("DataFrame columns:", df.columns)

    # Define the required features in the correct order
    relevant_features = [
        'Age', 'Gender', 'Blood Type', 'Medical Condition', 
        'Date of Admission', 'Doctor', 'Hospital', 'Insurance Provider', 
        'Billing Amount', 'Room Number', 'Admission Type', 
        'Discharge Date', 'Medication', 'Test Results'
    ]

    # Check for missing features and add them if necessary
    for feature in relevant_features:
        if feature not in df.columns:
            df[feature] = None
            print(f"Added missing column: {feature}")

    # Select and order the features correctly
    input_features = df[relevant_features]

    # Convert numeric columns
    numeric_features = ['Age', 'Billing Amount', 'Room Number']
    for feature in numeric_features:
        try:
            df[feature] = pd.to_numeric(df[feature], errors='coerce')
        except Exception as e:
            print(f"Warning: Could not convert {feature} to numeric: {e}")

    # Convert date columns
    date_features = ['Date of Admission', 'Discharge Date']
    for feature in date_features:
        try:
            df[feature] = pd.to_datetime(df[feature], errors='coerce')
        except Exception as e:
            print(f"Warning: Could not convert {feature} to datetime: {e}")

    # Impute missing values
    imputer = SimpleImputer(strategy='most_frequent')
    input_features = pd.DataFrame(
        imputer.fit_transform(input_features),
        columns=input_features.columns
    )

    # Perform fraud detection
    try:
        predictions = model.predict(input_features)
        
        # Output results (fraud if -1, normal if 1)
        for idx, prediction in enumerate(predictions):
            result = "FRAUD DETECTED" if prediction == -1 else "NORMAL"
            print(f"Record {idx + 1}: {result} (prediction = {prediction})")
            
    except Exception as e:
        print(f"Error during model prediction: {e}")
        return

if __name__ == '__main__':
    main()