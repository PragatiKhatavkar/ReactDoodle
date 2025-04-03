import { createSlice } from "@reduxjs/toolkit";
import {
  addShapeToHistory,
  removeShapeFromHistory,
} from "../UndoRedo/undoRedoSlice";

const initialState = {
  canvas: null,
  grid: false,
  shapesArray: [],
  removedShapesArray: [],
};

const shapesSlices = createSlice({
  name: "shapes",
  initialState,
  reducers: {
    setCanvas: (state, action) => {
      state.canvas = action.payload;
    },
    addShape: (state, action) => {
      state.shapesArray.push(action.payload);
      // Dispatch the addShapeToHistory to track it for undo
      addShapeToHistory(action.payload);
    },
    removeShape: (state, action) => {
      // Remove shape from shapesArray and add it to removedShapesArray
      const shapeToRemove = state.shapesArray.find(
        (shape) => shape.id === action.payload
      );
      if (shapeToRemove) {        
        state.shapesArray = state.shapesArray.filter(
          (shape) => shape.id !== action.payload
        );
        state.removedShapesArray.push(shapeToRemove);

        // Dispatch the removeShapeFromHistory to track it for undo
        removeShapeFromHistory(shapeToRemove);
      }
    },
    setShapes: (state, action) => {
      state.shapesArray = action.payload.shapesArray;
      state.removedShapesArray = action.payload.removedShapesArray;
    },
    updateShapeColor: (state, action) => {
      const { id, shapeType, color } = action.payload;
      const shape = state.shapesArray.find((shape) => shape.id === id);

      if (shape) {
        if (shape.type) {
          shape.color = color;
        } else {
          shape[shapeType].color = color;
        }
      }
    },
    gridStatus: (state, action) => {
      state.grid = action.payload;
    },
  },
});

export const {
  setCanvas,
  addShape,
  removeShape,
  updateShapeColor,
  setShapes,
  gridStatus,
} = shapesSlices.actions;
export const selectCanvas = (state) => state.shapes.canvas;
export const selectShapes = (state) => state.shapes.shapesArray;
export const removedShapees = (state) => state.shapes.removedShapesArray;
export const selectGrid = (state) => state.shapes.grid;
export default shapesSlices.reducer;