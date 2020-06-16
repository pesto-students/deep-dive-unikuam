import EatingSound from '../audio/eatingSound.mp3';
import GameOverSound from '../audio/gameOver.wav';
const BOX_SIZE = 25;
const DEFAULT_SNAKE_DIR = 'right';
const SNAKE_COLOR = [
  '#A8A8A8',
  '#989898',
  '#808080',
  '#606060',
  '#383838',
]

/* Fuction defined to set the default coordinates of the snake in canvas*/
const setDefaultSnakeCoordinates = () => {
  return [
    {x: 7 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR[0]},
    {x: 6 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR[1]},
    {x: 5 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR[2]},
    {x: 4 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR[3]},
    {x: 3 * BOX_SIZE, y: 2 * BOX_SIZE, color: SNAKE_COLOR[4]}
  ];
}

/* Fuction defined to get the direction data to set in the current state*/
const getDirectionData = (state) => {
  let directionMove, directionType, head;
  let snakeCordinateArray = state.defaultSnakeCoordinate;
  let snakeCanvas = state.snakeCanvasObj;
  if (state.currentDirection == 'left' || state.currentDirection == 'right') directionType = 'left';
  else if (state.currentDirection == 'up' || state.currentDirection == 'down') directionType = 'top';
  head = processSnakeAccordingToDirection(snakeCordinateArray, state);
  snakeCordinateArray.unshift(head);
  snakeCordinateArray.pop();
  snakeCordinateArray.forEach((snake) => {
    let index = snakeCordinateArray.indexOf(snake);
    snake.color = SNAKE_COLOR[index];
  });
  return {
    directionType,
    directionMove,
    snakeCordinateArray
  };
}

/* Fuction defined to move the snake left, right, up & down */
const processSnakeAccordingToDirection = (snakeCordinateArray, state) => {
  if (state.currentDirection == 'left' && state.currentDirection != 'right') return {x: snakeCordinateArray[0].x - BOX_SIZE, y:snakeCordinateArray[0].y};
  else if (state.currentDirection == 'right' && state.currentDirection != 'left') return {x: snakeCordinateArray[0].x + BOX_SIZE, y:snakeCordinateArray[0].y};
  else if (state.currentDirection == 'up' && state.currentDirection != 'down') return {x: snakeCordinateArray[0].x, y:snakeCordinateArray[0].y - BOX_SIZE};
  else if (state.currentDirection == 'down' && state.currentDirection != 'up') return {x: snakeCordinateArray[0].x, y:snakeCordinateArray[0].y + BOX_SIZE};
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
generateRandom, setGameOverMessage, checkIfGameOver, clearCanvas, BOX_SIZE, SNAKE_COLOR, DEFAULT_SNAKE_DIR }
