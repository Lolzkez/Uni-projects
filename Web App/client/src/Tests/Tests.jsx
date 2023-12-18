import React,{useState, useEffect} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import { viewClassTests } from "../services/Student-Service";
import { TestFooter,renderQuestion } from "../components/test-components";

export const Tests = () => {
  const { type } = useParams();
  const [title, setTitle] = useState("");
  const [button, setButton] = useState("");
  const [tests, setTest] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
      
  useEffect(() => {
    viewClassTests().then(response => {
      if (!response.tests) {
        alert('No available tests');
        navigate(`/home`);
      }
      setTest(response.tests);
      setIsLoading(false);
    });
    if (type === "available") {
      setTitle("Available Tests");
      setButton("Join");
    } else {
      setTitle("Practice Tests");
      setButton("Practice");
    }
    
  }, []);
  function goToTest(test) {
    console.log("going to test")
    navigate(`/test/${test.id}`, { state: { test } });

  }
  if (!isLoading) {
    console.log(tests)
  }
  return (
    <div className="available-quizzes">
      <div className="list-title">{title}</div>
        <div className="row">
          {tests.map(test => (
            <div className="col-md-4" key={test._id}>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">ID: {test.id}</h5>
                  <button className="btn btn-primary" onClick={() => goToTest(test)}>
                    {button}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
  
};
export const Test = () => {
  const location = useLocation();
  const testDetails = location.state?.test;
  const [start, setStart] = useState(false);
  const [questionNum, setCounter] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState([])
  const questions = testDetails?.questions;
  const [renderKey, setRenderKey] = useState(0);
  
  const handleUserAnswer = (answer) => {
    let newAnswers = [...studentAnswer];
    newAnswers[questionNum] = answer;
    setStudentAnswer(newAnswers);
  };

  return (
    <div className="quiz">
      {testDetails?.id && (
        <>
          {start ? (
            <>
              <div className="quiz-content shadow" id="quiz-content" key={questionNum}>
                {renderQuestion(questions[questionNum].type, questions[questionNum], renderKey, handleUserAnswer)}
              </div>
              <TestFooter
                questionNum={questionNum}
                questionsData={questions}
                testDetails={testDetails}
                setCounter={setCounter}
                studentAnswer={studentAnswer}
                testId={testDetails.id}
              />
            </>
          ) : (
            <div className="quiz-content shadow">
              <div className="card mt-5 shadow" style={{ maxWidth: '30rem' }}>
                <div className="card-body text-center">
                  <h5 className="card-title" style={{ fontSize: '2rem' }}>{testDetails.id}</h5>
                  <p className="card-text text-center" style={{ fontSize: '1.5rem' }}>Time-limit: {testDetails.duration} seconds</p>
                  <p className="card-text text-center" style={{ fontSize: '1.5rem' }}>Length: {questions.length} Questions</p>
                  <button type="button" className="btn btn-primary" style={{ fontSize: '1.5rem' }} onClick={() => setStart(true)}>
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
