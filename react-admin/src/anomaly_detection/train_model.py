from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import IsolationForest
import pandas as pd
import joblib

# Load your dataset
data = pd.read_csv(r'C:\Users\Kevin\Downloads\H1_Projects\H1_Projects\react-admin\src\anomaly_detection\test.csv')

# Define your features
features = ['Name', 'Age', 'Gender', 'Blood Type', 'Medical Condition', 
            'Date of Admission', 'Doctor', 'Hospital', 'Insurance Provider', 
            'Billing Amount', 'Room Number', 'Admission Type', 
            'Discharge Date', 'Medication', 'Test Results']

X = data[features]

# Define categorical and numerical columns
categorical_features = ['Gender', 'Blood Type', 'Medical Condition', 
                        'Hospital', 'Insurance Provider', 'Admission Type', 
                        'Medication', 'Test Results']

# High-cardinality features where label encoding is more appropriate
high_cardinality_features = ['Name', 'Doctor', 'Room Number']

numerical_features = ['Age', 'Billing Amount']

# Create a LabelEncoder for high-cardinality features
label_encoders = {feature: LabelEncoder() for feature in high_cardinality_features}

# Fit the LabelEncoders and transform the high-cardinality features
for feature in high_cardinality_features:
    X[feature] = label_encoders[feature].fit_transform(X[feature].astype(str))

# Create a preprocessor with OneHotEncoder for categorical features and passthrough for numerical features
preprocessor = ColumnTransformer(
    transformers=[
        ('num', Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='mean')),
            ('passthrough', 'passthrough')
        ]), numerical_features),
        ('cat', Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('onehot', OneHotEncoder(sparse_output=True))  # Keep sparse format to reduce memory usage
        ]), categorical_features)
    ]
)

# Create a pipeline that first transforms the data and then fits the model
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', IsolationForest(contamination=0.5, random_state=42))
])

# Fit the model on the preprocessed data
pipeline.fit(X)

# Save the trained model to a file
joblib.dump(pipeline, 'isolation_forest_model.pkl')

print("Model trained and saved to isolation_forest_model.pkl")
