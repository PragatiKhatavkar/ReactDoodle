import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import {
  selectColor,
  selectOpacity,
  setColor,
  setOpacity,
  setLineWidth,
  selectLineWidth,
  selectBackgroundColor,
  setBackgroundColor,
} from "../../redux/features/Hamburger/hamburgerSlice";
import colorPalette from "../../assets/images/color-palette.png";

const HamburgerMenu = () => {
  const [showPicker, setShowPicker] = useState(false);
  const dispatch = useDispatch();
  const color = useSelector(selectColor);
  const opacity = useSelector(selectOpacity);
  const lineWidth = useSelector(selectLineWidth);
  const backgroundColor = useSelector(selectBackgroundColor);

  function openMyColorPalette() {
    setShowPicker(!showPicker);
  }

  function handleColorChange(color) {
    const r = parseInt(color.hex.slice(1, 3), 16);
    const g = parseInt(color.hex.slice(3, 5), 16);
    const b = parseInt(color.hex.slice(5, 7), 16);
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    dispatch(setColor(rgbaColor));
  }

  function handleOpacityChange(e) {
    const newOpacity = e.target.value;
    const rgbaComponents = color.slice(5, -1).split(",");
    const [r, g, b] = rgbaComponents;

    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${newOpacity})`;

    // Dispatch the updated color and opacity to the Redux store
    dispatch(setOpacity(newOpacity));
    dispatch(setColor(rgbaColor));
  }

  return (
    <div className="properties-content">
      {/* Color Section */}
      <div className="property-section">
        <h3>Color</h3>
        <div className="colorSection">
          <div className={`color-picker-trigger ${showPicker ? 'selected' : ''}`}>
            <img
              src={colorPalette}
              alt="Custom Colors"
              onClick={openMyColorPalette}
              className="colorPalette"
            />
            <span>Select Color</span>
          </div>

          {showPicker && (
            <div className="colorPickerWrapper">
              <SketchPicker
                color={color}
                disableAlpha={true}
                onChange={handleColorChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Opacity Section */}
      <div className="property-section">
        <h3>Opacity</h3>
        <div className="opacitySection">
          <input
            type="range"
            name="opacity"
            id="opacity"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={handleOpacityChange}
          />
          <span>{opacity}</span>
        </div>
      </div>

      {/* Line Width Section */}
      <div className="property-section">
        <h3>Line Width</h3>
        <div className="lineWidthSection">
          <div className="line-width-options">
            <button 
              className={Number(lineWidth) === 1 ? "selected" : ""}
              onClick={() => { dispatch(setLineWidth(1)) }}
            >
              <div className="line-preview thin"></div>
              <span>Thin</span>
            </button>
            <button 
              className={Number(lineWidth) === 3 ? "selected" : ""}
              onClick={() => { dispatch(setLineWidth(3)) }}
            >
              <div className="line-preview medium"></div>
              <span>Medium</span>
            </button>
            <button 
              className={Number(lineWidth) === 10 ? "selected" : ""}
              onClick={() => { dispatch(setLineWidth(10)) }}
            >
              <div className="line-preview thick"></div>
              <span>Thick</span>
            </button>
          </div>
        </div>
      </div>

      {/* Background Color Section */}
      <div className="property-section">
        <h3>Background Color</h3>
        <div className="background-color-options">
          <button 
            className={`bg-option white ${backgroundColor === "rgb(255, 255, 255)" ? "selected" : ""}`} 
            onClick={() => { dispatch(setBackgroundColor("rgb(255, 255, 255)")) }}
          >
            <span>White</span>
          </button>
          <button 
            className={`bg-option light-red ${backgroundColor === "rgb(255, 201, 201)" ? "selected" : ""}`} 
            onClick={() => { dispatch(setBackgroundColor("rgb(255, 201, 201)")) }}
          >
            <span>Light Red</span>
          </button>
          <button 
            className={`bg-option yellow ${backgroundColor === "rgb(255, 236, 153)" ? "selected" : ""}`} 
            onClick={() => { dispatch(setBackgroundColor("rgb(255, 236, 153)")) }}
          >
            <span>Yellow</span>
          </button>
          <button 
            className={`bg-option blue ${backgroundColor === "rgb(165, 216, 255)" ? "selected" : ""}`} 
            onClick={() => { dispatch(setBackgroundColor("rgb(165, 216, 255)")) }}
          >
            <span>Blue</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
