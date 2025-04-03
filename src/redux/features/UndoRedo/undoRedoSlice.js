import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  past: [],
  present: {
    shapesArray: [],
    removedShapesArray: [],
  },
  future: [],
};

const undoRedoSlice = createSlice({
  name: "undoRedo",
  initialState,
  reducers: {
    setPresent: (state, action) => {      
      state.past.push(state.present);
      state.present = action.payload;
      state.future = [];
    },
    undo: (state) => {
      if (state.past.length > 0) {
        const previousState = state.past.pop();
        state.future.push(state.present);
        state.present = previousState;
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const nextState = state.future.pop();
        state.past.push(state.present);
        state.present = nextState;
      }
    },
    addShapeToHistory: (state, action) => {
      // Track the add shape action in past for undo purposes
      state.past.push({
        type: "add",
        shape: action.payload,
      });
    },
    removeShapeFromHistory: (state, action) => {
      // Track the remove shape action in past for undo purposes
      const removedShape = action.payload;
      state.past.push({
        type: "remove",
        shape: removedShape,
      });
    },
    clearHistory: (state) => {
      state.past = [];
      state.present = { shapesArray: [], removedShapesArray: [] };
      state.future = [];
    },
  },
});

export const { setPresent, undo, redo, addShapeToHistory, removeShapeFromHistory, clearHistory } = undoRedoSlice.actions;
export default undoRedoSlice.reducer;