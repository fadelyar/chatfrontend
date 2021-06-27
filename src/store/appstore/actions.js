import {
   USER_FAILED_REQUEST,
   USER_LOGOUT_REQUEST,
   USER_MADE_REQUEST,
   USER_SUCCESS_REQUEST,
} from "./actiontype";
import axios from "axios";

const madeRequest = function () {
   return {
      type: USER_MADE_REQUEST,
   };
};

const madeSuccessRequest = function (currentUser) {
   return {
      type: USER_SUCCESS_REQUEST,
      payload: currentUser,
   };
};

const madeFailedRequest = function (error) {
   return {
      type: USER_FAILED_REQUEST,
      payload: error,
   };
};

export const logOut = function (currentMember) {
   return {
      type: USER_LOGOUT_REQUEST,
      payload: currentMember,
   };
};

// login user to database
export const login = function (data, callback) {
   return (dispatch) => {
      dispatch(madeRequest());
      // axios.post('https://chat-rest-api-backend.herokuapp.com/userprofile/login/', data)
      axios
         .post(
            "https://live-chat-application-simple.herokuapp.com/user/login",
            // "http://localhost:5000/user/login",
            data
         )
         .then((response) => {
            dispatch(madeSuccessRequest(response.data));
            callback(null);
         })
         .catch((reason) => {
            dispatch(madeFailedRequest(reason.response.data.message));
            callback(reason.response.data.message);
         });
   };
};

// register user to database
export const register = function (data, callback) {
   return (dispatch) => {
      dispatch(madeRequest());
      // .post(
      //    "https://chat-rest-api-backend.herokuapp.com/userprofile/register/",
      //    data
      // )
      axios
         .post(
            "https://live-chat-application-simple.herokuapp.com/user/register",
            // "http://localhost:5000/user/register",
            data
         )
         .then((response) => {
            dispatch(madeSuccessRequest(response.data));
            callback(null);
         })
         .catch((reason) => {
            dispatch(madeFailedRequest(reason.response.data.message));
            callback(reason.response.data.message);
         });
   };
};
