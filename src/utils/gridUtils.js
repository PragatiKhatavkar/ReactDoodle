export const drawGrid = (ctx) => {

    if (!ctx) {
      console.error("Invalid context: ctx is null or undefined");
      return;
    }
  
    const { width, height } = ctx.canvas;
    const gridSize = 70;
  
    ctx.beginPath();
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
  
    ctx.strokeStyle = "#e8e8e8";
    ctx.lineWidth = 1;
    ctx.setTransform(1, 0, 0, 1, -0.5, -0.5); 
    ctx.stroke();
  };