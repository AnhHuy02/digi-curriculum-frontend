import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { Moment } from "moment";
// import type { RootState } from '../store';

// import {
//   getBuildingsByProject,
//   getBuildingsByAddress,
//   getBuildingsByPolygon,
// } from "src/api/reisq.API";

//#region STATE
interface ICurriculumItemSimple {
  id: string;
  year: number;
  programType?: string;
  major: string;
  subMajor?: string;
  englishLevel?: string;
  // semCountPerYear: number;
  // allYears: {
  //   [yearId: string]?: any;
  // };
  // allYearsOrder: number[];
}



interface ICourseItemDetail {
  id: string;
  year: number;

}

interface ICourseState {
  // loading: boolean;
  // error: any;
  // buildingColumns: string[];
  // buildings: (string | number)[][];
  courses: ICurriculumItemSimple[];
  courseDetail: ICourseItemDetail | null;
}

const initialState: ICourseState = {
  courses: [],
  courseDetail: null,
  // loading: false,
  // error: null,
  // buildingColumns: [],
  // buildings: [],
};
//#endregion

//#region ASYNC_THUNK
// export const requestGetBuildingsByProject = createAsyncThunk(
//   "transactionSearchQuery/requestGetBuildingsByProject",
//   async (
//     payload: {
//       searchValue: string;
//       advancedSearchMode?: boolean;
//       dateFrom?: Moment | string | null | undefined;
//       dateTo?: Moment | string | null | undefined;
//     },
//     thunkAPI
//   ) => {
//     const { searchValue, advancedSearchMode, dateFrom, dateTo } = payload;
//     const { dispatch } = thunkAPI;
//     dispatch(setLoading(true));
//     try {
//       if (advancedSearchMode) {
//         const res = await getBuildingsByProject({
//           searchValue,
//           dateFrom,
//           dateTo,
//         });
//         return thunkAPI.fulfillWithValue(res.data);
//       } else {
//         const res = await getBuildingsByProject({ searchValue });
//         return thunkAPI.fulfillWithValue(res.data);
//       }
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }
// );

//#endregion

//#region SLICE
export const transactionSearchQuerySlice = createSlice({
  name: "curriculums",
  initialState: initialState,
  reducers: {
    resetState: (state, action) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {

  },
});
//#endregion

// export const { setLoading, setBuildingColumns, setBuildings, resetState } =
//   transactionSearchQuerySlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default transactionSearchQuerySlice.reducer;
