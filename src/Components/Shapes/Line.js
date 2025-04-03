import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCanvas,
  selectShapes,
  addShape,
} from "../../redux/features/Shapes/shapesSlice";
import {
  selectColor,
  selectLineWidth,
  selectBackgroundColor
} from "../../redux/features/Hamburger/hamburgerSlice";
import { v4 as uuidv4 } from "uuid";
import { setPresent } from "../../redux/features/UndoRedo/undoRedoSlice";
import { redrawShapes } from "../../utils/canvasUtils";
import { drawGrid } from "../../utils/gridUtils";

const Pencil = () => {
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
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.offsetX,
        currentY: e.offsetY,
      });
      setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      setDrawData((prevData) => ({
        ...prevData,
        currentX: e.clientX,
        currentY: e.clientY,
      }));

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (gridState) {
        drawGrid(ctx);
      }

      redrawShapes(ctx, shapesArray, bgColor, gridState);
      drawLine(ctx);
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
          type: "Line",
          points: {
            startX: drawData.startX,
            startY: drawData.startY,
            currentX: drawData.currentX,
            currentY: drawData.currentY,
          },
          color,
          lineWidth,
        };

        // Dispatch the new shape to the Redux store
        dispatch(addShape(newShape));

        const updatedShapesArray = [...undoRedoShapes, newShape];

        dispatch(
          setPresent({ shapesArray: updatedShapesArray, removedShapesArray })
        );

        // Reset draw data
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
  }, [canvasId, drawData, isDrawing, dispatch, shapesArray]);

  function drawLine(ctx) {
    if (drawData.startX !== null && drawData.startY !== null) {
      ctx.beginPath();
      ctx.moveTo(drawData.startX, drawData.startY);
      ctx.lineTo(drawData.currentX, drawData.currentY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  return null;
};

export default Pencil;
