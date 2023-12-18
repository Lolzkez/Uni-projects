import React, { useState } from 'react';
import './style.css';
import Sketch from 'react-p5';

export function Maze({qData, onUserAnswer}) {
  let canvas,instructions,endText,hamster;
  const canvasWidth = window.innerWidth * 0.8; 
  const canvasHeight = window.innerHeight * 0.6;
  let chosen = false;
  const squareSize = 10;
  let questionData = qData.mazeData;
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  if (!questionData || !qData) { return null; }
  while (questionData.maze.length * squareSize > 0.9 * canvasHeight) {
    questionData = qData;
  }
  instructions = "Consider the following maze. Suppose the fish moved "
  for (let i = 0; i < questionData.instructions.length - 1; i++) {
    instructions += questionData.instructions[i] + ', ';
  }
  instructions +='then ' + questionData.instructions[questionData.instructions.length - 1] + '. Where would the fish land?';    

  const numWidth = questionData.maze[0].length;
  const numHeight = questionData.maze.length;
  const gridWidth = numWidth*squareSize;
  const gridHeight = numHeight*squareSize;
  const gridOriginX = gridWidth/-2;
  const gridOriginY = canvasHeight*0.05;
  const scaleX = canvasWidth/ gridWidth;
  const scaleY = canvasHeight*0.8/ gridHeight;
  const scale = Math.min(scaleX, scaleY);

  function renderMainQuestion(p) {
    p.push(); 
    p.translate(0, -canvasHeight / 2);
    p.scale(scale); 
    p.fill(p.color("#cecece"));
    p.noStroke();
    p.rect(gridOriginX,
         gridOriginY,
         gridWidth,
         gridHeight);
    
    let mazeInfo = questionData.maze;
    for (let r = 0; r < numHeight; r++) {
      for (let c = 0; c < numWidth; c++) {
        if (mazeInfo[r][c] != ".") {
          if (mazeInfo[r][c] == "#") {
            p.fill(p.color("#ffffff"));
            p.noStroke();
          } else if (mazeInfo[r][c] == "*") { p.texture(hamster); }
          else {
            
            endText.background(p.color("#000000"));
            endText.fill(p.color("#ffffff"));
            endText.text(mazeInfo[r][c], endText.width / 2, endText.height / 2);
            p.texture(endText);
          }
  
          p.square(gridOriginX+c*squareSize, gridOriginY+r*squareSize, squareSize);
        }
      }
    }
  }
    
  function renderOptions(p) {
    let radio = p.createElement(
      'div',
      `<div class="radio-options">
        <input type="radio" name="options" id="A" value="A"><label for="A">A</label>
      </div>
      <div class="radio-options">
        <input type="radio" name="options" id="B" value="B"><label for="B">B</label>
      </div>
      <div class="radio-options">
        <input type="radio" name="options" id="C" value="C"><label for="C">C</label>
      </div>
      <div class="radio-options">
        <input type="radio" name="options" id="D" value="D"><label for="D">D</label>
      </div>
      <div class="radio-options">
        <input type="radio" name="options" id="E" value="E"><label for="E">E</label>
      </div>`
    );
  
    radio.addClass('radio-class shadow');
    radio.changed(checkAnswer);
    radio.parent('quiz-content')
  }
  
  function checkAnswer() {
    if (chosen) return;

    let selected;
    let options = document.getElementsByName('options');
    for (let i = 0; i < options.length; i++) {
      if (options[i].checked) {
        selected = options[i].value;
        break;
      }
    }
    document.getElementById(selected).nextSibling.style.borderColor = "#ffa3fd"; 
    setSelectedAnswer(selected);
    onUserAnswer(selected)
  }

  const setup = (p5, canvasParentRef) => {
    console.log(questionData);
    canvas = p5.createCanvas(canvasWidth, canvasHeight, p5.WEBGL).parent(canvasParentRef);
    const scaleFactor = 4;  
    endText = p5.createGraphics(squareSize * scaleFactor, squareSize * scaleFactor);  
    endText.textSize(squareSize * scaleFactor);
    endText.textAlign(p5.CENTER, p5.CENTER);
    renderOptions(p5);
  }

  const draw = (p5) => {
    if(!hamster) return;
    p5.background(p5.color("#ffffff"));
    renderMainQuestion(p5);
  }

  const preload = (p5) => {
    hamster = p5.loadImage("/img/hamster-maze/fish_" + questionData.startingOrientation + ".png");
    
  }

  return (
    <>
      <div className="question-text shadow">
        {instructions}
      </div>
      <Sketch preload={preload} setup={setup} draw={draw} />
    </>
  )
}