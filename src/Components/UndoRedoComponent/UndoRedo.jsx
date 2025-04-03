import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { undo, redo } from '../../redux/features/UndoRedo/undoRedoSlice'
import {setShapes}  from '../../redux/features/Shapes/shapesSlice'

const UndoRedo = () => {
  const dispatch = useDispatch();
  const { shapesArray, removedShapesArray } = useSelector((state) => state.undoRedo.present) || {};

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  useEffect(() => {
    if (shapesArray && removedShapesArray) {
      dispatch(setShapes({ shapesArray, removedShapesArray }));
    }
  }, [shapesArray, removedShapesArray, dispatch]);

  return (
    <div className="undo-redo-container">
      <button onClick={handleUndo} title="Undo" className="undo-button">
        <i className="fa-solid fa-undo"></i>
      </button>
      <button onClick={handleRedo} title="Redo" className="redo-button">
        <i className="fa-solid fa-redo"></i>
      </button>
    </div>
  );
};

export default UndoRedo;
