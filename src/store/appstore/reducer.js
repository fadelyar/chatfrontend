import {
   USER_FAILED_REQUEST, USER_MADE_REQUEST,
   USER_SUCCESS_REQUEST,
   USER_LOGOUT_REQUEST
} from "./actiontype"

const initialState = {
   loaded: false,
   currentUser: null,
   error: '',
}

export const appStoreReducer = function (state = initialState, { type, payload }) {
   switch (type) {
      case USER_MADE_REQUEST:
         return { ...state, loaded: true, error: '' }
      case USER_SUCCESS_REQUEST:
         return { ...state, loaded: false, currentUser: payload }
      case USER_FAILED_REQUEST:
         return { ...state, loaded: false, error: payload }
      case USER_LOGOUT_REQUEST:
         return {...state, loaded: false, currentUser: payload}
      default:
         return state
   }
} 