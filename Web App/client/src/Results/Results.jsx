import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { postAnswer } from '../services/Student-Service';
import { viewAllResults } from '../services/Dashboard-Service';

import './style.css';

export const Result = () => {
  const location = useLocation();
  const { answers, testDetails} = location.state || {}
  const questions = testDetails.questions
  console.log(questions)
  const totalQuestions = questions.length;
  const answerslist = [];

  let correctCount = 0;
  for (let i = 0; i < totalQuestions; i++) {
    let answerObject;
    if (questions[i].type === "Corsi") {
      answerObject = {
      questionId: questions[i]._id,
      textAnswer: answers[i],
      isCorrect: true
      }
    }
    else{
      answerObject = {
      questionId: questions[i]._id,
      textAnswer: answers[i],
      isCorrect: answers[i] == questions[i].correctAnswer
      }
    }
    if (answerObject.isCorrect === true) { correctCount++ }
    answerslist.push(answerObject);
  }
  console.log(answerslist)
  const percentageCorrect = (correctCount / totalQuestions) * 100;
  const timeTaken = 0;
  postAnswer(testDetails._id, answerslist, correctCount, timeTaken)
 
  return (
    <div className="results container-fluid justify-content-center align-items-center">
      <div className="text-center my-4">
        <h1>Results</h1>
        <div className="result-title bg-custom p-3 rounded shadow">
          <h5>{`You got ${correctCount} out of ${totalQuestions} correct.`}</h5>
          <h5>{`That's ${(percentageCorrect).toFixed(2)}% correct.`}</h5>
        </div>
        <table className="table rounded shadow">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Question Type</th>
              <th scope="col">Question Difficulty</th>
              <th scope="col">Your Answer</th>
              <th scope="col">Correct?</th>
            </tr>
          </thead>
          <tbody>
            {answerslist.map((answer, index) => (
              <tr key={answer.questionId}>
                <th scope="row">{index + 1}</th>
                <td>{questions[index].type}</td>
                <td>{questions[index].difficulty}</td>
                <td>{answer.textAnswer}</td>
                <td><span className={`correct-${answer.isCorrect}`}>{answer.isCorrect ? 'Correct' : 'Incorrect'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DashboardResult = () => {
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  
  useEffect(() => {
    viewAllResults().then(response => {
      console.log(response)
      setResults(response);
  })},[])

  const handleViewClick = (result) => {
    console.log(result)
    setSelectedResult(result); 
    setShowModal(true);
  };

  return(
    <div className="results container-fluid">
      { showModal && ( 
        <AnswerModal result={selectedResult} setShowModal={setShowModal}/>
      )}
      <div className="search-bar"></div>
      <div className="results-list overflow-auto">
        <div className="header" >
          <span>Class</span>
          <span>Test</span>
          <span>Student</span>
          <span>Result</span>
          <span>Time Taken</span>
          <span> View Result </span>
        </div>
        <ul className="list-group list-result">
          {results.map(result => (
            <li className="list-group-item" key={result.class_no.class_no}>
              <div className="row">
                <span className="badge bg-primary text-center">{result.class_no.class_no}</span>
                <span className="badge bg-primary text-center">{result.testId.id}</span>
                <span className="badge bg-primary text-center">{result.userId.id}</span>
                <span className="badge bg-primary text-center">
                  {result.totalPercentage?.$numberDecimal ? (result.totalPercentage.$numberDecimal * 100) : "0"}% ( {result.totalCorrect?.$numberDecimal || "N/A"} / {result.answers?.length || "N/A"} )
                </span>
                <span className="badge bg-primary text-center">{result.totalTimeTaken.$numberDecimal} / {result.testId.duration} seconds</span>
                <button className="badge bg-primary" onClick={() => handleViewClick(result)}> View </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const AnswerModal = ({result,setShowModal}) => {
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Result for {result.testId.id}</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="question-list overflow-auto">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 3fr 1fr', gap: '10px' }}>
                  <div className="text-center">#</div>
                  <div className="text-center">Type</div>
                  <div className="text-center">Difficulty</div>
                  <div className="text-center"></div>
                </div>
                <ul className="list-group list-question">
                  {result?.answers.questions.map((question, index) => (
                    <li className="list-group-item" key={question._id}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 3fr 1fr', gap: '10px' }}>
                        <div className="badge bg-primary text-center">{index+1}</div>
                        <div className="badge bg-secondary text-center">{question.type}</div>
                        <div className="badge bg-secondary text-center">{question.difficulty}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          <div className="modal-footer">
              
          </div>
          </div>
        </div>
      </div>
  )
}
