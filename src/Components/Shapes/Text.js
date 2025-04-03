import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCanvas, addShape } from "../../redux/features/Shapes/shapesSlice";
import { selectColor } from "../../redux/features/Hamburger/hamburgerSlice";
import { v4 as uuidv4 } from "uuid";

const Text = ({ setTextActive }) => {
  const [textareaStyle, setTextareaStyle] = useState({
    top: 0,
    left: 0,
    display: "none",
    cursor: "context-menu",
    value: "",
  });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const canvasId = useSelector(selectCanvas);
  const color = useSelector(selectColor)
  const dispatch = useDispatch();

  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
      canvas.addEventListener("click", insertTextBox);
      return () => {
        canvas.removeEventListener("click", insertTextBox);
      };
    }
  }, [canvasId]);

  const insertTextBox = (e) => {
    setTextareaStyle({
      top: e.offsetY,
      left: e.offsetX,
      display: "block",
      cursor: "all-scroll",
    });
  };

  const handleBlur = (e) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
  
    // Text properties
    const textValue = e.target.value;
    const textShape = {
      id: uuidv4(),
      type: "Text",
      value: textValue,
      top: textareaStyle.top,
      left: textareaStyle.left,
      color,
    };
  
    dispatch(addShape(textShape));
  
    // Text on canvas
    ctx.font = textShape.font;
    ctx.fillStyle = textShape.color;
    ctx.fillText(textValue, textShape.left, textShape.top);
  
    // Hide textarea
    setTextareaStyle({ top: 0, left: 0, display: "none", cursor: "context-menu" });
    setTextActive(false);
  };
  

  const handleMouseDown = (e) => {
    if (e.target.tagName === "TEXTAREA") {
      setDragging(true);
      setOffset({
        x: e.clientX - textareaStyle.left,
        y: e.clientY - textareaStyle.top,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setTextareaStyle((prev) => ({
        ...prev,
        top: e.clientY - offset.y,
        left: e.clientX - offset.x,
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleFocus = () => {
    setTextareaStyle((prev) => ({
      ...prev,
      cursor: "auto",
    }));
  };

  const handleChange = (e) => {
    setTextareaStyle((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };

  return (
    <textarea
      className="text-area"
      style={{
        position: "absolute",
        top: `${textareaStyle.top}px`,
        left: `${textareaStyle.left}px`,
        display: `${textareaStyle.display}`,
        width: "200px",
        height: "100px",
        cursor: `${textareaStyle.cursor}`,
        zIndex: 10,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      value={textareaStyle.value || ""}
    />
  );
};

export default Text;
