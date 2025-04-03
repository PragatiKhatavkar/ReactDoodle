import { configureStore } from "@reduxjs/toolkit";

import canvasReducer from '../features/Shapes/shapesSlice'
import hamburgerReducer from "../features/Hamburger/hamburgerSlice";
import undoRedoReducer from "../features/UndoRedo/undoRedoSlice"

const store = configureStore({
  reducer: {
    shapes: canvasReducer,
    hamburger: hamburgerReducer,
    undoRedo: undoRedoReducer
  },
});

export default store;