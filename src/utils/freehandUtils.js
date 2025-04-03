export const getSvgPathFromStroke = (points) => {
    if (!points.length) return '';
    const d = points
      .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
      .join(' ');
    return `${d} Z`;
  };