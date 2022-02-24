import { combineReducers } from "redux";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

// import searchForm from './SearchForm/slice';
// import transactionSearchQuery from './TransactionSearchQuery/slice';

const rootReducer = combineReducers({
  // searchForm,
  // transactionSearchQuery,
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
