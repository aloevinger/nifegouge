import React, { useState } from 'react';
import LimitsEPs from './Flight/LimitsEPs';
import ToldCard from './Flight/ToldCard';

function Flight() {
  const [activeTab, setActiveTab] = useState('limits');

  return (
    <>
      <div className="sub-navbar">
        <span 
          className={activeTab === 'limits' ? 'active' : ''}
          onClick={() => setActiveTab('limits')}
          style={{ cursor: 'pointer' }}
        >
          Limits/EPs/Maneuvers
        </span>
        <span 
          className={activeTab === 'told' ? 'active' : ''}
          onClick={() => setActiveTab('told')}
          style={{ cursor: 'pointer' }}
        >
          TOLD Card
        </span>
      </div>

      {activeTab === 'limits' && <LimitsEPs />}
      {activeTab === 'told' && <ToldCard />}
    </>
  );
}

export default Flight;