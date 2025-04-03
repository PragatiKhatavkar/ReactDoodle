import React from 'react';
import { setShapes } from '../../redux/features/Shapes/shapesSlice';
import { clearHistory } from '../../redux/features/UndoRedo/undoRedoSlice';
import { useDispatch } from 'react-redux';

const Clear = () => {
    const dispatch = useDispatch();

    function clearCanvas(){
        dispatch(setShapes({ shapesArray: [], removedShapesArray: [] }));
        dispatch(clearHistory())
    }
    
  return (
    <button onClick={clearCanvas}>
      Clear
    </button>
  )
}

export default Clear
