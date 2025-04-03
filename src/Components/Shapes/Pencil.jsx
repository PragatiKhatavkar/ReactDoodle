import React, { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCanvas,
  addShape,
  selectShapes,
} from "../../redux/features/Shapes/shapesSlice";
import { v4 as uuidv4 } from "uuid";
import {
  selectColor,
  selectLineWidth,
  selectPencilLineStroke,
  selectBackgroundColor
} from "../../redux/features/Hamburger/hamburgerSlice";
import { redrawShapes } from "../../utils/canvasUtils";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../../utils/freehandUtils";
import { setPresent } from "../../redux/features/UndoRedo/undoRedoSlice";
import { drawGrid } from "../../utils/gridUtils";

const ShapePath = memo(({ shape }) => {
  const outlinePoints = getStroke(shape.points, { size: shape.lineWidth });
  const pathData = getSvgPathFromStroke(outlinePoints);
  return <path key={shape.id} d={pathData} fill={shape.color} />;
});

const Pencil = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState([]);
  const shapesArray = useSelector(selectShapes);
  const undoRedoState = useSelector((state) => state.undoRedo.present) || {};
  const { shapesArray: undoRedoShapes = [], removedShapesArray = [] } =
    undoRedoState;
  const gridState = useSelector((state) => state.shapes.grid);
  const color = useSelector(selectColor);
  const lineWidth = useSelector(selectLineWidth);
  const lineStroke = useSelector(selectPencilLineStroke);
  const canvasId = useSelector(selectCanvas);
  const bgColor = useSelector(selectBackgroundColor);
  const dispatch = useDispatch();
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`Canvas with ID ${canvasId} not found.`);
      return;
    }
    const context = canvas.getContext("2d");
    setCtx(context);
  }, [canvasId]);


  const handlePointerDown = () => {
    setIsDrawing(true);
    setCurrentDrawing([]);
  };

  const handlePointerMove = (event) => {
    if (!isDrawing || !ctx) return;

    const clientX = event.clientX;
    const clientY = event.clientY;
    const point = [clientX, clientY];

    setCurrentDrawing((prevDrawing) => {
      const updatedDrawing = [...prevDrawing, point];

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      redrawShapes(ctx, shapesArray, bgColor, gridState);

      // Drawing the current path
      const outlinePoints = getStroke(updatedDrawing, {
        size: lineWidth,
        ...lineStroke,
      });
      const pathData = getSvgPathFromStroke(outlinePoints);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fill(new Path2D(pathData));

      return updatedDrawing;
    });
  };

  
  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentDrawing.length > 0) {
      const newShape = {
        id: uuidv4(),
        type: "Pencil",
        points: currentDrawing,
        color,
        lineWidth,
        lineStroke,
      };
      dispatch(addShape(newShape));
      const updatedShapesArray = [...undoRedoShapes, newShape];

      dispatch(
        setPresent({ shapesArray: updatedShapesArray, removedShapesArray })
      );

      setCurrentDrawing([]);
    }
  };

  const outlinePoints = getStroke(currentDrawing, {
    size: lineWidth,
    ...lineStroke,
  });
  const pathData = getSvgPathFromStroke(outlinePoints);

  return (
    <svg
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        touchAction: "none",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
      }}
    >
      {shapesArray.map((shape) =>
        shape.type === "Pencil" ? (
          <ShapePath key={shape.id} shape={shape} />
        ) : null
      )}

      {isDrawing && <path d={pathData} fill={color} />}
    </svg>
  );
};

export default Pencil;