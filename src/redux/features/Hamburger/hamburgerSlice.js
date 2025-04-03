import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    color: "rgba(0,0,0,1)",
    opacity: "1",
    backgroundColor: "#ffffff",
    lineWidth: "3.5",
    pencilLineStroke: 
    {
        smoothing: 0.5,
        thinning: 0.5,
        streamline: 0.5,
      }
}

const hamburgerSlice = createSlice({
    name: "hamburger",
    initialState,
    reducers: {
        setColor: (state, action) => {
            state.color = action.payload;
        },
        setOpacity: (state, action) => {
            state.opacity = action.payload;
        },
        setBackgroundColor: (state, action) => {
            state.backgroundColor = action.payload;
            console.log(state.backgroundColor, action.payload);
        },
        setLineWidth: (state, action) => {
            state.lineWidth = action.payload;
        }
    }
})

export const { setColor, setOpacity , setBackgroundColor , setLineWidth} = hamburgerSlice.actions;
export const selectColor = (state) => state.hamburger.color;
export const selectOpacity = (state) => state.hamburger.opacity;
export const selectBackgroundColor = (state) => state.hamburger.backgroundColor;
export const selectLineWidth = (state) => state.hamburger.lineWidth;
export const selectPencilLineStroke = (state) => state.hamburger.pencilLineStroke;
export default hamburgerSlice.reducer;



