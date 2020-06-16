import React, { Component } from 'react';
import Header from './components/Header.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import AvailableClients from './components/AvailableClients.jsx';
import Playground from './components/Playground.jsx';
import FoodIcon from './img/apple.png';
import { setDefaultSnakeCoordinates, getDirectionData, processSnakeAccordingToDirection, playEatingSound, playGameOverSound,
generateRandom, setGameOverMessage, checkIfGameOver, clearCanvas, BOX_SIZE, DEFAULT_SNAKE_DIR } from './utility/lib';
import './Interface.css';
import './Snake.css';
import cuid from 'cuid';

let ws = new WebSocket('ws://localhost:3001');
const SPEED_FACTOR = 1;
const SNAKE_CANVAS = { width: BOX_SIZE * BOX_SIZE, height: BOX_SIZE * BOX_SIZE };
const SCORE_INCREASE_FACTOR = 10;
const CURRENT_PLAYER = '1';
const BUDDY = '2';

class App extends Component {
  constructor() {
    super();
    this.currentPlayer = null //current player
    this.buddy = null //buddy player
    this.gameConnectionId = null
    this.counterId = ''
    this.state = {
      [this.currentPlayer]: {
        currentDirection: '',
        score: 0,
        defaultSnakeCoordinate: [],
        isGameOver: false,
      },
      [this.buddy]: {
        currentDirection: '',
        score: 0,
        defaultSnakeCoordinate: [],
        isGameOver: false,
      },
      snakeCanvasObj: null,
      foodCoordinate: {x: generateRandom() - BOX_SIZE, y: generateRandom() - BOX_SIZE},
      alone: true,
      availableClients: [],
    }
  }

  /* Fuction defined to initialize the snake components after sucessfully mounting to actual DOM */
  componentDidMount = () => {
    ws.onmessage = message => {
      const response = JSON.parse(message.data);
      console.log(response);
      //when any client connects first time then this registers it as an active client in server
      if (response.method === 'connect') {
        this.currentPlayer = response.currentPlayer;
        this.setState({
          [this.currentPlayer] : {
            currentDirection: '',
            score: 0,
            defaultSnakeCoordinate: [],
            isGameOver: false,
          }
        }, () => {
          this.initSnakeGame();
        })
        console.log(`A new client connected ${response.currentPlayer}`);
      }

      //when clicks on play button then request is sent to server for checking if anyone is available or not for playing
      if (response.method === 'create') {
        if (response.available) {
          //set all available clients
          this.setState({ availableClients: response.availableClients})
        } else {
          alert(`No one to play around`);
        }
      }

      if (response.method === 'sendRequest') {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`${response.reqSentBy} wants to play with you. Do you want to play?`)) {
          this.buddy = response.reqSentBy;
          this.setState({
            [this.buddy] : {
              currentDirection: '',
              score: 0,
              defaultSnakeCoordinate: [],
              isGameOver: false,
            },
            alone: false
          }, () => {
            this.initSnakeGame();
            ws.send(JSON.stringify({ method: "requestResult", currentPlayer: this.currentPlayer, from: response.reqSentBy, accepted: true }));
          });
        } else {
          ws.send(JSON.stringify({ method: "requestResult", currentPlayer: this.currentPlayer, from: response.reqSentBy, accepted: false }))
        }
      }

      if (response.method === 'requestResult') {
        if (response.accepted) {
          this.buddy = response.buddy;
          this.gameConnectionId = response.gameId;
          this.setState({
            alone: false,
            availableClients: [],
            [this.buddy] : {
              currentDirection: '',
              score: 0,
              defaultSnakeCoordinate: [],
              isGameOver: false,
            }}, () => {
              this.initSnakeGame();
              alert(`${response.buddy} has accepted your request. Press play to begin.`);
          })
        } else {
          this.buddy = "";
          this.gameConnectionId = null;
          this.setState({ alone: true }, () => {
            alert(`${response.buddy} has declined your request.`);
          })
        }
      }

