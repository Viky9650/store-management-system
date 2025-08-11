import React, { useState } from 'react';

export default function ReportsPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [error, setError] = useState('');

  const downloadCSV = () => {
    if (year < 2000 || year > currentYear) {
      setError(`Year must be between 2000 and ${currentYear}`);
      return;
    }
    if (month < 1 || month > 12) {
      setError('Month must be between 1 and 12');
      return;
    }
    setError('');
    window.open(`https://store-r-2025.azurewebsites.net/monthly-report-csv/${year}/${month}`, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '50px',
      backgroundColor: '#f9fafb',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
    }}>
      <h1 style={{ marginBottom: '40px', color: '#34495e' }}>Monthly Reports</h1>
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '400px',
        width: '100%',
      }}>
        <input
          type="number"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          placeholder="Year"
          min="2000"
          max={currentYear}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '150px',
            boxSizing: 'border-box',
          }}
        />
        <input
          type="number"
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          placeholder="Month"
          min="1"
          max="12"
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '150px',
            boxSizing: 'border-box',
          }}
        />
      </div>
      {error && (
        <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
      )}
      <button
        onClick={downloadCSV}
        style={{
          padding: '12px 30px',
          fontSize: '16px',
          backgroundColor: '#3498db',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={e => (e.target.style.backgroundColor = '#2980b9')}
        onMouseLeave={e => (e.target.style.backgroundColor = '#3498db')}
      >
        Download CSV
      </button>
    </div>
  );
}
