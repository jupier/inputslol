import { COLS, ROWS } from "./contants";
import { Food, Snake } from "./types";

export const createGameArea = (snake: Snake, food: Food): string => {
  // create an empty area
  const area = Array.from({ length: ROWS * COLS }, () => "□");

  // add the snake
  snake.forEach(({ x, y, direction }, index) => {
    if (index === snake.length - 1) {
      if (direction === "right") {
        area[x + y * COLS] = "▶";
      }
      if (direction === "left") {
        area[x + y * COLS] = "◀";
      }
      if (direction === "up") {
        area[x + y * COLS] = "▲";
      }
      if (direction === "down") {
        area[x + y * COLS] = "▼";
      }
    } else {
      area[x + y * COLS] = "◼";
    }
  });

  // add the food
  area[food.x + food.y * COLS] = "▣";

  return area.join("");
};
