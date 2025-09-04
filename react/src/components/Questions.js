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
      specialOptions.some(special => opt?.toLowerCase().includes(special))
    );
    const otherOptions = answers.filter(opt =>
      !specialOptions.some(special => opt?.toLowerCase().includes(special))
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
      const topicMatch = q[0]?.toLowerCase() === topicVal;
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
            .map(topic => topic.toLowerCase())
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

  const openSubmitModal = (mode = 'new') => {
    setModalMode(mode);
    
    if (mode === 'edit' && currentQuestion) {
      // Pre-fill with current question data
      setModalData({
        topic: currentQuestion[0]?.toLowerCase() || topic,
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
      const data = JSON.parse(text);
      if (data.success) {
        alert('Submitted!');
        setShowModal(false);
      }
    })
    .catch(err => console.error('Error:', err));
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
            
            <div className="qa-box">
              <textarea 
                placeholder="Enter your question here..."
                value={modalData.question}
                onChange={(e) => setModalData({...modalData, question: e.target.value})}
              />
            </div>
            
            <div className="qa-box">
              <textarea 
                placeholder="Correct Answer"
                value={modalData.correctAnswer}
                onChange={(e) => setModalData({...modalData, correctAnswer: e.target.value})}
              />
              <textarea 
                placeholder="Incorrect Answer 1"
                value={modalData.incorrectAnswer1}
                onChange={(e) => setModalData({...modalData, incorrectAnswer1: e.target.value})}
              />
              <textarea 
                placeholder="Incorrect Answer 2"
                value={modalData.incorrectAnswer2}
                onChange={(e) => setModalData({...modalData, incorrectAnswer2: e.target.value})}
              />
              <textarea 
                placeholder="Incorrect Answer 3"
                value={modalData.incorrectAnswer3}
                onChange={(e) => setModalData({...modalData, incorrectAnswer3: e.target.value})}
              />
            </div>
            
            <button className="submitBtn" onClick={submitModalQuestion}>
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Questions;