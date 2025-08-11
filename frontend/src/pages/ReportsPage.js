import React, { useState } from 'react';

export default function ReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const downloadCSV = () => {
    window.open(`http://localhost:3001/monthly-report-csv/${year}/${month}`, '_blank');
  };

  return (
    <div>
      <h2>Monthly Reports</h2>
      <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" />
      <input type="number" value={month} onChange={e => setMonth(e.target.value)} placeholder="Month" min="1" max="12" />
      <button onClick={downloadCSV}>Download CSV</button>
    </div>
  );
}
