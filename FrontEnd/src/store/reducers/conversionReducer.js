const initialState = {
  hideConversionLinkBoolean: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'HIDE_CONVERSION_LINK':
      return { 
        ...state, 
        hideConversionLinkBoolean: action.payload.boolean
      };
    case 'SET_CONVERSION_COMPOUND':
      return {
        ...state,
        advancedConversion: action.payload.advancedConversion,
      }
    default: return state;
  }
}