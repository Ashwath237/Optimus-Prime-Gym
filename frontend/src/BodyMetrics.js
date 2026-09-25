import React, { useState, useEffect } from 'react';

function BodyMetrics() {
    const [metrics, setMetrics] = useState([]);
    const [weight, setWeight] = useState('');
    const [measurement, setMeasurement] = useState('');
    const handleLogMetric = () => {
    
    if (!weight) {
        alert('Please enter weight');
        return;
    }
    
    const newMetric = {
        id: Date.now(),
        weight,
        measurement,
        logged_at: new Date().toLocaleString()
    };
    
    setMetrics([...metrics, newMetric]);
    alert('Metric logged!');
    setWeight('');
    setMeasurement('');
};

    

    return (
        <div>
            <h1>Body Metrics</h1>
            
            <div>
                <h2>Log New Metric</h2>
                <input 
                    type="number" 
                    placeholder="Weight (kg)" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Measurements (optional)" 
                    value={measurement}
                    onChange={(e) => setMeasurement(e.target.value)}
                />
                <button onClick={handleLogMetric}>Log Metric</button>
            </div>
            
            <div>
                <h2>Metric History</h2>
                {metrics.map(metric => (
                    <div key={metric.id}>
                        <p>Weight: {metric.weight} kg</p>
                        <p>Measurement: {metric.measurement || 'N/A'}</p>
                        <p>Date: {metric.logged_at || 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BodyMetrics;
