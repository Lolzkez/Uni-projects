import React, {useState} from 'react';
import './style.css';
import Sketch from 'react-p5';

export function LineQ({qData, onUserAnswer}) {
  let canvas, numText, font;
  const canvasWidth = window.innerWidth *0.8; 
  const canvasHeight = window.innerHeight *0.6;
  const numSize = 15;
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questionData = qData.mazeData;
  const questionDesc = "The following shows a single line and 11 other lines below. Which numbered line does the top line match with?";

  function renderMainQuestion(p5) {
    let x = 0;
    let y = (canvasHeight/2)*0.75;
    let r = 150;
    p5.angleMode(p5.DEGREES);
    p5.textFont(font);
    let counter = 1;
    for (let i = 0; i <= 180; i += 18) {
      p5.line(x, y - r + 150, x + r * p5.cos(i + 180), (y - r + 150) + r * p5.sin(i + 180));
     
      let xText = x + (r + numSize) * p5.cos(i + 180);
      let yText = (y - (r + numSize) + 150) + r * p5.sin(i + 180);
  
      p5.fill(0);  
      p5.textAlign(p5.CENTER, p5.CENTER);  
      p5.textSize(numSize);  
      p5.text(counter, xText, yText); 

    counter++;
    }
    p5.stroke(0);
    p5.line(x, y - r - 125, x + r * p5.cos(questionData.angle + 180), (y - r - 125) + r * p5.sin(questionData.angle + 180));
  }

  const checkAnswer = (event) => {
    setSelectedAnswer(event.target.value);
    onUserAnswer(event.target.value);
  };
  
  const setup = (p5, canvasParentRef) => {
    canvas = p5.createCanvas(canvasWidth, canvasHeight, p5.WEBGL).parent(canvasParentRef);
    p5.textFont(font);
    p5.textSize(32);
    numText = p5.createGraphics(numSize, numSize);
    
    numText.background(p5.color("#ffffff00"));
    numText.fill(p5.color("#000000"));
  }
  const draw = (p5) => {
    if (!font) return;
    p5.background(p5.color("#ffffff"));
    renderMainQuestion(p5);
  }
  
  const preload = (p5) => {
    font = p5.loadFont('/img/lineq/font.ttf');
  };
  

  return (
    <>
      <div className="question-text">
        {questionDesc}
        </div>
      <Sketch preload={preload} setup={setup} draw={draw} />
      <select id="answers" onChange={checkAnswer} className="select shadow">
        {Array.from({ length: 11 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>{num}</option>
        ))}
      </select>
    </>
  )
}