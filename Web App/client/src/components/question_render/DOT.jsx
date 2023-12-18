import React, { useState } from 'react';
import Sketch from 'react-p5';
import './style.css';

export function DOT({qData, onUserAnswer}) {
    let canvas,imageBoxes,imageOptions, inputBoxes;
    const canvasWidth = window.innerWidth * 0.8; 
    const canvasHeight = window.innerHeight * 0.6;
  
    const questionWidth = canvasWidth * 0.75;
    const questionHeight = canvasHeight * 0.15;
    const squareSize = 90;
    let questionData = JSON.parse(qData.correctAnswer);
    const qLength = questionData.length;
    const scale = (qLength === 3) ? 0.65 : 0.95;
    let x,y;
    if (qLength === 3) {
      x = canvasWidth*0.1;
      y = canvasHeight*0.1;
    } else {
      x = canvasWidth*0.1;
      y = canvasHeight*0.1;
    }

    const [gridValues, setGridValues] = useState(Array.from({ length: qLength }, () => Array(qLength).fill('')));
    const questionDesc = "Using the key, fill in the boxes according to the pattern";

    function renderMainQuestion(p) {
      if (imageOptions) {
        p.texture(imageOptions);
        p.rect(x, y, questionWidth*0.4, questionHeight);
      }

      p.fill(255);
      p.rect(x+(scale*x), y+questionHeight+squareSize/2, squareSize*qLength, squareSize*qLength);
      p.noStroke();
      for (let i = 0; i < qLength; i++) {
        for (let j = 0; j < qLength; j++) {
            p.texture(imageBoxes[questionData[i][j]-1]);
            p.rect(x+(scale*x) + j*squareSize, y + squareSize/2 + questionHeight + i*squareSize, squareSize, squareSize);
        }
      }
      p.stroke(0);
      }
  
    function generateInputGrid(qLength) {
      const grid = [];
      for (let i = 0; i < qLength; i++) {
        const row = [];
        for (let j = 0; j < qLength; j++) {
          row.push(
            <input 
              type="text" 
              className='input-box'
              value={gridValues[i][j]}
              onChange={e => handleInputChange(e.target.value, i, j)}
              key={`${i}-${j}`} 
            />
          );
        }
        grid.push(
          <div style={{ display: 'flex' }} key={i}>
            {row}
          </div>
        );
      }
      return grid;
    }
    function handleInputChange(value, row, col) {
      const newGridValues = [...gridValues];
      const intValue = parseInt(value, 10) || '';
      newGridValues[row][col] = intValue;
      setGridValues(newGridValues);
      console.log(JSON.stringify(newGridValues))
      onUserAnswer(JSON.stringify(newGridValues));
    }

    const preload = (p5) => {
      imageOptions = p5.loadImage('/img/dot/options.png');
      
      imageBoxes = [
        p5.loadImage('/img/dot/1.svg'),
        p5.loadImage('/img/dot/2.svg'),
        p5.loadImage('/img/dot/3.svg'),
        p5.loadImage('/img/dot/4.svg'),
        p5.loadImage('/img/dot/5.svg'),
        p5.loadImage('/img/dot/6.svg')];
        console.log(imageBoxes)
    }
  
    const setup = (p5, canvasParentRef) => {
      canvas = p5.createCanvas(canvasWidth, canvasHeight, p5.WEBGL).parent(canvasParentRef);
  
    };
  
    const draw = (p5) => {
      if(!imageBoxes || !imageOptions) return;
      p5.background(p5.color("#ffffff"));
      p5.translate(-canvasWidth / 2, -canvasHeight / 2);
      renderMainQuestion(p5);
      
    };

    return (
      <div className='dot-container'>
        <div className="question-text">
          {questionDesc}
        </div>
        <Sketch preload={preload} setup={setup} draw={draw} />
        <div className='input-boxes'>
          {generateInputGrid(qLength)}
        </div>
      </div>
    )
}
