import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectCanvas,
  selectShapes,
} from "../redux/features/Shapes/shapesSlice";
import { selectBackgroundColor } from "../redux/features/Hamburger/hamburgerSlice";
import { redrawShapes } from "../utils/canvasUtils";
import { drawGrid } from "../utils/gridUtils";

const CanvasManager = ({ currentShape }) => {
  const canvasId = useSelector(selectCanvas);
  const shapesArray = useSelector(selectShapes);
  const bgColor = useSelector(selectBackgroundColor);
  const gridState = useSelector((state) => state.shapes.grid);

  useEffect(() => {
    const canvas = document.getElementById(canvasId);

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ctx) {
      if (gridState) {
        drawGrid(ctx);
      }
      redrawShapes(ctx, shapesArray, bgColor, gridState);
      if (currentShape) {
        redrawShapes(ctx, [currentShape], bgColor, gridState);
      }
    }
  }, [canvasId, shapesArray, currentShape, bgColor, gridState]);

  return null;
};

export default CanvasManager;
