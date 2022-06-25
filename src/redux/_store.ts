import { combineReducers } from "redux";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import curriculums from "./curriculums.slice";
import courses from "./courses.slice";
import curriculumChangeHistory from "./curriculumChangeHistory.slice";

const rootReducer = combineReducers({
  courses,
  curriculums,
  curriculumChangeHistory,
});

const createStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
