import EatingSound from '../audio/eatingSound.mp3';
import GameOverSound from '../audio/gameOver.wav';
const BOX_SIZE = 25;
const DEFAULT_SNAKE_DIR = 'right';
const CURRENT_PLAYER = '1';
const BUDDY = '2';
const SNAKE_COLOR_PLY1 = [
  '#015D00',
  '#0BAB64',
  '#1B8B00',
  '#63A91F',
  '#166D3B',
]
const SNAKE_COLOR_BUDDY = [
  '#B82E1F',
  '#CEA177',
  '#F2C17D',
  '#F2C17D',
  '#A44200',
]
/* Fuction defined to set the default coordinates of the snake in canvas*/
const setDefaultSnakeCoordinates = (type) => {
  if (type === BUDDY) {
    return [
      {x: 7 * BOX_SIZE, y: 6 * BOX_SIZE, color: SNAKE_COLOR_BUDDY[0]},
      {x: 6 * BOX_SIZE, y: 6 * BOX_SIZE, color: SNAKE_COLOR_BUDDY[1]},
      {x: 5 * BOX_SIZE, y: 6 * BOX_SIZE, color: SNAKE_COLOR_BUDDY[2]},
      {x: 4 * BOX_SIZE, y: 6 * BOX_SIZE, color: SNAKE_COLOR_BUDDY[3]},
      {x: 3 * BOX_SIZE, y: 6 * BOX_SIZE, color: SNAKE_COLOR_BUDDY[4]}
    ];
  } else if (type === CURRENT_PLAYER) {
    return [
      {x: 7 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR_PLY1[0]},
      {x: 6 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR_PLY1[1]},
      {x: 5 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR_PLY1[2]},
      {x: 4 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR_PLY1[3]},
      {x: 3 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR_PLY1[4]}
    ];
  }
}

/* Fuction defined to get the direction data to set in the current state*/
const getDirectionData = (state, currentPlayer, buddy) => {
  let directionMove, directionType, head;
  let snakeCordinateArray = state[currentPlayer].defaultSnakeCoordinate;
  let snakeCordinateBuddyArray = state[buddy].defaultSnakeCoordinate;
  let snakeCanvas = state.snakeCanvasObj;
  if (state[currentPlayer].currentDirection == 'left' || state[currentPlayer].currentDirection == 'right') directionType = 'left';
  else if (state[currentPlayer].currentDirection == 'up' || state[currentPlayer].currentDirection == 'down') directionType = 'top';
  head = processSnakeAccordingToDirection(snakeCordinateArray, state, currentPlayer);
  //current player
  snakeCordinateArray.unshift(head);
  snakeCordinateArray.pop();
  snakeCordinateArray.forEach((snake) => {
    let index = snakeCordinateArray.indexOf(snake);
    snake.color = SNAKE_COLOR_PLY1[index];
  });
  //buddy
  snakeCordinateBuddyArray.unshift(head);
  snakeCordinateBuddyArray.pop();
  snakeCordinateBuddyArray.forEach((snake) => {
    let index = snakeCordinateBuddyArray.indexOf(snake);
    snake.color = SNAKE_COLOR_BUDDY[index];
  });
  return {
    directionType,
    directionMove,
    snakeCordinateArray
  };
}

/* Fuction defined to move the snake left, right, up & down */
const processSnakeAccordingToDirection = (snakeCordinateArray, state, currentPlayer) => {
  if (state[currentPlayer].currentDirection == 'left' && state[currentPlayer].currentDirection != 'right') return {x: snakeCordinateArray[0].x - BOX_SIZE, y:snakeCordinateArray[0].y};
  else if (state[currentPlayer].currentDirection == 'right' && state[currentPlayer].currentDirection != 'left') return {x: snakeCordinateArray[0].x + BOX_SIZE, y:snakeCordinateArray[0].y};
  else if (state[currentPlayer].currentDirection == 'up' && state[currentPlayer].currentDirection != 'down') return {x: snakeCordinateArray[0].x, y:snakeCordinateArray[0].y - BOX_SIZE};
  else if (state[currentPlayer].currentDirection == 'down' && state[currentPlayer].currentDirection != 'up') return {x: snakeCordinateArray[0].x, y:snakeCordinateArray[0].y + BOX_SIZE};
}

/* Fuction defined to play eating sound once snake eats food */
const playEatingSound = () => {
  let audio = new Audio(EatingSound);
  audio.play();
}

/* Fuction defined to play Game Over sound once snake touches the boundaries */
const playGameOverSound = () => {
  let audio = new Audio(GameOverSound);
  audio.play();
}

/* Fuction defined to get the random numbers to generate food on random coordinates  */
const generateRandom = () => {
  return Math.floor(Math.random() * 20 + 1)*BOX_SIZE;
}

const setGameOverMessage = (snakeCanvasObj) => {
  snakeCanvasObj.font = "50px normal";
  snakeCanvasObj.fillStyle = "#ffff";
  snakeCanvasObj.fillText('GAME OVER', 60, 200);
}

/* Fuction defined to end the game once it collides with itself or boundaries */
const checkIfGameOver = (snakeCordinateArray, snakeCanvas) => {
  snakeCordinateArray.forEach((snake) => {
    let index = snakeCordinateArray.indexOf(snake);
    if (index != 0 && snakeCordinateArray[0].x == snake.x && snakeCordinateArray[0].y == snake.y) {
      return true;
    }
  });

  if (snakeCordinateArray[0].x < 0
    || snakeCordinateArray[0].y > snakeCanvas.height - BOX_SIZE
    || snakeCordinateArray[0].y < 0
    || snakeCordinateArray[0].x > snakeCanvas.width  - BOX_SIZE
    ) {
    return true;
  }
  return false;
}

const clearCanvas = (snakeCanvasDimension) => {
  let snakeCanvasObject = document.getElementById("snk-canvas");
  let snakeCanvas = snakeCanvasObject.getContext("2d");
  snakeCanvas.clearRect(0, 0, snakeCanvasDimension.width, snakeCanvasDimension.height);
}

export { setDefaultSnakeCoordinates, getDirectionData, processSnakeAccordingToDirection, playEatingSound, playGameOverSound,
generateRandom, setGameOverMessage, checkIfGameOver, clearCanvas, BOX_SIZE, SNAKE_COLOR_PLY1, DEFAULT_SNAKE_DIR }
