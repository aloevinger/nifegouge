import React, { useState } from 'react';
import './style.css';
import FRR from './components/FRR';
import Weather from './components/Weather';
import Questions from './components/Questions';
import Nav from './components/Nav'; 
import Flight from './components/Flight.js';
import Docs from './components/Docs.js';

function App() {
  const [currentPage, setCurrentPage] = useState('about');

  return (
    <div>
      {/* Navigation Bar */}
      <div className="navbar">
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
      </div>

      {/* Page Content */}
      <div>
        {currentPage === 'about' && (
          <div className="page-container">
            <h1 className="about-title">
              Welcome to <em>pinksheetmafia.com</em>
            </h1>
            
            <p className="about-text">
              This is a free, community-built, open-source resource designed to make NIFE less stressful. 
              Here you'll find problem generators and solvers (primarily for Navigation, plus Weather and FR&R), eps and limits practice/told cards for flight stage,
              as well as curated gouge documents/links and high-quality practice questions, all submitted and vetted by 
              students who have successfully made it through NIFE. 
            </p>
            
            <p className="about-text">
              This project is complete for now. I've personally written about 450 questions and 15 documents. Going forward, 
              any corrections or new content will be left up to the current NIFE community. 
              If you spot issues or have ideas for new features, please reach out at 
              pinksheetmafia@gmail.com.
            </p>
            
            <p className="about-text">
              The value of this resource depends on the community:
            </p>
            <ul className="about-list">
              <li>Submit questions, docs, and links you think will help future students.</li>
              <li>Edit or downvote outdated or incorrect content.</li>
              <li>
                If you're comfortable with code, contribute directly via our{' '}
                <a 
                  href="https://github.com/aloevinger/nifegouge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="about-link"
                >
                  open-source GitHub repo
                </a>.
              </li>
            </ul>
            
            <p className="about-text">
              Thanks,<br/>ENS Loevinger
            </p>
          </div>
        )}
        {currentPage === 'questions' && <Questions />}
        {currentPage === 'docs' && <Docs />}
        {currentPage === 'frr' && <FRR />}
        {currentPage === 'nav' && <Nav />}
        {currentPage === 'weather' && <Weather />}
        {currentPage === 'flight' && <Flight />}
      </div>
    </div>
  );
}

export default App;