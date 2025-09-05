import React, { useState } from 'react';
import WhizWheel from './Nav/WhizWheel';
import JetLog from './Nav/JetLog';

function Nav() {
  const [activeTab, setActiveTab] = useState('whiz');

  return (
    <>
      <div className="sub-navbar">
        <span 
          className={activeTab === 'whiz' ? 'active' : ''}
          onClick={() => setActiveTab('whiz')}
          style={{ cursor: 'pointer' }}
        >
          Problem Generator
        </span>
        <span 
          className={activeTab === 'jetlog' ? 'active' : ''}
          onClick={() => setActiveTab('jetlog')}
          style={{ cursor: 'pointer' }}
        >
          Jet Log
        </span>
      </div>

      {activeTab === 'whiz' && <WhizWheel />}
      {activeTab === 'jetlog' && <JetLog />}
    </>
  );
}

export default Nav;