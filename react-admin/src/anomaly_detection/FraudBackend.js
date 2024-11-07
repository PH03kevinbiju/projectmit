import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnomalyDetection = () => {
    const [anomalies, setAnomalies] = useState([]);

    useEffect(() => {
        const fetchAnomalies = async () => {
            try {
                const response = await axios.get('/api/detect-anomalies');
                setAnomalies(response.data);
            } catch (error) {
                console.error('Error fetching anomalies:', error);
            }
        };

        fetchAnomalies();
    }, []);

    return (
        <div>
            <h2>Detected Anomalies</h2>
            <ul>
                {anomalies.map((anomaly, index) => (
                    <li key={index}>{JSON.stringify(anomaly)}</li>
                ))}
            </ul>
        </div>
    );
};

export default AnomalyDetection;
