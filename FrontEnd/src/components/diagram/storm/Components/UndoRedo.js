import React from 'react'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'
import UndoSVG from "../../../../assets/undo/undo.svg";
import RedoSVG from "../../../../assets/undo/redo.svg";

import UndoActiveSVG from "../../../../assets/undo/undoActive.svg";
import RedoActiveSVG from "../../../../assets/undo/redoActive.svg";

import ReactSVG from 'react-svg';

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <div className='undo-wrapper'>
    <button
      className={canUndo ? 'btn-undo' : 'btn-undo btn-undo-disabled'}
      onClick={onUndo}
      disabled={!canUndo}
      style={{
        height: 35
      }}
    >
      <ReactSVG
        src={canUndo ? UndoActiveSVG : UndoSVG}
      />
    </button>
    <button
      className={canRedo ? 'btn-undo' : 'btn-undo btn-undo-disabled'}
      onClick={onRedo}
      disabled={!canRedo}
      style={{
        marginLeft: 5,
        height: 35
      }}
    >
       <ReactSVG
        src={canRedo ? RedoActiveSVG : RedoSVG}
      />
    </button>
  </div>
)

const mapStateToProps = state => {
  return {
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0
  }
};

const mapDispatchToProps = dispatch => ({
  onUndo: () => dispatch(UndoActionCreators.undo()),
  onRedo: () => dispatch(UndoActionCreators.redo())
});

UndoRedo = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo)

export default UndoRedo