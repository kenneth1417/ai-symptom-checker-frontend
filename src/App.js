import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
  'https://ai-symptom-checker-backend-duav.onrender.com/predict',
  {
    symptoms: symptoms.split(',').map((s) => s.trim())
  }
);

      console.log('Full Result:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to connect to backend' });
    }
  };

  const sectionTitle = {
    color: '#34495e',
    borderBottom: '1px solid #ddd',
    paddingBottom: '5px',
    marginTop: '25px'
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '30px',
        fontFamily: 'Segoe UI, sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <h1
        style={{
          color: '#2c3e50',
          textAlign: 'center',
          marginBottom: '30px'
        }}
      >
        🩺 AI Symptom Checker
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="e.g. headache, fever, fatigue"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Check
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px' }}>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <>
              <h2 style={sectionTitle}>Possible Conditions</h2>
              <ul>
                {(result.possible_conditions || []).map((cond, i) => (
                  <li key={i}>{cond}</li>
                ))}
              </ul>

              <h2 style={sectionTitle}>Precautions</h2>
              {result.precautions &&
                Object.entries(result.precautions).map(([disease, steps]) => (
                  <div key={disease}>
                    <strong>{disease}</strong>
                    <ul>
                      {(steps || []).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}

              <h2 style={sectionTitle}>Symptom Descriptions</h2>
              {result.symptom_descriptions &&
                Object.entries(result.symptom_descriptions).map(
                  ([symptom, desc]) => (
                    <p key={symptom}>
                      <strong>{symptom}</strong>: {desc}
                    </p>
                  )
                )}

              <h2 style={sectionTitle}>Severity Score</h2>
              <p>
                <strong>{result.severity_score || 'N/A'}</strong>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
