export const updateModel = (model, funnelId) => dispatch => {
  dispatch({
    type: 'UPDATE_MODEL',
    payload: {
      model,
      funnelId
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

