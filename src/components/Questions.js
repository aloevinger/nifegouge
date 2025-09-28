import React, { useState, useEffect, useCallback} from 'react';

function Questions() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestionIndices, setSelectedQuestionIndices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [attempts, setAttempts] = useState([]);
  
  // Pending questions state
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [isPendingQuestion, setIsPendingQuestion] = useState(false);
  const [pendingQuestionType, setPendingQuestionType] = useState(null); // 'new' or 'edit'
  
  // Edit pair tracking
  const [isShowingEditPair, setIsShowingEditPair] = useState(false);
  const [editPairOriginal, setEditPairOriginal] = useState(null);
  const [justCompletedOriginal, setJustCompletedOriginal] = useState(false);
  
  // UI state
  const [topic, setTopic] = useState('aero');
  const [lecture, setLecture] = useState('All');
  const [numQuestions, setNumQuestions] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answerChoices, setAnswerChoices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  // Available lectures for current topic
  const [availableLectures, setAvailableLectures] = useState([]);
  
  // Review Mode state
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [reviewAnswers, setReviewAnswers] = useState({});
  
  // Voting state for approved questions
  const [votedQuestions, setVotedQuestions] = useState(() => {
    const saved = localStorage.getItem('votedQuestions');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Voting state for pending questions (tracks if user voted and which way)
  const [votedPendingQuestions, setVotedPendingQuestions] = useState(() => {
    const saved = localStorage.getItem('votedPendingQuestions');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('new');
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

  const API_BASE_URL = 'https://ms8qwr3ond.execute-api.us-east-2.amazonaws.com/prod';

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

  // Update available lectures when topic changes or questions are loaded
  const updateAvailableLectures = useCallback((topicVal, questionsArray = allQuestions) => {
    const topicQuestions = questionsArray.filter(q => 
      q.topic?.toString().toLowerCase() === topicVal.toLowerCase()
    );
    
    // Get unique lecture numbers and sort them
    const lectures = [...new Set(
      topicQuestions
        .map(q => q.lecture)
        .filter(lec => lec !== undefined && lec !== null && lec !== '')
        .map(lec => String(lec))
    )].sort((a, b) => {
      // Try to sort numerically if possible
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      // Otherwise sort alphabetically
      return a.localeCompare(b);
    });
    
    setAvailableLectures(lectures);
  }, [allQuestions]);

  const loadQuestion = useCallback((index, indices = selectedQuestionIndices, questions = filteredQuestions) => {
    if (index >= indices.length) {
      setShowReview(true);
      return;
    }
    
    // If we just completed an original question and have an edit pair to show
    if (justCompletedOriginal && editPairOriginal) {
      const editQuestion = pendingQuestions.find(q => 
        q.originalQuestionId === editPairOriginal.questionId && 
        q.type === 'edit' &&
        !votedPendingQuestions[q.questionId]
      );
      
      if (editQuestion) {
        // Load the edited version
        setCurrentQuestion(editQuestion);
        setIsPendingQuestion(true);
        setPendingQuestionType('edit');
        setIsShowingEditPair(true);
        setJustCompletedOriginal(false);
        
        const question = editQuestion.question;
        const correct = editQuestion.correctAnswer;
        const incorrect = [editQuestion.incorrectAnswer1, editQuestion.incorrectAnswer2, editQuestion.incorrectAnswer3].filter(Boolean);
        const allAnswers = prepareAnswerOptions([correct, ...incorrect]);
        
        setQuestionText(question);
        setAnswerChoices(allAnswers);
        setSelectedAnswer('');
        setIsAnswered(false);
        return;
      } else {
        // No edit available, clear the flags
        setJustCompletedOriginal(false);
        setEditPairOriginal(null);
      }
    }
    
    // Reset edit pair state
    setIsShowingEditPair(false);
    setEditPairOriginal(null);
    
    // Check if we should show a pending question instead (e.g., every 5th question)
    const shouldShowPending = pendingQuestions.length > 0 && (index + 1) % 5 === 0;
    
    if (shouldShowPending) {
      // Prioritize edit pairs first
      const editQuestions = pendingQuestions.filter(q => 
        q.type === 'edit' && 
        !votedPendingQuestions[q.questionId]
      );
      
      if (editQuestions.length > 0) {
        // Find the original question for this edit
        const editToShow = editQuestions[0];
        const originalQuestion = questions.find(q => 
          q.questionId === editToShow.originalQuestionId
        );
        
        if (originalQuestion) {
          // Load the original question first
          setCurrentQuestion(originalQuestion);
          setEditPairOriginal(originalQuestion);
          setIsPendingQuestion(false);
          setPendingQuestionType(null);
          
          const question = originalQuestion.question;
          const correct = originalQuestion.correctAnswer;
          const incorrect = [originalQuestion.incorrectAnswer1, originalQuestion.incorrectAnswer2, originalQuestion.incorrectAnswer3].filter(Boolean);
          const allAnswers = prepareAnswerOptions([correct, ...incorrect]);
          
          setQuestionText(question);
          setAnswerChoices(allAnswers);
          setSelectedAnswer('');
          setIsAnswered(false);
          return;
        }
      }
      
      // If no edit pairs, try new questions
      const newQuestions = pendingQuestions.filter(q => 
        q.type === 'new' && 
        !votedPendingQuestions[q.questionId]
      );
      
      if (newQuestions.length > 0) {
        const pendingQ = newQuestions[0];
        setCurrentQuestion(pendingQ);
        setIsPendingQuestion(true);
        setPendingQuestionType('new');
        
        const question = pendingQ.question;
        const correct = pendingQ.correctAnswer;
        const incorrect = [pendingQ.incorrectAnswer1, pendingQ.incorrectAnswer2, pendingQ.incorrectAnswer3].filter(Boolean);
        const allAnswers = prepareAnswerOptions([correct, ...incorrect]);
        
        setQuestionText(question);
        setAnswerChoices(allAnswers);
        setSelectedAnswer('');
        setIsAnswered(false);
        return;
      }
    }
    
    // Load a normal question
    loadNormalQuestion(index, indices, questions);
  }, [prepareAnswerOptions, selectedQuestionIndices, filteredQuestions, pendingQuestions, votedPendingQuestions, justCompletedOriginal, editPairOriginal]);

  const loadNormalQuestion = (index, indices, questions) => {
    const qData = questions[indices[index]];
    setCurrentQuestion(qData);
    setIsPendingQuestion(false);
    setPendingQuestionType(null);
    
    const question = qData.question;
    const correct = qData.correctAnswer;
    const incorrect = [qData.incorrectAnswer1, qData.incorrectAnswer2, qData.incorrectAnswer3].filter(Boolean);
    const allAnswers = prepareAnswerOptions([correct, ...incorrect]);
    
    setQuestionText(question);
    setAnswerChoices(allAnswers);
    setSelectedAnswer('');
    setIsAnswered(false);
  };

  const generateQuestions = useCallback((topicVal, lectureVal, n, questionsArray = allQuestions) => {
    const filtered = questionsArray.filter(q => {
      const topicMatch = q.topic?.toString().toLowerCase() === topicVal;
      const lectureMatch = lectureVal === 'All' || String(q.lecture) === lectureVal;
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
    setIsPendingQuestion(false);
    setPendingQuestionType(null);
    setIsShowingEditPair(false);
    setEditPairOriginal(null);
    setJustCompletedOriginal(false);
    
    // Update available lectures for the new topic
    updateAvailableLectures(topicVal, questionsArray);
    
    // Fetch pending questions for the new topic
    fetchPendingQuestions(topicVal);
    
    if (indices.length > 0) {
      loadQuestion(0, indices, filtered);
    }
  }, [allQuestions, loadQuestion, updateAvailableLectures]);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    
    const initialLoad = async () => {
      if (isMounted) {
        await fetchQuestionsFromDB();
        // Initial pending questions fetch will happen in generateQuestions
      }
    };
    
    initialLoad();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Load questions for review mode
  useEffect(() => {
    if (reviewMode && allQuestions.length > 0) {
      const filtered = allQuestions.filter(q => {
        const topicMatch = q.topic?.toString().toLowerCase() === topic;
        const lectureMatch = lecture === 'All' || String(q.lecture) === lecture;
        return topicMatch && lectureMatch;
      });
      
      // Prepare questions with randomized answers
      const preparedQuestions = filtered.map(q => {
        const correct = q.correctAnswer;
        const incorrect = [q.incorrectAnswer1, q.incorrectAnswer2, q.incorrectAnswer3].filter(Boolean);
        const allAnswers = prepareAnswerOptions([correct, ...incorrect]);
        return {
          ...q,
          preparedAnswers: allAnswers
        };
      });
      
      // Sort by lecture number if available
      preparedQuestions.sort((a, b) => {
        const lectureA = parseInt(a.lecture) || 0;
        const lectureB = parseInt(b.lecture) || 0;
        if (lectureA !== lectureB) return lectureA - lectureB;
        
        // Then by vote score
        const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
        const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
        return scoreB - scoreA;
      });
      
      setReviewQuestions(preparedQuestions);
    }
  }, [reviewMode, topic, lecture, allQuestions, prepareAnswerOptions]);

  // Toggle review mode
  const toggleReviewMode = () => {
    setReviewMode(!reviewMode);
    setExpandedQuestions(new Set());
    setReviewAnswers({});
    
    if (!reviewMode) {
      // Entering review mode - load questions for current topic
      const filtered = allQuestions.filter(q => {
        const topicMatch = q.topic?.toString().toLowerCase() === topic;
        const lectureMatch = lecture === 'All' || String(q.lecture) === lecture;
        return topicMatch && lectureMatch;
      });
      
      const preparedQuestions = filtered.map(q => {
        const correct = q.correctAnswer;
        const incorrect = [q.incorrectAnswer1, q.incorrectAnswer2, q.incorrectAnswer3].filter(Boolean);
        const allAnswers = prepareAnswerOptions([correct, ...incorrect]);
        return {
          ...q,
          preparedAnswers: allAnswers
        };
      });
      
      preparedQuestions.sort((a, b) => {
        const lectureA = parseInt(a.lecture) || 0;
        const lectureB = parseInt(b.lecture) || 0;
        if (lectureA !== lectureB) return lectureA - lectureB;
        
        const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
        const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
        return scoreB - scoreA;
      });
      
      setReviewQuestions(preparedQuestions);
    }else{
      generateQuestions(topic, lecture, numQuestions || allQuestions.length);
    }
  };

  // Handle question click in review mode
  const handleReviewQuestionClick = (questionId) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Handle answer selection in review mode
  const handleReviewAnswerSelect = (questionId, answer) => {
    setReviewAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const fetchQuestionsFromDB = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-questions`);
      const data = await response.json();
      
      if (data.success && data.questions) {
        setAllQuestions(data.questions);
        
        // Get unique topics
        const topics = [...new Set(
          data.questions
            .map(q => q.topic)
            .filter(topic => typeof topic === 'string' && topic.trim() !== '')
            .map(topic => topic.toString().toLowerCase())
        )];
        
        if (topics.length > 0) {
          const selectedTopic = topics[Math.floor(topics.length * Math.random())];
          setTopic(selectedTopic.trim());
          updateAvailableLectures(selectedTopic, data.questions);
          generateQuestions(selectedTopic, 'All', data.questions.length, data.questions);
        }
      } else {
        console.error('Failed to load questions from database');
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    }
  };

  const fetchPendingQuestions = async (topicFilter = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-pending-questions`);
      const data = await response.json();
      
      if (data.success && data.questions) {
        // Filter pending questions to only show those matching the current topic
        // AND that the user hasn't voted on
        const filteredPending = topicFilter 
          ? data.questions.filter(q => 
              q.topic?.toString().toLowerCase() === topicFilter.toLowerCase() &&
              !votedPendingQuestions[q.questionId]
            )
          : data.questions.filter(q => 
              q.topic?.toString().toLowerCase() === topic.toLowerCase() &&
              !votedPendingQuestions[q.questionId]
            );
        
        setPendingQuestions(filteredPending);
      }
    } catch (err) {
      console.error('Error loading pending questions:', err);
    }
  };

  const checkAndHandleThreshold = async (questionId, approveCount, rejectCount) => {
    const netScore = approveCount - rejectCount;
    
    if (netScore >= 3) {
      // Question approved - handle locally
      try {
        const response = await fetch(`${API_BASE_URL}/moderate-question`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionId: questionId,
            action: 'approve',
            moderator: 'community-threshold'
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log('Question approved by community!');
          // Refresh questions to include the newly approved one
          await fetchQuestionsFromDB();
          return 'approved';
        }
      } catch (error) {
        console.error('Error approving question:', error);
      }
    } else if (netScore <= -3) {
      // Question rejected - handle locally
      try {
        const response = await fetch(`${API_BASE_URL}/moderate-question`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionId: questionId,
            action: 'reject',
            moderator: 'community-threshold'
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log('Question rejected by community.');
          return 'rejected';
        }
      } catch (error) {
        console.error('Error rejecting question:', error);
      }
    }
    
    return null;
  };

  const voteOnPendingQuestion = async (questionId, voteType, isEditImprovement = false) => {
    try {
      // For edits, voteType might be 'better' or 'worse'
      // For new questions, it's 'approve' or 'reject'
      
      // Get current vote counts from the pending question
      const pendingQ = pendingQuestions.find(q => q.questionId === questionId);
      if (!pendingQ) return;
      
      // Update vote counts locally
      let newApproveCount = pendingQ.approveCount || 0;
      let newRejectCount = pendingQ.rejectCount || 0;
      
      if (voteType === 'approve' || voteType === 'better') {
        newApproveCount++;
      } else {
        newRejectCount++;
      }
      
      // Update local storage to remember this vote
      const newVoted = { ...votedPendingQuestions };
      newVoted[questionId] = voteType;
      setVotedPendingQuestions(newVoted);
      localStorage.setItem('votedPendingQuestions', JSON.stringify(newVoted));
      
      // Update the pending question's counts locally
      setPendingQuestions(prev => prev.map(q => 
        q.questionId === questionId 
          ? { ...q, approveCount: newApproveCount, rejectCount: newRejectCount }
          : q
      ));
      
      // Send vote to server
      await fetch(`${API_BASE_URL}/vote-pending-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: questionId,
          voteType: voteType === 'better' ? 'approve' : voteType === 'worse' ? 'reject' : voteType,
          isEdit: isEditImprovement
        })
      });
      
      // Check if threshold is met and handle accordingly
      const result = await checkAndHandleThreshold(questionId, newApproveCount, newRejectCount);
      
      if (result === 'approved') {
        alert(isEditImprovement ? 'Edit approved and applied!' : 'Question approved and added to the database!');
      } else if (result === 'rejected') {
        alert(isEditImprovement ? 'Edit rejected by the community.' : 'Question rejected by the community.');
      } else {
        // Show current vote count to user
        const netScore = newApproveCount - newRejectCount;
        const message = netScore > 0 
          ? `Vote recorded! Net score: +${netScore} (needs +3 for approval)`
          : `Vote recorded! Net score: ${netScore}`;
        console.log(message);
      }
      
      // Remove from pending questions list
      setPendingQuestions(prev => prev.filter(q => q.questionId !== questionId));
      
      // Only move to next question if this is a pending question that was answered
      if (isAnswered) {
        handleNextQuestion();
      }
      
    } catch (error) {
      console.error('Error voting on pending question:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const handleSubmitAnswer = () => {
    const correctAnswer = currentQuestion.correctAnswer;
    setIsAnswered(true);
    
    // Only record attempt for non-pending questions
    if (!isPendingQuestion) {
      setAttempts(prev => [...prev, {
        question: currentQuestion.question,
        chosen: selectedAnswer,
        correct: correctAnswer
      }]);
      
      // If this was the original in an edit pair, set flag to load the edit next
      if (editPairOriginal && currentQuestion.questionId === editPairOriginal.questionId) {
        setJustCompletedOriginal(true);
      }
    }
  };

  const handleNextQuestion = () => {
    setCurrentIndex(prev => prev + 1);
    loadQuestion(currentIndex + 1);
  };

  const handleReset = () => {
    setShowReview(false);
    setAttempts([]);
    generateQuestions(topic, lecture, numQuestions || allQuestions.length);
  };

  const handleTextareaChange = (e, field) => {
    e.target.style.height = e.target.scrollHeight + 'px';
    setModalData({...modalData, [field]: e.target.value});
  };

  const openSubmitModal = (mode = 'new') => {
    setModalMode(mode);
    
    if (mode === 'edit' && currentQuestion && !isPendingQuestion) {
      // Pre-fill with current question data
      setModalData({
        topic: currentQuestion.topic?.toString().toLowerCase() || topic,
        lecture: currentQuestion.lecture || '',
        question: questionText,
        correctAnswer: currentQuestion.correctAnswer || '',
        incorrectAnswer1: currentQuestion.incorrectAnswer1 || '',
        incorrectAnswer2: currentQuestion.incorrectAnswer2 || '',
        incorrectAnswer3: currentQuestion.incorrectAnswer3 || ''
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
  
    setTimeout(() => {
      const textareas = document.querySelectorAll('.modal textarea');
      textareas.forEach(textarea => {
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }, 0);
  };

  const submitModalQuestion = async () => {
    if (!modalData.question || !modalData.correctAnswer) {
      alert('Please complete all required fields.');
      return;
    }
    
    try {
      const endpoint = modalMode === 'edit' ? 'edit-question' : 'submit-question';
      const payload = {
        topic: modalData.topic,
        lecture: modalData.lecture,
        question: modalData.question,
        correctAnswer: modalData.correctAnswer,
        incorrectAnswer1: modalData.incorrectAnswer1,
        incorrectAnswer2: modalData.incorrectAnswer2,
        incorrectAnswer3: modalData.incorrectAnswer3,
        type: modalMode === 'edit' ? 'edit' : 'new'
      };
      
      if (modalMode === 'edit' && currentQuestion) {
        payload.originalQuestionId = currentQuestion.questionId;
      }
      
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(modalMode === 'edit' ? 'Question edit submitted for review!' : 'Question submitted for review!');
        setShowModal(false);
        // Refresh to get any new pending questions
        fetchPendingQuestions();
      } else {
        alert('Failed to submit question: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Failed to submit question. Please try again.');
    }
  };

  const handleVote = async (voteType) => {
    if (!currentQuestion || !currentQuestion.questionId) return;
    
    // If this is a pending question, use the pending vote system
    if (isPendingQuestion) {
      // Only allow voting after answering the question
      if (!isAnswered) return;
      
      const isEditVote = pendingQuestionType === 'edit';
      await voteOnPendingQuestion(currentQuestion.questionId, voteType, isEditVote);
      return;
    }
    
    // Normal voting behavior for approved questions - instant visual update
    const questionId = currentQuestion.questionId;
    const currentVote = votedQuestions[questionId];
    const isUnvoting = currentVote === voteType;
    
    // Update UI immediately
    const newVoted = { ...votedQuestions };
    if (isUnvoting) {
      delete newVoted[questionId];
    } else {
      newVoted[questionId] = voteType;
    }
    setVotedQuestions(newVoted);
    localStorage.setItem('votedQuestions', JSON.stringify(newVoted));
    
    // Update local state
    setAllQuestions(prevQuestions => prevQuestions.map(q => {
      if (q.questionId === questionId) {
        if (isUnvoting) {
          if (voteType === 'good') {
            return { ...q, upvotes: Math.max(0, (q.upvotes || 0) - 1) };
          } else {
            return { ...q, downvotes: Math.max(0, (q.downvotes || 0) - 1) };
          }
        } else if (currentVote && currentVote !== voteType) {
          if (voteType === 'good') {
            return { 
              ...q, 
              upvotes: (q.upvotes || 0) + 1,
              downvotes: Math.max(0, (q.downvotes || 0) - 1)
            };
          } else {
            return { 
              ...q, 
              upvotes: Math.max(0, (q.upvotes || 0) - 1),
              downvotes: (q.downvotes || 0) + 1
            };
          }
        } else {
          if (voteType === 'good') {
            return { ...q, upvotes: (q.upvotes || 0) + 1 };
          } else {
            return { ...q, downvotes: (q.downvotes || 0) + 1 };
          }
        }
      }
      return q;
    }));
    
    // Update current question for UI
    setCurrentQuestion(prevQuestion => {
      if (!prevQuestion || prevQuestion.questionId !== questionId) return prevQuestion;
      
      let updatedQuestion = { ...prevQuestion };
      if (isUnvoting) {
        if (voteType === 'good') {
          updatedQuestion.upvotes = Math.max(0, (updatedQuestion.upvotes || 0) - 1);
        } else {
          updatedQuestion.downvotes = Math.max(0, (updatedQuestion.downvotes || 0) - 1);
        }
      } else if (currentVote && currentVote !== voteType) {
        if (voteType === 'good') {
          updatedQuestion.upvotes = (updatedQuestion.upvotes || 0) + 1;
          updatedQuestion.downvotes = Math.max(0, (updatedQuestion.downvotes || 0) - 1);
        } else {
          updatedQuestion.upvotes = Math.max(0, (updatedQuestion.upvotes || 0) - 1);
          updatedQuestion.downvotes = (updatedQuestion.downvotes || 0) + 1;
        }
      } else {
        if (voteType === 'good') {
          updatedQuestion.upvotes = (updatedQuestion.upvotes || 0) + 1;
        } else {
          updatedQuestion.downvotes = (updatedQuestion.downvotes || 0) + 1;
        }
      }
      return updatedQuestion;
    });
    
    // Send to server quietly in the background (no await)
    fetch(`${API_BASE_URL}/vote-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: questionId,
        voteType: voteType
      })
    }).catch(error => {
      console.error('Error recording vote:', error);
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

  // Review Mode UI
  if (reviewMode) {
    return (
      <div className="questions-container review-mode-container">
        {/* Review Mode Header */}
        <div className="review-mode-header">
          <button 
            className="review-mode-toggle"
            onClick={toggleReviewMode}
            style={{
              marginBottom: '15px',
              padding: '10px 20px',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              width: '100%'
            }}
          >
            Enter Test Mode
          </button>
          
          <div className="review-mode-controls" style={{ marginBottom: '20px' }}>
            <select 
              value={topic} 
              onChange={(e) => {
                setTopic(e.target.value);
                setLecture('All'); // Reset lecture to All when topic changes
                updateAvailableLectures(e.target.value);
              }}
              style={{
                padding: '10px 15px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid #ccc'
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
              onChange={(e) => setLecture(e.target.value)}
              style={{
                padding: '10px 15px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid #ccc',
                marginLeft: '10px'
              }}
            >
              <option value="All">All Lectures</option>
              {availableLectures.map(lec => (
                <option key={lec} value={lec}>Lecture {lec}</option>
              ))}
            </select>
            
            <span style={{ 
              marginLeft: '20px', 
              fontSize: '16px', 
              color: '#666' 
            }}>
              {reviewQuestions.length} questions available
            </span>
          </div>
        </div>
        
        {/* Review Questions List */}
        <div className="review-questions-list" style={{
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          paddingRight: '10px'
        }}>
          {reviewQuestions.map((question, idx) => (
            <div 
              key={question.questionId}
              className="review-question-item"
              style={{
                marginBottom: '20px',
                border: '2px solid #ddd',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Question Header */}
              <div 
                className="review-question-header"
                onClick={() => handleReviewQuestionClick(question.questionId)}
                style={{
                  padding: '15px',
                  backgroundColor: expandedQuestions.has(question.questionId) ? '#f0f0f0' : '#f9f9f9',
                  cursor: 'pointer',
                  borderBottom: expandedQuestions.has(question.questionId) ? '1px solid #ddd' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontWeight: 'bold',
                    marginRight: '10px',
                    color: '#01202C'
                  }}>
                    Q{idx + 1}
                    {question.lecture && ` (Lecture ${question.lecture})`}
                  </span>
                  <div style={{ 
                    marginTop: '8px',
                    fontSize: '16px',
                    lineHeight: '1.5'
                  }}>
                    {question.question}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginLeft: '15px'
                }}>
                  <span style={{
                    fontSize: '20px',
                    transform: expandedQuestions.has(question.questionId) ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s'
                  }}>
                    ▼
                  </span>
                  {question.upvotes !== undefined && (
                    <span style={{
                      marginTop: '5px',
                      fontSize: '12px',
                      color: ((question.upvotes || 0) - (question.downvotes || 0)) >= 0 ? '#4CAF50' : '#f44336',
                      fontWeight: 'bold'
                    }}>
                      {((question.upvotes || 0) - (question.downvotes || 0)) >= 0 ? '+' : ''}
                      {(question.upvotes || 0) - (question.downvotes || 0)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Answers (shown when expanded) */}
              {expandedQuestions.has(question.questionId) && (
                <div 
                  className="review-answers"
                  style={{
                    padding: '15px',
                    backgroundColor: '#fff'
                  }}
                >
                  {question.preparedAnswers.map((answer, ansIdx) => {
                    const isSelected = reviewAnswers[question.questionId] === answer;
                    const isCorrect = answer === question.correctAnswer;
                    const showResult = isSelected;
                    
                    return (
                      <div
                        key={ansIdx}
                        onClick={() => handleReviewAnswerSelect(question.questionId, answer)}
                        style={{
                          padding: '10px 15px',
                          margin: '8px 0',
                          border: '2px solid',
                          borderColor: showResult && isCorrect ? '#4CAF50' : 
                                      showResult && !isCorrect ? '#f44336' : 
                                      '#ddd',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: showResult && isCorrect ? '#e8f5e9' :
                                         showResult && !isCorrect ? '#ffebee' :
                                         isSelected ? '#f5f5f5' : 'white',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{
                            marginRight: '10px',
                            fontWeight: 'bold',
                            color: showResult && isCorrect ? '#4CAF50' :
                                   showResult && !isCorrect ? '#f44336' :
                                   '#666'
                          }}>
                            {String.fromCharCode(65 + ansIdx)}.
                          </span>
                          <span style={{
                            flex: 1,
                            color: showResult && !isCorrect ? '#999' : '#333'
                          }}>
                            {answer}
                          </span>
                          {showResult && isCorrect && (
                            <span style={{ 
                              color: '#4CAF50', 
                              fontWeight: 'bold',
                              marginLeft: '10px'
                            }}>
                              ✓
                            </span>
                          )}
                          {showResult && !isCorrect && (
                            <span style={{ 
                              color: '#f44336', 
                              fontWeight: 'bold',
                              marginLeft: '10px'
                            }}>
                              ✗
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          
          {reviewQuestions.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '50px',
              color: '#999'
            }}>
              No questions available for this topic
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>      
      <div className={`questions-container ${isPendingQuestion ? 'pending-question-mode' : ''} ${editPairOriginal ? 'edit-pair-mode' : ''}`}>
        {/* Review Mode Toggle Button */}
        <button 
          className="review-mode-toggle"
          onClick={toggleReviewMode}
          style={{
            marginBottom: '15px',
            padding: '10px 20px',
            backgroundColor: '#01202C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            width: '100%'
          }}
        >
          Enter Review Mode
        </button>
        
        <div className="dropdown-row">
          <select 
            value={topic} 
            onChange={(e) => {
              setTopic(e.target.value);
              setLecture('All'); // Reset lecture to All when topic changes
              generateQuestions(e.target.value, 'All', numQuestions);
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
            {availableLectures.map(lec => (
              <option key={lec} value={lec}>Lecture {lec}</option>
            ))}
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
              {/* Edit pair notification for original */}
              {editPairOriginal && !isPendingQuestion && (
                <div style={{ 
                  padding: '10px',
                  marginBottom: '15px',
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #2196f3',
                  borderRadius: '5px',
                  color: '#1565c0',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  Original Question - An edited version will follow
                </div>
              )}
              
              {/* Pending question notification */}
              {isPendingQuestion && pendingQuestionType === 'new' && (
                <div style={{ 
                  padding: '10px',
                  marginBottom: '15px',
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '5px',
                  color: '#856404',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  Community Review: New Question - Please vote after answering
                  {currentQuestion && currentQuestion.approveCount !== undefined && (
                    <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
                      Current: {currentQuestion.approveCount || 0} approvals, {currentQuestion.rejectCount || 0} rejections
                      (needs net +3 for approval)
                    </div>
                  )}
                </div>
              )}
              
              {/* Edit improvement notification */}
              {isPendingQuestion && pendingQuestionType === 'edit' && (
                <div style={{ 
                  padding: '10px',
                  marginBottom: '15px',
                  backgroundColor: '#e8f5e9',
                  border: '1px solid #4caf50',
                  borderRadius: '5px',
                  color: '#2e7d32',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  Edited Version - Is this an improvement?
                  {currentQuestion && currentQuestion.approveCount !== undefined && (
                    <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
                      Current: {currentQuestion.approveCount || 0} say better, {currentQuestion.rejectCount || 0} say worse
                      (needs net +3 for approval)
                    </div>
                  )}
                </div>
              )}
              
              <span className="q-badge">
                Q {currentIndex + 1}/{selectedQuestionIndices.length}
              </span>
              <div className="qa-box question-area">
                {questionText}
              </div>
              
              <div className="qa-box">
                <div className="radio-list">
                  {answerChoices.map((choice, idx) => (
                    <label 
                      key={idx}
                      className={
                        isAnswered && choice === currentQuestion.correctAnswer ? 'correct' :
                        isAnswered && selectedAnswer === choice && choice !== currentQuestion.correctAnswer ? 'wrong' :
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
                ) : !isPendingQuestion ? (
                  <button className="submitBtn" onClick={handleNextQuestion}>
                    {currentIndex + 1 >= selectedQuestionIndices.length ? 'Review' : 'Next Question'}
                  </button>
                ) : null}
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
            
            {/* Vote Buttons - Required for pending questions after submit */}
            {(!isPendingQuestion || isAnswered) && (
              <div className="feedback-row">
                <button 
                  className={`thumb-btn up ${
                    isPendingQuestion 
                      ? votedPendingQuestions[currentQuestion?.questionId] === 'approve' || votedPendingQuestions[currentQuestion?.questionId] === 'better' ? 'active' : ''
                      : votedQuestions[currentQuestion?.questionId] === 'good' ? 'active' : ''
                  }`}
                  onClick={() => handleVote(pendingQuestionType === 'edit' ? 'better' : 'good')}
                  title={
                    isPendingQuestion 
                      ? (pendingQuestionType === 'edit' ? "Better than original" : "Approve question")
                      : "Good question"
                  }
                  disabled={isPendingQuestion && votedPendingQuestions[currentQuestion?.questionId]}
                >
                  <img src="/images/thumb.png" alt="Thumbs up" />
                  {isPendingQuestion && (
                    <span style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      color: 'white'
                    }}>
                      {pendingQuestionType === 'edit' ? 'Better' : 'Approve'}
                    </span>
                  )}
                </button>
                {!isPendingQuestion && currentQuestion && (
                  <span className={`vote-score ${((currentQuestion.upvotes || 0) - (currentQuestion.downvotes || 0)) >= 0 ? 'positive' : 'negative'}`}>
                    {((currentQuestion.upvotes || 0) - (currentQuestion.downvotes || 0)) >= 0 ? '+' : ''}
                    {(currentQuestion.upvotes || 0) - (currentQuestion.downvotes || 0)}
                  </span>
                )}
                <button 
                  className={`thumb-btn down ${
                    isPendingQuestion 
                      ? votedPendingQuestions[currentQuestion?.questionId] === 'reject' || votedPendingQuestions[currentQuestion?.questionId] === 'worse' ? 'active' : ''
                      : votedQuestions[currentQuestion?.questionId] === 'bad' ? 'active' : ''
                  }`}
                  onClick={() => handleVote(pendingQuestionType === 'edit' ? 'worse' : 'bad')}
                  title={
                    isPendingQuestion 
                      ? (pendingQuestionType === 'edit' ? "Worse than original" : "Reject question")
                      : "Bad question"
                  }
                  disabled={isPendingQuestion && votedPendingQuestions[currentQuestion?.questionId]}
                >
                  <img src="/images/thumb-down.png" alt="Thumbs down" />
                  {isPendingQuestion && (
                    <span style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      color: 'white'
                    }}>
                      {pendingQuestionType === 'edit' ? 'Worse' : 'Reject'}
                    </span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
        
        {/* Edit Current Question Button - only for non-pending questions */}
        {currentQuestion && !isPendingQuestion && !editPairOriginal && (
          <button className="submitBtn" onClick={() => openSubmitModal('edit')}>
            Edit Current Question
          </button>
        )}
        
        {/* Submit New Question Button */}
        <button className="submitBtn" onClick={() => openSubmitModal('new')}>
          Submit a Question
        </button>
      </div>
      
      {/* Modals remain the same */}
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
                placeholder="Enter Lecture Number (optional)"
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
            
            <button className="submitBtn" onClick={submitModalQuestion}>
              {modalMode === 'edit' ? 'Submit Edit' : 'Submit Question'}
            </button>
          </div>
        </div>
      )}

      {/* Weather Figure PDF Modal */}
      {showPdfModal && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && setShowPdfModal(false)}>
          <div className="modal-content" style={{ maxWidth: '95%', width: 'auto', height: '90vh', margin: '2.5vh auto', padding: '10px' }}>
            
            <span className="close-button" onClick={() => setShowPdfModal(false)}>&times;</span>
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