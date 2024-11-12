import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
const AuthSlice = createSlice({
    name : "authentication",
    initialState : {
        isLoggedIn : false,
        token : "",
        user: {},
        tasks:[],
        taskSelect: "",
        subTasks: [],
    },
    reducers : {
        setisLoggedin : (state , action) => {
            state.isLoggedIn = action.payload;
        },
        setUser : (state,action) => {
            state.user = action.payload;
        },
        setToken : (state , action) => {
            state.token = action.payload;
        },
        setTasks : (state, action) => {
            state.tasks = action.payload;
        },
        setTaskSelect : (state, action) => {
            state.taskSelect = action.payload;
        },
        setSubTasks : (state, action) => {
            state.subTasks = action.payload;
        }
    },
})

export const fetchTasks = () => async (dispatch, getState) => {
  try {
    const userId = getState().authentication.user._id;
    const response = await axios.post(
      "http://localhost:4000/api/task/getAllTasks",
      { userId }
    );
    dispatch(setTasks(response.data.tasks));
  } catch (error) {
    console.error("Error fetching tasks", error);
  }
};

export const {
  setisLoggedin,
  setToken,
  setUser,
  setTasks,
  setSubTasks,
  setTaskSelect,
} = AuthSlice.actions;
export default AuthSlice.reducer;