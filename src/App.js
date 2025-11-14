import React, { useState } from 'react';
import './style.css';
import FRR from './components/FRR';
import Weather from './components/Weather';
import Questions from './components/Questions';
import Nav from './components/Nav';
import Flight from './components/Flight.js';
import Docs from './components/Docs.js';
import TW4About from './components/TW4About.js';
import TW4Cockpit from './components/TW4Cockpit.js';
import TW4Limits from './components/TW4Limits.js';
import TW4Briefs from './components/TW4Briefs.js';
import NIFEAbout from './components/NIFEAbout.js';
import LandingPage from './components/LandingPage.js';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [mode, setMode] = useState('NIFE');

  const handleModeToggle = (newMode) => {
    setMode(newMode);
    setCurrentPage('about');
  };

  const handleLandingSelection = (selectedMode) => {
    setMode(selectedMode);
    setCurrentPage('about');
  };

  return (
    <div>
      {/* Navigation Bar - hidden on landing page */}
      {currentPage !== 'landing' && <div className="navbar">
        {/* Mode Toggle */}
        <div className="page-toggle-container">
          <span className={mode === 'NIFE' ? 'active' : ''} onClick={() => handleModeToggle('NIFE')}>
            NIFE
          </span>
          <div className="page-toggle-switch" onClick={() => handleModeToggle(mode === 'NIFE' ? 'TW4 Primary' : 'NIFE')}>
            <div className={`page-toggle-slider ${mode === 'TW4 Primary' ? 'right' : 'left'}`}></div>
          </div>
          <span className={mode === 'TW4 Primary' ? 'active' : ''} onClick={() => handleModeToggle('TW4 Primary')}>
            TW4 Primary
          </span>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('about');
            }}
            className={currentPage === 'about' ? 'active' : ''}
          >
            About
          </a>
          {mode === 'NIFE' && (
            <>
              <a
                href="#questions"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('questions');
                }}
                className={currentPage === 'questions' ? 'active' : ''}
              >
                Questions
              </a>
              <a
                href="#docs"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('docs');
                }}
                className={currentPage === 'docs' ? 'active' : ''}
              >
                Docs
              </a>
              <a
                href="#frr"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('frr');
                }}
                className={currentPage === 'frr' ? 'active' : ''}
              >
                FR&R
              </a>
              <a
                href="#nav"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('nav');
                }}
                className={currentPage === 'nav' ? 'active' : ''}
              >
                Nav
              </a>
              <a
                href="#weather"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('weather');
                }}
                className={currentPage === 'weather' ? 'active' : ''}
              >
                Weather
              </a>
              <a
                href="#flight"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('flight');
                }}
                className={currentPage === 'flight' ? 'active' : ''}
              >
                Flight
              </a>
            </>
          )}
          {mode === 'TW4 Primary' && (
            <>
            <a
              href="#limits"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('limits');
              }}
              className={currentPage === 'limits' ? 'active' : ''}
            >
              Limits
            </a>
            <a
              href="#cockpit"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('cockpit');
              }}
              className={currentPage === 'cockpit' ? 'active' : ''}
            >
              Cockpit
            </a>
            <a
              href="#briefs"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('briefs');
              }}
              className={currentPage === 'briefs' ? 'active' : ''}
            >
              Briefs
            </a>
            </>
          )}
        </div>
      </div>}

      {/* Page Content */}
      <div>
        {currentPage === 'landing' && <LandingPage onSelectMode={handleLandingSelection} />}
        {currentPage === 'about' && mode === 'NIFE' && <NIFEAbout />}
        {currentPage === 'about' && mode === 'TW4 Primary' && <TW4About />}
        {currentPage === 'questions' && mode === 'NIFE' && <Questions />}
        {currentPage === 'docs' && mode === 'NIFE' && <Docs />}
        {currentPage === 'frr' && mode === 'NIFE' && <FRR />}
        {currentPage === 'nav' && mode === 'NIFE' && <Nav />}
        {currentPage === 'weather' && mode === 'NIFE' && <Weather />}
        {currentPage === 'flight' && mode === 'NIFE' && <Flight />}
        {currentPage === 'cockpit' && mode === 'TW4 Primary' && <TW4Cockpit />}
        {currentPage === 'limits' && mode === 'TW4 Primary' && <TW4Limits />}
        {currentPage === 'briefs' && mode === 'TW4 Primary' && <TW4Briefs />}
      </div>
    </div>
  );
}

export default App;