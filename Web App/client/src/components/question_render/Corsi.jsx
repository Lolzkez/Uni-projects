import React from 'react';
import './style.css';
import Sketch from 'react-p5';
import {postCorsi} from '../../services/Student-Service'
import {CorsiBlockTappingQuestionLogic} from './CorsiBlockTappingQuestionLogic'

export function Corsi() {
  let canvas,sequence,font;
  const canvasWidth = window.innerWidth * 0.8; 
  const canvasHeight = window.innerHeight * 0.7;
  let bottomColor = '#E384FF';
  let {gameOver,gameStarted, animationShowed,animationFinished}= false;
  let longestStreak = 0
  let imgLives,orderClicked = [];
  let game = new CorsiBlockTappingQuestionLogic(canvasWidth,canvasHeight);
  let squareColors = Array(9).fill('#ffffff'); 
  const outputData = [];

  let questionDesc = ["Remember the order in which the squares light up.","Afterwards, click the square in the order as they appear.",  "You have three lives to try achieve the longest Corsi streak."];
  
  const setGameStarted = () => {
    gameStarted = true;
    const element = document.getElementById("corsi-text");
    element.parentNode.removeChild(element);
  }
  function renderMainQuestion(p5) {
    let scoreElement = p5.select('#score');
    if (!scoreElement) {
      scoreElement = p5.createDiv();
      scoreElement.attribute('id', 'score');
      scoreElement.position(canvasWidth/2-40, 10); 
      scoreElement.class('score');
      scoreElement.parent('corsi');
    }

    scoreElement.html(`Score: ${longestStreak}`);
    if(!imgLives) {
      console.log('Images not loaded');
      return;
    }
    p5.textFont(font);
    if (gameOver ) {
      //postCorsi(`Longest Streak: ${longestStreak}`)
      let gameOverText = p5.createDiv();
      gameOverText.attribute('id', 'game-over');
      gameOverText.position(canvasWidth/2-40, canvasHeight/2); 
      gameOverText.class('game-over');
      gameOverText.parent('corsi');

      gameOverText.html(`Game Over <br></br>Your Score:${longestStreak}`);
      return;
    }
    
    p5.fill(bottomColor); 
    p5.rectMode(p5.CORNER);
    p5.push();
    p5.rect(0, 0, canvasWidth, canvasHeight);
    p5.noStroke();
    p5.push();
    p5.texture(imgLives[game.remaining_lives - 1]);
    p5.rect(canvasWidth-200, -50, 200,200);

    for (let i = 0; i < game.total_boxes; i++) {
      p5.fill(squareColors[i]);
      p5.stroke('#000000'); 
      p5.strokeWeight(2);
      p5.push();
      p5.rect(game.box_positions[i][0],
              game.box_positions[i][1],
              game.box_dimensions[0],
              game.box_dimensions[1]);
      p5.pop();
    }
      
    if (!animationShowed) {
      sequence = game.generate_sequence_indexes();
      for (let i = 0; i < sequence.length; i++) {
        setTimeout(function timer() {
          squareColors[sequence[i]] = '#000000';
        }, i*700+1000);

        setTimeout(function timer() {
          squareColors[sequence[i]] = '#ffffff';
          if (i == sequence.length - 1) animationFinished = true;
        }, i*700+1300);
      }
      
      animationShowed = true;
    }
  }
  const mousePressed = (p5) => {
    console.log("Mouse pressed: ", p5.mouseX, p5.mouseY);
    if (animationFinished) {
      for (let i = 0; i < game.total_boxes; i++) {
        if (p5.mouseX >= game.box_positions[i][0] && 
            p5.mouseX <= game.box_positions[i][0] + game.box_dimensions[0] && 
            p5.mouseY >= game.box_positions[i][1] && 
            p5.mouseY <= game.box_positions[i][1] + game.box_dimensions[1]) {
          squareColors[i] = '#00ffff';
          orderClicked.push(i);
          if (orderClicked.length == sequence.length) {
            checkAnswer();
          }
        }
      }
    }
  }

  function checkAnswer() {
    let correct = (orderClicked.toString() === sequence.toString());
    if (correct) {
      bottomColor = '#00ff00';
      outputData.push([sequence.length, 1]);
    } else {
      bottomColor = '#ff0000';
      outputData.push([sequence.length - 1, 0]);
      game.decrement_life();
    }

    if (game.remaining_lives == 0) {
      gameOver = true;
      return;
    }

    setTimeout(function timer() {
      if (correct) { game.advance_to_next_level(); longestStreak += 1;
      } else {game.reset_after_failed_level();}

      animationShowed = false;
      for (let i = 0; i < game.total_boxes; i++) squareColors[i] = '#ffffff';
      bottomColor = '#E384FF';
      orderClicked = [];
      animationFinished = false;
    }, 1000);
    
    return;
  }


  const setup = (p5, canvasParentRef) => {
    canvas = p5.createCanvas(canvasWidth, canvasHeight, p5.WEBGL).parent(canvasParentRef);
    for (let i = 0; i < 9; i++) squareColors[i] = '#ffffff';
  }
    
  const draw = (p5) => {
    if(!imgLives) return;
    p5.background(p5.color("#cecece"))
    p5.translate(-canvasWidth / 2, -canvasHeight / 2);
    if (gameStarted) {
      renderMainQuestion(p5);
    }   

  }
  const preload = (p5) => {
    imgLives = []
    font = p5.loadFont('/img/corsi/font.ttf');
    imgLives.push(p5.loadImage('/img/corsi/one.svg'));
    imgLives.push(p5.loadImage('/img/corsi/two.svg'));
    imgLives.push(p5.loadImage('/img/corsi/three.svg'));
  }

  return (
    <div className='quiz-content'>
      <div id='corsi' className='corsi'>
        <Sketch preload={preload} setup={setup} draw={draw} mousePressed={mousePressed} />
        <div className="corsi-text" id="corsi-text">
          <p className="lead corsi-lead">
            {questionDesc[0]}<br />
            {questionDesc[1]}<br />
            {questionDesc[2]}
          </p>
          <button id="startButton" onClick={setGameStarted} className="btn btn-corsi">START</button>
        </div>
      </div>
    </div>
  )

}