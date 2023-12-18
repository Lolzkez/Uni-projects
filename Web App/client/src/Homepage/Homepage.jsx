import React from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";


export const Homepage = () => {

  const navigate = useNavigate();

  const tests = (type) => (e) => { 
    e.preventDefault();
    if (type === 'corsi') {navigate('/test/corsi')} else {
    navigate(`/tests/${type}`);}
  }

  return (
    <div className="homepage">
      <div className="quiz-buttons">
        <button className="available-quizzes" onClick={tests("available")}>
        Available Quizzes
        <div className="green-circle"></div>
        </button>

        <button className="past-quizzes" onClick={tests("corsi")}>
        Corsi Test
        <div className="green-triangle"></div>
        </button>

        <button className="practice-quizzes" onClick={tests("practice")}>
        Practice Quizzes
        <div className="green-square"></div>
        </button>
      </div>
    </div>
  );
};
