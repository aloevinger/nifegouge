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
        Welcome to <em>TW4 Primary</em>
      </h1>

      <p className="about-text">
        This section is dedicated to TW4 Primary training resources (sorry Whiting)
      </p>

      <h2 className="about-subtitle" style={{fontSize: '18px', marginTop: '20px', marginBottom: '10px'}}>Cockpit Interactive</h2>
      <p className="about-text">
        The Cockpit section features a virtual interactive T-6 cockpit poster that serves as a comprehensive training tool for Emergency Procedures (EPs) and Quadfold checklists.
        By clicking through actual cockpit controls and following procedural flows, you can gain spatial awareness for where the controls are and start developing flow. 
        Integrated Notes Warnings Cautions, expanded checklist items, and non-memory items allow for easy access to supplementary material.
        Please refer to the instructions button on the top left for a more thorough explanation of how to use the virtual cockpit. 
      </p>

      <h2 className="about-subtitle" style={{fontSize: '18px', marginTop: '20px', marginBottom: '10px'}}>Operating Limits</h2>
      <p className="about-text">
        The Limits page provides a virtual T-6B Operating Limitations table. You can quickly test yourself or learn the limits by revealing the answers when stuck.
        See if you can correctly answer all 106 limits in a random order!
      </p>

      <h2 className="about-subtitle" style={{fontSize: '18px', marginTop: '20px', marginBottom: '10px'}}>Briefs</h2>
      <p className="about-text">
        The Briefs page allows you to practice the NATOPS brief for both Fam and Form. Clicking on a briefing item will reveal the associated
        expanded brief item in case you need a refresher or want to learn what is expected of you. 
      </p>

      <h2 className="about-subtitle" style={{fontSize: '18px', marginTop: '20px', marginBottom: '10px'}}>Course Rules</h2>
      <p className="about-text">
        The Course Rules page integrates an interactive course rule map with official text to help you build visual intuition while studying. You can build hypothetical flight paths and test yourself on associated     
        course rules as you progress, quiz yourself on specific areas, or freely explore the Corpus Christi area's course rules.
      </p>

      <p className="about-text" style={{marginTop: '20px', fontStyle: 'italic'}}>
        This is a work in progress. More pages and content will be added over time. If you see any bugs PLEASE reach out personally at 818-209-2151 or at pinksheetmafia@gmail.com
      </p>

      <p className="about-text">
                If you're comfortable with code, contribute directly via our{' '}
                <a
                  href="https://github.com/aloevinger/nifegouge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-link"
                >
                  open-source GitHub repo
                </a>.
      </p>
      
      <p className="about-text">
        Thanks,<br/>ENS Loevinger
      </p>
    </div>
  );
}

export default TW4About;