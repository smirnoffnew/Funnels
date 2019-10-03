export const hideConversionLink = boolean => dispatch => {
  dispatch({
    type: 'HIDE_CONVERSION_LINK',
    payload: {
      boolean
    }
  })
}

export const setConversionCompound = (
  advancedConversion
) => dispatch => {
  dispatch({
    type: 'SET_CONVERSION_COMPOUND',
    payload: {
      advancedConversion
    }
  })
}