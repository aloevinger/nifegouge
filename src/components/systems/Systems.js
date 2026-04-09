import React, { useState } from 'react';
import T6BHydraulicDiagram from './hyds/T6BHydraulicDiagram';
import T6BElectricalDiagram from './elec/T6BElectricalDiagram';

function Systems() {
  const [activeTab, setActiveTab] = useState('hyds');

  return (
    <div style={{ background: '#080f18', minHeight: '100vh' }}>
      <div className="sub-navbar" style={{ marginBottom: 0 }}>
        <span
          className={activeTab === 'hyds' ? 'active' : ''}
          onClick={() => setActiveTab('hyds')}
          style={{ cursor: 'pointer' }}
        >
          Hydraulics
        </span>
        <span
          className={activeTab === 'elec' ? 'active' : ''}
          onClick={() => setActiveTab('elec')}
          style={{ cursor: 'pointer' }}
        >
          Electrical
        </span>
      </div>
      {activeTab === 'hyds' && <T6BHydraulicDiagram />}
      {activeTab === 'elec' && <T6BElectricalDiagram />}
    </div>
  );
}

export default Systems;
