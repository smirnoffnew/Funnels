export const updateModel = model => dispatch => {
  dispatch({
    type: 'UPDATE_MODEL',
    payload: {
      model
    }
  })
}

export const undo = () => dispatch => {
  dispatch({
    type: 'undo'
  })
}

export const redo = () => dispatch => {
  dispatch({
    type: 'redo'
  })
}

