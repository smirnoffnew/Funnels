import React from 'react'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <div className='undo-wrapper'>
    <button
      className={canUndo ? 'btn btn-1' : 'btn btn-1 btn-disabled'}
      onClick={onUndo}
      disabled={!canUndo}
      style={{
        height: 35
      }}
    >
      Undo
    </button>
    <button
      className={canRedo ? 'btn btn-1' : 'btn btn-1 btn-disabled'}
      onClick={onRedo}
      disabled={!canRedo}
      style={{
        marginLeft: 5,
        height: 35
      }}
    >
      Redo
    </button>
  </div>
)

const mapStateToProps = state => {
  // console.log(state)
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