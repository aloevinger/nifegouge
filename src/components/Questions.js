import React, { useState, useEffect, useCallback} from 'react';
import * as XLSX from 'xlsx';

function Questions() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestionIndices, setSelectedQuestionIndices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [attempts, setAttempts] = useState([]);
  
  // UI state
  const [topic, setTopic] = useState('aero');
  const [lecture, setLecture] = useState('All');
  const [numQuestions, setNumQuestions] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answerChoices, setAnswerChoices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('new'); // 'new' or 'edit'
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [modalData, setModalData] = useState({
    topic: 'aero',
    lecture: '',
    question: '',
    correctAnswer: '',
    incorrectAnswer1: '',
    incorrectAnswer2: '',
    incorrectAnswer3: ''
  });

  const prepareAnswerOptions = useCallback((answers) => {
    const specialOptions = ['all of the above', 'none of the above'];
    const lastOptions = answers.filter(opt =>
      specialOptions.some(special => opt?.toString().toLowerCase().includes(special))
    );
    const otherOptions = answers.filter(opt =>
      !specialOptions.some(special => opt?.toString().toLowerCase().includes(special))
    );
    
    return [...shuffle(otherOptions), ...lastOptions];
  }, []);

  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const loadQuestion = useCallback((index, indices = selectedQuestionIndices, questions = filteredQuestions) => {
    if (index >= indices.length) {
      setShowReview(true);
      return;
    }
    
    const qData = questions[indices[index]];
    setCurrentQuestion(qData);
    
    const question = qData[2];
    const correct = qData[3];
    const incorrect = [qData[4], qData[5], qData[6]].filter(Boolean);
    const allAnswers = prepareAnswerOptions([correct, ...incorrect]);
    
    setQuestionText(question);
    setAnswerChoices(allAnswers);
    setSelectedAnswer('');
    setIsAnswered(false);
  }, [prepareAnswerOptions, selectedQuestionIndices, filteredQuestions]);

  const generateQuestions = useCallback((topicVal, lectureVal, n, questionsArray = allQuestions) => {
    const filtered = questionsArray.filter(q => {
      const topicMatch = q[0]?.toString().toLowerCase() === topicVal;
      const lectureMatch = lectureVal === 'All' || String(q[1]) === lectureVal;
      return topicMatch && lectureMatch;
    });
    
    setFilteredQuestions(filtered);
    const total = filtered.length;
    let count = n;
    
    if (!n || n === 'All' || n > total) {
      count = total;
    }
    
    let indices = [];
    while (indices.length < count) {
      const rand = Math.floor(Math.random() * total);
      if (!indices.includes(rand)) {
        indices.push(rand);
      }
    }
    
    setSelectedQuestionIndices(indices);
    setCurrentIndex(0);
    setAttempts([]);
    setShowReview(false);
    
    if (indices.length > 0) {
      loadQuestion(0, indices, filtered);
    }
  }, [allQuestions, loadQuestion]);

  // Load Excel file on mount
  useEffect(() => {
    fetch('/questions.xlsx')
      .then(res => res.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const questions = json.slice(1).filter(row => row[0]);
        setAllQuestions(questions);
        
        // Get unique topics
        const topics = [...new Set(
          questions
            .map(row => row[0])
            .filter(topic => typeof topic === 'string' && topic.trim() !== '')
            .map(topic => topic.toString().toLowerCase())
        )];
        
        if (topics.length > 0) {
          const selectedTopic = topics[Math.floor(topics.length * Math.random())];
          setTopic(selectedTopic.trim());
          generateQuestions(selectedTopic, 'All', questions.length, questions);
        }
      })
      .catch(err => console.error('Error loading Excel file:', err));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitAnswer = () => {
    
    const correctAnswer = currentQuestion[3];
    setIsAnswered(true);
    
    // Record attempt
    setAttempts(prev => [...prev, {
      question: currentQuestion[2],
      chosen: selectedAnswer,
      correct: correctAnswer
    }]);
  };

  const handleNextQuestion = () => {
    setCurrentIndex(prev => prev + 1);
    loadQuestion(currentIndex + 1);
  };

  const handleReset = () => {
    // Reset to a new quiz with the same settings
    setShowReview(false);
    setAttempts([]);
    generateQuestions(topic, lecture, numQuestions || allQuestions.length);
  };

  const handleTextareaChange = (e, field) => {
    // Auto-resize textarea
    e.target.style.height = e.target.scrollHeight + 'px';
    
    // Update modal data
    setModalData({...modalData, [field]: e.target.value});
  };

  const openSubmitModal = (mode = 'new') => {
    setModalMode(mode);
    
    if (mode === 'edit' && currentQuestion) {
      // Pre-fill with current question data
      setModalData({
        topic: currentQuestion[0]?.toString().toLowerCase() || topic,
        lecture: currentQuestion[1] || '',
        question: questionText,
        correctAnswer: currentQuestion[3] || '',
        incorrectAnswer1: currentQuestion[4] || '',
        incorrectAnswer2: currentQuestion[5] || '',
        incorrectAnswer3: currentQuestion[6] || ''
      });
    } else {
      // Clear for new question
      setModalData({
        topic: topic,
        lecture: '',
        question: '',
        correctAnswer: '',
        incorrectAnswer1: '',
        incorrectAnswer2: '',
        incorrectAnswer3: ''
      });
    }
    
    setShowModal(true);
  
    // Resize textareas after modal opens
    setTimeout(() => {
      const textareas = document.querySelectorAll('.modal textarea');
      textareas.forEach(textarea => {
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }, 0);
  };

  const submitModalQuestion = () => {
    if (!modalData.question || !modalData.correctAnswer) {
      alert('Please complete all required fields.');
      return;
    }
    
    const submission = {
      mode: modalMode,
      topic: modalData.topic,
      lecture: modalData.lecture,
      question: modalData.question,
      options: [
        modalData.correctAnswer,
        modalData.incorrectAnswer1,
        modalData.incorrectAnswer2,
        modalData.incorrectAnswer3
      ].filter(Boolean),
      id: modalMode === 'edit' && currentQuestion ? currentQuestion[7] : ''
    };
    
    // Show immediate success message and close modal
    alert('Question submitted!');
    setShowModal(false);
    
    // Submit to Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbxZYDa0GlMHQtpE6zhvFuPZWCu5JzsDDhg7mEd3cRCqsFlg84g81_yoyj24Nrkuc072/exec', {
      redirect: 'follow',
      method: 'POST',
      body: JSON.stringify(submission),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    })
    .then(res => res.text())
    .then(text => {
      try {
        const data = JSON.parse(text);
        if (!data.success) {
          // If submission failed, alert the user
          alert('Something went wrong with submission. Please try again.');
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        alert('Something went wrong with submission. Please try again.');
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Something went wrong with submission. Please try again.');
    });
  };

  // Review Screen Component
  const ReviewScreen = () => {
    const correctCount = attempts.filter(a => a.chosen === a.correct).length;
    const total = attempts.length;
    
    return (
      <div className="review-screen">
        <h2>{topic.charAt(0).toUpperCase() + topic.slice(1)} Review</h2>
        <div style={{ marginBottom: '16px', fontWeight: '600' }}>
          Score: {correctCount} / {total}
        </div>
        
        {attempts.map((attempt, idx) => (
          <div key={idx} className="review-item">
            <div className="review-q">
              Q{idx + 1}. {attempt.question}
            </div>
            <div className={`review-a ${attempt.chosen !== attempt.correct ? 'wrong' : ''}`}>
              Your answer: {attempt.chosen || '(no selection)'}
            </div>
            {attempt.chosen !== attempt.correct && (
              <div className="review-correct">
                Correct: {attempt.correct}
              </div>
            )}
          </div>
        ))}
        
        <button className="review-reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    );
  };

  if (showReview) {
    return (
      <>
        <div className="page-container">
          <ReviewScreen />
        </div>
      </>
    );
  }

  return (
    <>      
      <div className="questions-container">
        <div className="dropdown-row">
          <select 
            value={topic} 
            onChange={(e) => {
              setTopic(e.target.value);
              generateQuestions(e.target.value, lecture, numQuestions);
            }}
          >
            <option value="aero">Aero</option>
            <option value="engines">Engines</option>
            <option value="frr">FR&R</option>
            <option value="nav">Nav</option>
            <option value="weather">Weather</option>
            <option value="ground">Ground School</option>
          </select>
          
          <select 
            value={lecture}
            onChange={(e) => {
              setLecture(e.target.value);
              generateQuestions(topic, e.target.value, numQuestions);
            }}
          >
            <option value="All">All Lectures</option>
          </select>
          
          <select 
            value={numQuestions}
            onChange={(e) => {
              setNumQuestions(e.target.value);
              generateQuestions(topic, lecture, parseInt(e.target.value));
            }}
          >
            <option value="" disabled>No. of Questions</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="10000">All</option>
          </select>
        </div>
        
        {questionText && (
          <>
            <div className="qa-container">
              <span className="q-badge">Q {currentIndex + 1}/{selectedQuestionIndices.length}</span>
              <div className="qa-box question-area">
                {questionText}
              </div>
              
              <div className="qa-box">
                <div className="radio-list">
                  {answerChoices.map((choice, idx) => (
                    <label 
                      key={idx}
                      className={
                        isAnswered && choice === currentQuestion[3] ? 'correct' :
                        isAnswered && selectedAnswer === choice && choice !== currentQuestion[3] ? 'wrong' :
                        !isAnswered && selectedAnswer === choice ? 'selected' : ''
                      }
                      onClick={() => !isAnswered && setSelectedAnswer(choice)}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={choice}
                        checked={selectedAnswer === choice}
                        onChange={() => {}}
                        disabled={isAnswered}
                      />
                      {choice}
                    </label>
                  ))}
                </div>
                
                {!isAnswered ? (
                  <button className="submitBtn" onClick={handleSubmitAnswer}>
                    Submit
                  </button>
                ) : (
                  <button className="submitBtn" onClick={handleNextQuestion}>
                    {currentIndex + 1 >= selectedQuestionIndices.length ? 'Review' : 'Next Question'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Weather Figure PDF Button */}
            {topic === 'weather' && (
              <div style={{ textAlign: 'center', margin: '15px 0' }}>
                <button 
                  className="submitBtn" 
                  onClick={() => setShowPdfModal(true)}
                  style={{ 
                    fontSize: '0.9em', 
                    padding: '8px 16px'
                  }}
                >
                  View Weather Figures
                </button>
              </div>
            )}
            
            <div className="feedback-row">
              <button className="thumb-btn up">
                <img src="/images/thumb.png" alt="Thumbs up" />
              </button>
              <button className="thumb-btn down" onClick={() => openSubmitModal('edit')}>
                <img src="/images/thumb-down.png" alt="Thumbs down" />
              </button>
            </div>
          </>
        )}
        
        <button className="submitBtn" onClick={() => openSubmitModal('new')}>
          Submit a Question
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/questions.xlsx';
              link.download = 'questions.xlsx';
              link.click();
            }}
            style={{
              padding: '4px 8px',
              fontSize: '0.7em',
              backgroundColor: '#01202C',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Download All Questions Excel Sheet
          </button>
        </div>
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && setShowModal(false)}>
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
            <h2>{modalMode === 'edit' ? 'Edit Question' : 'Submit a New Question'}</h2>
            
            <div className="dropdown-row">
              <select 
                value={modalData.topic}
                onChange={(e) => setModalData({...modalData, topic: e.target.value})}
              >
                <option value="aero">Aero</option>
                <option value="engines">Engines</option>
                <option value="frr">FR&R</option>
                <option value="nav">Nav</option>
                <option value="weather">Weather</option>
                <option value="ground">Ground School</option>
              </select>
              <input 
                type="text" 
                placeholder="Enter Lecture Number"
                value={modalData.lecture}
                onChange={(e) => setModalData({...modalData, lecture: e.target.value})}
              />
            </div>
            
            <div className="qa-box question-area">
              <label>
                <textarea 
                  placeholder="Enter your question here..."
                  value={modalData.question}
                    onChange={(e) => handleTextareaChange(e, 'question')}
                />
              </label>
            </div>
            
            <div className="qa-box">
              <form id="submitAnswerForm" className="radio-list">
                <label>
                  <textarea 
                    placeholder="Correct Answer"
                    value={modalData.correctAnswer}
                    onChange={(e) => handleTextareaChange(e, 'correctAnswer')}
                  />
                </label>
                <label>
                  <textarea 
                    placeholder="Incorrect Answer 1"
                    value={modalData.incorrectAnswer1}
                    onChange={(e) => handleTextareaChange(e, 'incorrectAnswer1')}
                  />
                </label>
                <label>
                  <textarea 
                    placeholder="Incorrect Answer 2"
                    value={modalData.incorrectAnswer2}
                    onChange={(e) => handleTextareaChange(e, 'incorrectAnswer2')}
                  />
                </label>
                <label>
                  <textarea 
                    placeholder="Incorrect Answer 3"
                    value={modalData.incorrectAnswer3}
                    onChange={(e) => handleTextareaChange(e, 'incorrectAnswer3')}
                  />
                </label>
              </form>
            </div>
            
            <button 
              id="badQuestionBtn" 
              style={{
                display: 'none', 
                backgroundColor: '#e74c3c',  // camelCase and string value
                color: 'white', 
                padding: '10px', 
                border: 'none', 
                borderRadius: '5px',  // camelCase
                marginBottom: '10px',  // camelCase
                cursor: 'pointer'
              }}
            >
              It’s just a bad question
            </button>
            <button className="submitBtn" onClick={submitModalQuestion}>
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Weather Figure PDF Modal */}
      {showPdfModal && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && setShowPdfModal(false)}>
          <div className="modal-content" style={{ maxWidth: '95%', width: 'auto', height: '90vh', margin: '2.5vh auto', padding: '10px' }}>
            
            <span className="close-button" onClick={() =>setShowPdfModal(false)}>&times;</span>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Weather Figures</h2>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/Metars, Tafs, and station model.pdf';
                  link.download = 'Weather_Figures.pdf';
                  link.click();
                }}
              >
                Download PDF
              </button>
            </div>
            
            <div style={{ width: '100%', height: 'calc(90vh - 120px)'}}>
              <iframe
                src="/Metars, Tafs, and station model.pdf"
                title="Weather Figures PDF"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none' 
                }}
              >
                <p>Your browser does not support PDFs. 
                  <a href="/Metars, Tafs, and station model.pdf" target="_blank" rel="noopener noreferrer">
                    Click here to download the PDF
                  </a>
                </p>
              </iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Questions;