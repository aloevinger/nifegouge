import React, { useEffect } from 'react';

function TW4About() {
  // Preload images for EPs page to reduce load times
  useEffect(() => {
    const imagesToPreload = [
      '/images/croptop.png',
      '/images/left.png',
      '/images/right.png',
      '/images/stick.png',
      '/images/ldggrhandle.png',
      '/images/defog.png',
      '/images/parking.png'
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="page-container">
      <h1 className="about-title">
        Welcome to the <em>TW4 Primary</em>
      </h1>

      <p className="about-text">
        This section is dedicated to TW4 Primary training resources
      </p>

      <h2 className="about-subtitle" style={{fontSize: '18px', marginTop: '20px', marginBottom: '10px'}}>Cockpit Interactive</h2>
      <p className="about-text">
        The Cockpit section features a virtual interactive T-6 cockpit poster that serves as a comprehensive training tool for Emergency Procedures (EPs) and Quadfold checklists.
        By clicking through actual cockpit controls and following procedural flows, you can gain spatial awareness for where the controls are and start developing flow. 
        NWCs, expanded checklist actions, FTI procedures, and full EPs to be added
      </p>

      <h2 className="about-subtitle" style={{fontSize: '18px', marginTop: '20px', marginBottom: '10px'}}>Operating Limits</h2>
      <p className="about-text">
        The Limits page provides a virtual T-6B Operating Limitations table. You can quickly test yourself or learn the limits by revealing the answers when stuck.
      </p>

      <p className="about-text" style={{marginTop: '20px', fontStyle: 'italic'}}>
        This is a work in progress. More pages and content will be added over time.
      </p>

      <p className="about-text">
        Thanks,<br/>ENS Loevinger
      </p>
    </div>
  );
}

export default TW4About;