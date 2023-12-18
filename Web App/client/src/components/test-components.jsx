import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Maze} from './question_render/Maze'; 
import {LineQ} from './question_render/lineQ';
import {DOT} from './question_render/DOT';
import {Corsi} from './question_render/Corsi';
import { useEffect, useState } from 'react';

const TestFooter = ({ questionNum, questionsData, setCounter, studentAnswer, testId, testDetails}) => {
  const nav = useNavigate();
  let start = false;
  const isFinish = (questionNum === questionsData.length - 1)
  function handleButton(isNext) {
    if (isNext) {
      if (isFinish) {
        start = true;
        nav(`/test/${testId}/results`, 
        {state: { 
            answers: studentAnswer, 
            testDetails: testDetails, 
            questions: questionsData
        }});
      } else {
        setCounter(questionNum+1)
      }
    } else {
      setCounter(questionNum-1)
    }
  }
  const handleTimeUp = () => {
    nav(`/test/${testId}/results`, 
      {state: { 
          answers: studentAnswer, 
          testDetails: testDetails, 
          questions: questionsData
      }}
    );
  };

  return (
      <div className="quiz-footer d-flex justify-content-between align-items-center">
        {questionNum > 0 ? (
          <button className='prev btn-footer' type="button" onClick={() => handleButton(false)}>
            Prev
          </button>
        ) : (
          <div style={{ width: '8%' }}></div> 
        )}
        <div className="container shadow d-flex justify-content-center align-items-center">
          <Timer testDetails={testDetails} start={start} onTimeUp={handleTimeUp}/>
        </div>
        <button className='next btn-footer' type="button" onClick={() => handleButton(true)}>
          {isFinish ? 'Finish' : 'Next'}
        </button>
      </div>
    );
    
  
  
};

const renderQuestion = (type, qData, renderKey, handleUserAnswer) => {
  switch (type) {
    case 'Hamster':
      return <Maze key={renderKey} qData={qData} onUserAnswer={handleUserAnswer} />;
    case 'Line':
      return <LineQ key={renderKey} qData={qData} onUserAnswer={handleUserAnswer} />;
    case 'Corsi':
      return <Corsi key={renderKey} qData={qData} onUserAnswer={handleUserAnswer} />;
    case 'DOT':
      return <DOT key={renderKey} qData={qData} onUserAnswer={handleUserAnswer} />;
    default:
      return null; 
  }
};

const Timer = ({ testDetails, start, onTimeUp }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    if (testDetails?.duration) {
      setRemainingTime(testDetails.duration); 
    }
  }, [testDetails]);

  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      if (onTimeUp) {
        onTimeUp();
      }
    }
    return () => {
      clearInterval(timer);
    };
  }, [start, remainingTime]);

  return (
    <div>
      {remainingTime > 2 ? (
        <div className='timer shadow'>Time Remaining: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60}</div>
      ) : (
        <div className='timer'>Times up!</div>
      )}
    </div>
  );
  
};

export {TestFooter,renderQuestion};
