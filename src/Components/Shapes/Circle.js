import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCanvas,
  selectShapes,
  addShape,
} from "../../redux/features/Shapes/shapesSlice";
import { v4 as uuidv4 } from "uuid";
import {
  selectColor,
  selectLineWidth,
  selectBackgroundColor
} from "../../redux/features/Hamburger/hamburgerSlice";
import { redrawShapes } from "../../utils/canvasUtils";
import { setPresent } from "../../redux/features/UndoRedo/undoRedoSlice";
import { drawGrid } from "../../utils/gridUtils";

const Circle = () => {
  const [drawData, setDrawData] = useState({
    startX: null,
    startY: null,
    currentX: null,
    currentY: null,
  });
  const gridState = useSelector((state) => state.shapes.grid);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasId = useSelector(selectCanvas);
  const shapesArray = useSelector(selectShapes);
  const undoRedoState = useSelector((state) => state.undoRedo.present) || {};
  const { shapesArray: undoRedoShapes = [], removedShapesArray = [] } =
    undoRedoState;
  const color = useSelector(selectColor);
  const lineWidth = useSelector(selectLineWidth);
  const bgColor = useSelector(selectBackgroundColor);
  const dispatch = useDispatch();

  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const handleMouseDown = (e) => {
      setDrawData({
        startX: e.offsetX,
        startY: e.offsetY,
        currentX: e.offsetX,
        currentY: e.offsetY,
      });
      setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      setDrawData((prevData) => ({
        ...prevData,
        currentX: e.offsetX,
        currentY: e.offsetY,
      }));

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (gridState) {
        drawGrid(ctx);
      }
      redrawShapes(ctx, shapesArray, bgColor, gridState);
      drawCircle(ctx);
      
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;

      setIsDrawing(false);

      if (
        drawData.startX !== null &&
        drawData.startY !== null &&
        drawData.currentX !== null &&
        drawData.currentY !== null
      ) {
        const newShape = {
          id: uuidv4(),
          type: "Circle",
          points: {
            startX: drawData.startX,
            startY: drawData.startY,
            currentX: drawData.currentX,
            currentY: drawData.currentY,
          },
          color,
          lineWidth,
        };

        // Dispatching new shape to the Redux store
        dispatch(addShape(newShape));

        // Update undoRedo slice
        const updatedShapesArray = [...undoRedoShapes, newShape];
        redrawShapes(ctx, shapesArray);

        dispatch(
          setPresent({ shapesArray: updatedShapesArray, removedShapesArray })
        );

        // Resetting the draw data
        setDrawData({
          startX: null,
          startY: null,
          currentX: null,
          currentY: null,
        });
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    canvasId,
    drawData,
    isDrawing,
    dispatch,
    shapesArray,
    undoRedoShapes,
    removedShapesArray,
    gridState,
    color,
    bgColor,
    lineWidth,
  ]);

  const drawCircle = (ctx) => {
    if (drawData.startX !== null && drawData.startY !== null) {
      const radius = Math.hypot(
        drawData.currentX - drawData.startX,
        drawData.currentY - drawData.startY
      );

      // Use the color directly from Redux store
      ctx.beginPath();
      ctx.arc(drawData.startX, drawData.startY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = color; // Color is already in rgba format
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  return null;
};

export default Circle;