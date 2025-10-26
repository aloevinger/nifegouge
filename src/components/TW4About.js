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
        This section is dedicated to TW4 Primary training resources.
        Currently there are only pages for EPS and limits. 
        This is a work in progress, more pages and content will be added over time
      </p>

      <p className="about-text">
        Thanks,<br/>ENS Loevinger
      </p>
    </div>
  );
}

export default TW4About;