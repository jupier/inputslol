import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Direction, SnakePiece, Snake, Food, Move } from "./utils/types";
import {
  getAllowedDirections,
  getSnakeHead,
  getSnakeTail,
  moveSnake,
} from "./utils/snake";
import { COLS, DEFAULT_SPEED, ROWS, SNAKE_SIZE } from "./utils/contants";
import { createGameArea } from "./utils/area";

const getFood = (snake: Snake) => {
  let food: Food | undefined = undefined;

  while (food === undefined) {
    // add food in game area
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    // check if food is not on the snake
    if (snake.find((s) => s.x !== x || s.y !== y)) {
      food = { x, y };
    }
  }

  return food;
};

const checkIfFoodIsEaten = (snake: Snake, food: Food) => {
  return snake.find((s) => s.x === food.x && s.y === food.y) !== undefined;
};

function App() {
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [grow, setGrow] = useState(false);
  // to know if the snake has hit a wall
  const [wut, setWut] = useState(false);
  // snake state
  const [snake, setSnake] = useState<SnakePiece[]>(
    Array.from({ length: SNAKE_SIZE }, (_, i) => ({
      x: i,
      y: 0,
      direction: "right",
    })),
  );
  // food
  const [food, setFood] = useState<Food>(getFood(snake));
  // contains the active moves of the snake
  const [moves, setMoves] = useState<Move[]>([]);
  // contains all the moves. even the moves than have been removed
  const [allMoves, setAllMoves] = useState<Move[]>([]);
  // contains the string that will be added to the text area
  const gameArea = useMemo(() => {
    if (!wut) {
      return createGameArea(snake, food);
    }
  }, [snake, food, wut]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let direction: Direction | undefined = undefined;
      switch (event.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
        case "Escape":
          setIsPaused((isPaused) => !isPaused);
          break;
        default:
          break;
      }
      const head = getSnakeHead(snake);
      const possibleDirections = getAllowedDirections(head.direction);
      if (direction && possibleDirections.includes(direction) && !wut) {
        const newMove = { x: head.x, y: head.y, direction };
        const newMoves = [...moves, newMove];
        setMoves(newMoves);
        setAllMoves([...allMoves, newMove]);
        setSnake(moveSnake(snake, newMoves, grow));
        setGrow(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [snake, moves, allMoves, wut, grow]);

  useEffect(() => {
    const head = getSnakeHead(snake);
    const tail = getSnakeTail(snake);

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      setWut(true);
    }

    if (tail.find((p) => p.x === head.x && p.y === head.y) !== undefined) {
      setWut(true);
    }
  }, [snake]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!wut && !isPaused) {
        setSnake(moveSnake(snake, moves, grow));
        setGrow(false);
        setMoves(
          moves.filter((move) => {
            return (
              snake.find((s) => {
                return s.x == move.x && s.y == move.y;
              }) !== undefined
            );
          }),
        );
      }
    }, speed);
    return () => {
      clearInterval(interval);
    };
  }, [wut, moves, snake, speed, grow, isPaused]);

  useEffect(() => {
    if (checkIfFoodIsEaten(snake, food)) {
      setScore((score) => score + 1);
      setSpeed((speed) => speed - 2);
      setGrow(true);
      setFood(getFood(snake));
    }
  }, [snake, food]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          margin: "20px",
        }}
      >
        <div>
          <textarea
            value={gameArea}
            rows={ROWS}
            cols={COLS}
            className="textarea"
            disabled
          />
        </div>
        <div>
          <h1>Snake</h1>
          <p>Use arrow keys to move</p>
          <p>Press escape to pause</p>
          <p>Your score: {score}</p>
        </div>
      </div>

      <div className="debug">
        {!wut && (
          <>
            Moves:
            <ul>
              {moves &&
                moves.map((move) => {
                  return (
                    <li key={`${move.x}-${move.y}`}>
                      Move: {move.x} {move.y} {move.direction}
                    </li>
                  );
                })}
            </ul>
            Snake:
            <ul>
              {snake &&
                snake.map((s) => {
                  return (
                    <li key={`${s.x}-${s.y}`}>
                      Snake: {s.x} {s.y}
                    </li>
                  );
                })}
            </ul>
          </>
        )}
        {wut && (
          <>
            <h1>Game over :/</h1>
            <ul>
              {allMoves &&
                allMoves.map((move) => {
                  return (
                    <li>
                      Move: {move.x} {move.y} {move.direction}
                    </li>
                  );
                })}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default App;
