import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://ai-symptom-checker-backend-wvlu.onrender.com/predict',
        {
          symptoms: symptoms.split(',').map(s => s.trim())
        }
      );
      console.log('Full Result:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to connect to backend' });
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#2c3e50' }}>AI Symptom Checker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter symptoms (comma separated)"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{
            width: '300px',
            padding: '10px',
            marginRight: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '4px',
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
        <div style={{ marginTop: '2rem' }}>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <>
              <h2 style={{ color: '#34495e' }}>Possible Conditions</h2>
              <ul>
                {(result.possible_conditions || []).map((cond, i) => (
                  <li key={i}>{cond}</li>
                ))}
              </ul>

              <h2 style={{ color: '#34495e' }}>Precautions</h2>
              {result.precautions &&
                Object.entries(result.precautions).map(([disease, steps]) => (
                  <div key={disease} style={{ marginBottom: '1rem' }}>
                    <strong>{disease}:</strong>
                    <ul>
                      {(steps || []).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}

              <h2 style={{ color: '#34495e' }}>Symptom Descriptions</h2>
              {result.symptom_descriptions &&
                Object.entries(result.symptom_descriptions).map(([symptom, desc]) => (
                  <p key={symptom}>
                    <strong>{symptom}</strong>: {desc}
                  </p>
                ))}

              <h2 style={{ color: '#34495e' }}>Severity Score</h2>
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
