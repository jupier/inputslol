import { Direction, SnakePiece } from "./types";

export const getAllowedDirections = (direction: Direction): Direction[] => {
  if (direction === "up" || direction === "down") {
    return ["left", "right"];
  }
  return ["down", "up"];
};
export const getSnakeHead = (snake: SnakePiece[]) => {
  return snake[snake.length - 1];
};
export const getSnakeTail = (snake: SnakePiece[]) => {
  return snake.slice(0, snake.length - 2);
};
export const moveSnake = (
  snake: SnakePiece[],
  moves: {
    x: number;
    y: number;
    direction: Direction;
  }[],
  grow: boolean,
) => {
  // first update the direction of the snake accordingly to the events
  const newSnake = snake.map(
    ({ x: snakeX, y: snakeY, direction: snakeDirection }) => {
      for (const move of moves) {
        if (snakeX === move.x && snakeY === move.y) {
          return { x: snakeX, y: snakeY, direction: move.direction };
        }
      }
      return { x: snakeX, y: snakeY, direction: snakeDirection };
    },
  );

  const firstPieceOfSnake = newSnake[0];

  // then moves the snake in the new cases
  const newNewSnake = newSnake.map(({ x, y, direction }) => {
    if (direction === "left") {
      return { x: x - 1, y, direction };
    }
    if (direction === "up") {
      return { x, y: y - 1, direction };
    }
    if (direction === "down") {
      return { x, y: y + 1, direction };
    }
    return { x: x + 1, y, direction };
  });

  // then grow the snake
  if (grow) {
    newNewSnake.unshift(firstPieceOfSnake);
  }

  return newNewSnake;
};
