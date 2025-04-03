import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCanvas } from "../redux/features/Shapes/shapesSlice";
import { selectBackgroundColor } from "../redux/features/Hamburger/hamburgerSlice";
import { drawGrid } from "../utils/gridUtils";
import { redrawShapes } from "../utils/canvasUtils";

const CanvasView = () => {
  const dispatch = useDispatch();
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const bgColor = useSelector(selectBackgroundColor);
  const shapes = useSelector((state) => state.shapes.items); 

  useEffect(() => {
    const canvas = document.getElementById("myCanvas");
    console.log(canvas);
    
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      dispatch(setCanvas(canvas.id));

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        drawGrid(ctx, canvasSize);
        redrawShapes(ctx, shapes); 
      };

      draw();

      const handleResize = () => {
        setCanvasSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        draw();
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [bgColor, dispatch, shapes, canvasSize]);

  return (
    <div
      id="canvasContainers"
      style={{ position: "relative", width: "100vw", height: "100vh" }}
    >
      <canvas
        id="myCanvas"
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          position: "absolute",
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default CanvasView;