import React from 'react';

export const BasicTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 Website is Working!</h1>
      <p>If you can see this, the React app is running correctly.</p>
      <p>Frontend: ✅ Running on http://localhost:5174/</p>
      <p>Backend: ✅ Running on http://127.0.0.1:8000/</p>
      <button onClick={() => alert('Button works!')}>Test Button</button>
    </div>
  );
};