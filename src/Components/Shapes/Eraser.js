import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCanvas,
  removeShape,
  selectShapes,
} from "../../redux/features/Shapes/shapesSlice";
import { redrawShapes } from "../../utils/canvasUtils";
import { isMouseOnShape } from "../../utils/eraseShapeUtils";
import { setPresent } from "../../redux/features/UndoRedo/undoRedoSlice";
import { updateShapeColor } from "../../redux/features/Shapes/shapesSlice";

const Eraser = () => {
  const canvasId = useSelector(selectCanvas);
  const shapes = useSelector(selectShapes);
  const [isErasing, setIsErasing] = useState(false);
  const [hitshape, setHitShape] = useState([]);
  // const [myShapes, setMyShapes] = useState({});
  const dispatch = useDispatch();
  const { shapesArray, removedShapesArray } =
    useSelector((state) => state.undoRedo.present) || {};

  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const startErasing = () => {
      setIsErasing(true);
    };

    const erase = (e) => {
      if (!isErasing) return;

      shapes.forEach((shape) => {
        const mouseHitShape = isMouseOnShape(shape, e.offsetX, e.offsetY);

        if (mouseHitShape && !hitshape.includes(mouseHitShape[0])) {
          // setMyShapes(mouseHitShape);
          
          const rgbaValues = mouseHitShape[1]
            .slice(
              mouseHitShape[1].indexOf("(") + 1,
              mouseHitShape[1].indexOf(")")
            )
            .split(",");

          const r = parseInt(rgbaValues[0].trim(), 10);
          const g = parseInt(rgbaValues[1].trim(), 10);
          const b = parseInt(rgbaValues[2].trim(), 10);
          const a = parseFloat(rgbaValues[3]) / 2;
          const newColor = `rgba(${r}, ${g}, ${b}, ${a})`;

          dispatch(
            updateShapeColor({
              id: shape.id,
              shapeType: mouseHitShape[2],
              color: newColor,
            })
          );

          // Add the shape to `hitshape` to prevent further updates
          setHitShape((prevShapes) => {
            const updatedShapes = new Set([...prevShapes, mouseHitShape[0]]);
            return Array.from(updatedShapes);
          }); 
        }
      });
    };

    const stopErasing = () => {
      setIsErasing(false);
      canvas.removeEventListener("mousemove", erase);

      // shapes to remove
      const shapesToRemove = shapes.filter(shape => hitshape.includes(shape.id));
      
      // Process each shape individually for undo/redo
      let currentShapesArray = [...shapes];
      let currentRemovedArray = [...removedShapesArray];
      
      shapesToRemove.forEach(shape => {
        currentShapesArray = currentShapesArray.filter(s => s.id !== shape.id);
        currentRemovedArray = [...currentRemovedArray, shape];
        console.log( [...currentRemovedArray]);
        
        
        dispatch(setPresent({
          shapesArray: [...currentShapesArray],
          removedShapesArray: [...currentRemovedArray]
        }));
        
        dispatch(removeShape(shape.id));
      });

      setHitShape([]);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      redrawShapes(ctx, shapes.filter((shape) => !hitshape.includes(shape.id)));
    };

    canvas.addEventListener("mousedown", startErasing);
    canvas.addEventListener("mousemove", erase);
    canvas.addEventListener("mouseup", stopErasing);

    return () => {
      canvas.removeEventListener("mouseup", stopErasing);
      canvas.removeEventListener("mousedown", startErasing);
      canvas.removeEventListener("mousemove", erase);
    };
  }, [canvasId, shapes, dispatch, hitshape, isErasing]);

  return null;
};

export default Eraser;