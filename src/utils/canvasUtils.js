import { getStroke } from 'perfect-freehand';
import { drawGrid } from './gridUtils';

export const redrawShapes = (ctx, shapesArray = [], bgColor, gridEnabled = false) => {
  if (!ctx) {
    console.error("Invalid context: ctx is null or undefined");
    return;
  }

  if (!Array.isArray(shapesArray)) {
    console.error("Invalid shapesArray: shapesArray is not an array");
    return;
  }

  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (gridEnabled) {
    drawGrid(ctx);
  }

  shapesArray.forEach((shape) => {
    const { color, lineWidth } = shape;
    if (shape.type === "Circle") {
      const { startX, startY, currentX, currentY } = shape.points;
      const radius = Math.hypot(currentX - startX, currentY - startY);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    else if (shape.type === "Triangle") {
      const { startX, startY, currentX, currentY } = shape.points;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
      ctx.lineTo(2 * startX - currentX, currentY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.closePath();
      ctx.stroke();
    } else if (shape.type === "Rect") {
      const { startX, startY, currentX, currentY } = shape.points;
      ctx.beginPath();
      ctx.rect(startX, startY, currentX, currentY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    } else if (shape.type === "Line") {
      const { startX, startY, currentX, currentY } = shape.points;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth
      ctx.stroke();
    } else if (shape.type === "Text") {
      const { value, top, left, font, color } = shape;
      ctx.font = font || "16px Arial";
      ctx.fillStyle = color || "#000000";
      ctx.fillText(value, left, top);
    }
    else if (shape.Eraser) {
      const { x, y, width, height } = shape.Eraser;
      ctx.clearRect(x, y, width, height);
      redrawShapes(ctx, shape.filter((s) => s.id !== shape.id));
    } 
    else if (shape.type === "Pencil") {
      const { points, color, lineWidth, lineStroke , pathData } = shape;
    
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth; 
      
      if (pathData) {
        ctx.fill(new Path2D(pathData));
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
      } else {
        const outlinePoints = getStroke(points, { ...lineStroke, size: lineWidth });
        outlinePoints.forEach(([x, y], i) => {
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.closePath();
        ctx.fill();
      }        
    }
    
  });
};