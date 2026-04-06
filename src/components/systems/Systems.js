import React, { useState } from 'react';
import T6BHydraulicDiagram from './hyds/T6BHydraulicDiagram';

function Systems() {
  const [activeTab, setActiveTab] = useState('hyds');

  return (
    <div style={{ background: '#080f18', minHeight: '100vh' }}>
      <div className="sub-navbar">
        <span
          className={activeTab === 'hyds' ? 'active' : ''}
          onClick={() => setActiveTab('hyds')}
          style={{ cursor: 'pointer' }}
        >
          Hydraulics
        </span>
      </div>

      {activeTab === 'hyds' && <T6BHydraulicDiagram />}
    </div>
  );
}

export default Systems;
