export const isMouseOnShape = (shape, mouseX, mouseY) => {
  const tolerance = 5;

  if (shape.type === "Circle") {
    const { startX, startY, currentX, currentY } = shape.points;
    const radius = Math.hypot(currentX - startX, currentY - startY);
    const distToCenter = Math.hypot(startX - mouseX, startY - mouseY);

    if (Math.abs(distToCenter - radius) <= tolerance) {
      return [shape.id, shape.color, "Circle"];
    }
  } else if (shape.type === "Triangle") {
    const { startX, startY, currentX, currentY } = shape.points;
    const x3 = 2 * startX - currentX;
    const y3 = currentY;

    const point1 = { x: startX, y: startY };
    const point2 = { x: currentX, y: currentY };
    const point3 = { x: x3, y: y3 };
    const points = [point1, point2, point3];

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      if (isMouseOnLine(mouseX, mouseY, p1, p2, tolerance)) {
        return [shape.id, shape.color, "Triangle"];
      }
    }
  } else if (shape.type === "Rect") {
    const { startX, startY, currentX, currentY } = shape.points;
    const points = [
      { x: startX, y: startY },
      { x: startX + currentX, y: startY },
      { x: startX + currentX, y: startY + currentY },
      { x: startX, y: startY + currentY },
    ];

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      if (isMouseOnLine(mouseX, mouseY, p1, p2, tolerance)) {
        return [shape.id, shape.color, "Rect"];
      }
    }
  } else if (shape.type === "Line") {
    const { startX, startY, currentX, currentY } = shape.points;
    const point1 = { x: startX, y: startY };
    const point2 = { x: currentX, y: currentY };

    if (isMouseOnLine(mouseX, mouseY, point1, point2, tolerance)) {
      return [shape.id, shape.color, "Line"];
    }
  } else if (shape.type === "Pencil") {
    const { points } = shape;
    for (let i = 0; i < points.length - 1; i++) {
      const point1 = points[i];
      const point2 = points[i + 1];

      if (isMouseOnPen(mouseX, mouseY, point1, point2, tolerance)) {
        return [shape.id, shape.color, "Pencil"];
      }
    }
  }
  return null;
};

function isMouseOnPen(mouseX, mouseY, point1, point2, tolerance) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;

  const distance =
    Math.abs((y2 - y1) * mouseX - (x2 - x1) * mouseY + x2 * y1 - y2 * x1) /
    Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

  if (distance > tolerance) return false;

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  return (
    mouseX >= minX - tolerance &&
    mouseX <= maxX + tolerance &&
    mouseY >= minY - tolerance &&
    mouseY <= maxY + tolerance
  );
}

const isMouseOnLine = (mouseX, mouseY, point1, point2, tolerance) => {
  const a = point2.y - point1.y;
  const b = point1.x - point2.x;
  const c = point2.x * point1.y - point1.x * point2.y;
  const distance = Math.abs(a * mouseX + b * mouseY + c) / Math.hypot(a, b);

  const withinSegment =
    mouseX >= Math.min(point1.x, point2.x) - tolerance &&
    mouseX <= Math.max(point1.x, point2.x) + tolerance &&
    mouseY >= Math.min(point1.y, point2.y) - tolerance &&
    mouseY <= Math.max(point1.y, point2.y) + tolerance;

  return distance <= tolerance && withinSegment;
};