      if (response.method === 'setBuddyState') {
        console.log('setBuddyState', response);
        this.setState((prevState) => ({
          [response.buddy] : {
            ...prevState[response.buddy],
            defaultSnakeCoordinate: response.state.defaultSnakeCoordinate,
            score: response.state.score,
            currentDirection: response.state.currentDirection,
            isGameOver: response.state.isGameOver
          },
          foodCoordinate: response.foodCoordinate
        }))
      }
    }
    this.initSnakeGame();
  }

  /* Fuction defined to start the movement of snake once clicking on Play button */
  handlePlay = () => {
    const payLoad = {
      method: "create",
      currentPlayer: this.currentPlayer
    }
    ws.send(JSON.stringify(payLoad));
    // if no one is around to play then dont start the game
    if (this.state.alone) {
      return;
    }
    this.counterId = setInterval(this.moveTheSnake, 1000/SPEED_FACTOR);
  }

  /* Fuction defined to start the movement of snake once clicking on Play button */
  moveTheSnake = () => {
    this.setState((state) => {
      const directionData = getDirectionData(state, this.currentPlayer, this.buddy);
      return {
          [this.currentPlayer] : {
            ...state[this.currentPlayer],
            [directionData.directionType]: directionData.directionMove,
            defaultSnakeCoordinate: directionData.snakeCordinateArray
          }
      }
    }, () => {
      clearCanvas(SNAKE_CANVAS);
      this.createFood();
      this.drawFood();
      this.drawSnake(this.state.snakeCanvasObj);
      ws.send(JSON.stringify({ method: 'setStateForCurrentUser',
       currentState: this.state[this.currentPlayer],
       gameId: this.gameConnectionId,
       currentPlayer: this.currentPlayer,
       buddy: this.buddy,
       foodCoordinate: this.state.foodCoordinate
      }))
      if (checkIfGameOver(this.state[this.currentPlayer].defaultSnakeCoordinate, SNAKE_CANVAS)) {
        this.processGameEnd();
        ws.send(JSON.stringify({ method: 'setGameOverForCurrentUser',
         gameId: this.gameConnectionId,
         currentPlayer: this.currentPlayer,
         buddy: this.buddy
        }));
        return false;
      }
    });
  }

  /* Fuction defined to initialize the snake components */
  initSnakeGame = () => {
    let snakeCanvasObject = document.getElementById("snk-canvas");
    let snakeCanvas = snakeCanvasObject.getContext("2d"); // get canvas object
    this.setState(
      {
        [this.currentPlayer]: {
          defaultSnakeCoordinate: setDefaultSnakeCoordinates(CURRENT_PLAYER),
          currentDirection: DEFAULT_SNAKE_DIR,
          score: 0,
          isGameOver: false,
        },
        [this.buddy]: {
          defaultSnakeCoordinate: setDefaultSnakeCoordinates(BUDDY),
          currentDirection: DEFAULT_SNAKE_DIR,
          score: 0,
          isGameOver: false,
        },
        snakeCanvasObj: snakeCanvas
      }, () => {
        this.drawSnake(snakeCanvas);
      }
    );
  }

  /* Fuction defined to create the food if snake has eaten the previous one */
  createFood = () => {
    let snakeCordinateArray = this.state[this.currentPlayer].defaultSnakeCoordinate;
    console.log('createFood', snakeCordinateArray);
    let newLengthCoordinates;
    snakeCordinateArray.forEach((snakeCurrentCoordinate) => {
        if (snakeCurrentCoordinate.x == this.state.foodCoordinate.x && snakeCurrentCoordinate.y == this.state.foodCoordinate.y) {
          playEatingSound();
          newLengthCoordinates = processSnakeAccordingToDirection(snakeCordinateArray, this.state, this.currentPlayer);
          snakeCordinateArray.unshift(newLengthCoordinates);
          this.setState((preState) => {
            return {
              [this.currentPlayer] : {
                ...preState[this.currentPlayer],
                defaultSnakeCoordinate: snakeCordinateArray,
                score: preState.score + SCORE_INCREASE_FACTOR
              },
              [this.buddy] : {
                ...preState[this.buddy],
                defaultSnakeCoordinate: snakeCordinateArray,
                score: preState.score + SCORE_INCREASE_FACTOR
              },
              foodCoordinate: {x: generateRandom() - BOX_SIZE, y: generateRandom() - BOX_SIZE},
            }
          });
        }
    });
  }

  /* Fuction defined to draw the food on canvas */
  drawFood = () => {
    console.log(this.state);
    let snakeCanvasObj = this.state.snakeCanvasObj;
    snakeCanvasObj.fillStyle = 'white';
    let foodImageElement = document.getElementById('foodImage');
    snakeCanvasObj.drawImage(foodImageElement, this.state.foodCoordinate.x, this.state.foodCoordinate.y, BOX_SIZE, BOX_SIZE);
  }

  /* Fuction defined to draw the snake on canvas */
  drawSnake = (snakeCanvas) => {
    let snakeCordinateArray = this.state[this.currentPlayer].defaultSnakeCoordinate;
    snakeCordinateArray.forEach((snake) => {
      snakeCanvas.fillStyle = snake.color;
      snakeCanvas.strokestyle = 'black'
      snakeCanvas.fillRect(snake.x, snake.y, BOX_SIZE, BOX_SIZE);
      snakeCanvas.strokeRect(snake.x, snake.y, BOX_SIZE, BOX_SIZE);
    });
    let snakeCordinateBuddyArray = this.state[this.buddy].defaultSnakeCoordinate;
    snakeCordinateBuddyArray.forEach((snake) => {
      snakeCanvas.fillStyle = snake.color;
      snakeCanvas.strokestyle = 'black'
      snakeCanvas.fillRect(snake.x, snake.y, BOX_SIZE, BOX_SIZE);
      snakeCanvas.strokeRect(snake.x, snake.y, BOX_SIZE, BOX_SIZE);
    });
  }

  /* Fuction defined to detect the key press and set the direction in state */
  handleArrowKeys = (event) => {
    event.preventDefault();
    let key = 'which' in event ? event.which : event.keyCode;
    let snakeObjClone;
    let direction;
    switch (key) {
      case 37: //left
        direction = 'left';
        break;
      case 38: //up
        direction = 'up';
        break;
      case 39: //right
        direction = 'right';
        break;
      case 40: //down
        direction = 'down';
        break;
    }
    this.setState((prevState) => ({ [this.currentPlayer] : { ...prevState[this.currentPlayer], currentDirection: direction } }));
  }

  /* Fuction defined to stop the movement of snake once clicking on Pause button */
   handleStop = () => {
    if (this.counterId != '') {
      clearInterval(this.counterId);
    } else {
      alert('Game not started yet');
    }
  }

  /* Fuction defined to process the Game end */
  processGameEnd = () => {
    playGameOverSound();
    //stop the snake movement
    this.handleStop();
    //clear the canvas
    clearCanvas(SNAKE_CANVAS);
    //initialize the snake component to start again
    this.initSnakeGame();
    //set game over message
    setGameOverMessage(this.state.snakeCanvasObj);
  }

  handleRestart = () => {
    this.initSnakeGame();
  }

  handleJoinClick = (currentPlayer) => {
    ws.send(JSON.stringify({ method: "sendRequest", to: currentPlayer, from: this.currentPlayer }))
  }

  render() {
    return (
      <div className="main-container">
        <div className="container">
          <Header />
          <AvailableClients
            clients={this.state.availableClients}
            player={this.buddy}
            click={this.handleJoinClick}/>
          <ControlPanel
            snakeControl={this.state}
            onPlay={this.handlePlay}
            onPause={this.handleStop}
            onRestart={this.handleRestart}
            onKeyPress={(e) => this.handleArrowKeys(e)}
          />
          <img id="foodImage" width={BOX_SIZE} height={BOX_SIZE} src={FoodIcon} style={{display:'none'}} />
          <Playground snakeCanvas={SNAKE_CANVAS} />
        </div>
      </div>
    );
  }
}

export default App;
