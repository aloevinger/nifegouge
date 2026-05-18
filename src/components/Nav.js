import React, { useState } from 'react';
import WhizWheel from './Nav/WhizWheel';
import JetLog from './Nav/JetLog';
import FRR from './FRR';
import Weather from './Weather';

function Nav() {
  const [activeTab, setActiveTab] = useState('nav');

  return (
    <>
      <div className="sub-navbar">
        <span
          className={activeTab === 'nav' ? 'active' : ''}
          onClick={() => setActiveTab('nav')}
          style={{ cursor: 'pointer' }}
        >
          Nav
        </span>
        <span
          className={activeTab === 'jetlog' ? 'active' : ''}
          onClick={() => setActiveTab('jetlog')}
          style={{ cursor: 'pointer' }}
        >
          Jet Log
        </span>
        <span
          className={activeTab === 'frr' ? 'active' : ''}
          onClick={() => setActiveTab('frr')}
          style={{ cursor: 'pointer' }}
        >
          FR&R
        </span>
        <span
          className={activeTab === 'weather' ? 'active' : ''}
          onClick={() => setActiveTab('weather')}
          style={{ cursor: 'pointer' }}
        >
          Weather
        </span>
      </div>

      {activeTab === 'nav' && <WhizWheel />}
      {activeTab === 'jetlog' && <JetLog />}
      {activeTab === 'frr' && <FRR />}
      {activeTab === 'weather' && <Weather />}
    </>
  );
}

export default Nav;