import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./app.css";
import CanvasView from "./Components/CanvasView";
import CanvasManager from "./Components/CanvasManager";
import Line from "./Components/Shapes/Line";
import Rect from "./Components/Shapes/Rect";
import Circle from "./Components/Shapes/Circle";
import Triangle from "./Components/Shapes/Triangle";
import Pencil from "./Components/Shapes/Pencil";
import Text from "./Components/Shapes/Text";
import Eraser from "./Components/Shapes/Eraser";
import HamburgerMenu from "./Components/Hamburger Menu/HamburgerMenu";
import UndoRedo from "./Components/UndoRedoComponent/UndoRedo";
import Download from "./Components/Download/download";
import { gridStatus } from "./redux/features/Shapes/shapesSlice";
import gridIcon from "./assets/images/grid-icon.png";
import logo from "./assets/images/canvas-logo.png"
import { drawGrid } from "./utils/gridUtils";
import Clear from "./Components/Clear/Clear";


const App = () => {
  const dispatch = useDispatch();
  const isGridVisible = useSelector((state) => state.shapes.grid);
  const [activeTool, setActiveTool] = useState(null);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(true);

  useEffect(() => {
    const gridCanvas = document.getElementById("gridCanvas");
    if (!gridCanvas) return;

    const gridCtx = gridCanvas.getContext("2d");

    if (isGridVisible) {
      drawGrid(gridCtx);
    } else {
      gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height); // Clear grid when inactive
    }
  }, [isGridVisible]);

  const handleToolClick = (tool) => {
    setActiveTool(tool);
  };

  const handleGridToggle = () => {
    dispatch(gridStatus(!isGridVisible));
  };

  const togglePropertiesPanel = () => {
    setPropertiesPanelOpen(!propertiesPanelOpen);
  };

  return (
    <>
      {/* React Doodle Logo */}
      <div className="app-logo">
        <div className="logo-tag">
          <img className="logo-image" src={logo}/>
          <h1>React Doodle</h1>
        </div>
      </div>
      
      {/* Hamburger Menu Icon - Independent */}
      <div className="hamburger-icon">
        <i 
          className="fa-solid fa-bars" 
          onClick={togglePropertiesPanel}
          title="Properties"
        ></i>
      </div>
      
      {/* Right Controls - Other Icons */}
      <div className="toolbar-icons-group">
        <Download />
        <div className="grid-toggle">
          <img
            src={gridIcon}
            alt="Grid"
            id="grid-icon"
            onClick={handleGridToggle}
          />
        </div>
        <div className="undo-redo-container">
          <UndoRedo />
        </div>
        <div className="">
          <Clear />
        </div>
      </div>
      
      {/* Left Sidebar - Tools */}
      <div className="left-sidebar">
        {/* Shapes Section */}
        <div className="sidebar-section">
          <h2>Shapes</h2>
          <div className="tool-group">
            <i
              className="fa-solid fa-window-minimize"
              onClick={() => handleToolClick("line")}
              title="Line"
            ></i>
            <i
              className="fa-regular fa-square-full"
              onClick={() => handleToolClick("rect")}
              title="Rectangle"
            ></i>
            <i
              className="fa-regular fa-circle"
              onClick={() => handleToolClick("circle")}
              title="Circle"
            ></i>
            <i
              className="fa-solid fa-caret-up"
              onClick={() => handleToolClick("triangle")}
              title="Triangle"
            ></i>
          </div>
        </div>
        
        {/* Drawing Tools Section */}
        <div className="sidebar-section">
          <h2>Tools</h2>
          <div className="tool-group">
            <i
              className="fa-solid fa-pen"
              onClick={() => handleToolClick("pencil")}
              title="Pencil"
            ></i>
            <i
              className="fa-solid fa-font"
              onClick={() => handleToolClick("text")}
              title="Text"
            ></i>
            <i
              className="fa-solid fa-eraser"
              onClick={() => handleToolClick("eraser")}
              title="Eraser"
            ></i>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - Properties */}
      <div className={`right-sidebar ${propertiesPanelOpen ? 'closed' : 'open'}`}>
        <div className="properties-panel">
          <h2>Properties</h2>
          <HamburgerMenu />
        </div>
      </div>
      <CanvasView />
      <CanvasManager />

      {activeTool === "line" && <Line />}
      {activeTool === "rect" && <Rect />}
      {activeTool === "circle" && <Circle />}
      {activeTool === "triangle" && <Triangle />}
      {activeTool === "pencil" && <Pencil />}
      {activeTool === "text" && (
        <Text setTextActive={() => setActiveTool(null)} />
      )}
      {activeTool === "eraser" && <Eraser />}
    </>
  );
};

export default App;