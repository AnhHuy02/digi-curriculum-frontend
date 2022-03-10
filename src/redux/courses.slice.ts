import type { PayloadAction } from "@reduxjs/toolkit";
import type { IMajorSimple } from "src/types/department.type";
import type {
  IRandomCoursesParam,
  ICourseItemSimple,
  ICourseItemDetail,
} from "src/types/course.type";
// import type { IRandomRange } from "src/types/others.type";
// import type { RootState } from '../store';

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getRandomMajors,
  getRandomCourses,
} from "src/helper/mockDataGenerator/courses.generator";

//#region STATE
interface ICoursesState {
  // loading: boolean;
  // error: any;

  // Don't be confused with DEPARTMENT store which also has many majors
  // This is only used for add courses feature in Curriculum Dnd
  majors: Record<string, IMajorSimple>;
  majorIds: string[];
  courses: Record<string, ICourseItemSimple>;
  courseIds: string[];
  courseDetail: ICourseItemDetail | null;
  pageLoading: boolean;
}

const initialState: ICoursesState = {
  majors: {},
  majorIds: [],
  courses: {},
  courseIds: [],
  courseDetail: null,
  pageLoading: false,
};
//#endregion

//#region ASYNC_THUNK
export const loadAllRandomMajors = createAsyncThunk(
  "courses/loadAllRandomMajors",
  async (
    payload: {
      min: number;
      max: number;
    },
    thunkAPI
  ) => {
    const { dispatch } = thunkAPI;
    dispatch(setPageLoading(true));
    try {
      const res = await getRandomMajors(payload);
      return res;
      // WTF is this TypeScript?
      // return thunkAPI.fulfillWithValue(res);
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    } finally {
      dispatch(setPageLoading(false));
    }
  }
);

export const loadAllRandomCourses = createAsyncThunk(
  "courses/loadAllRandomCourses",
  async (payload: IRandomCoursesParam, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(setPageLoading(true));
    try {
      const res = await getRandomCourses(payload);
      return res;
      // return thunkAPI.fulfillWithValue(res);
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    } finally {
      dispatch(setPageLoading(false));
    }
  }
);
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
export const coursesSlice = createSlice({
  name: "curriculums",
  initialState: initialState,
  reducers: {
    setCourses: (
      state,
      action: PayloadAction<Record<string, ICourseItemSimple>>
    ) => {
      state.courses = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    resetState: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAllRandomMajors.fulfilled, (state, action) => {
      const { allMajors, allMajorIds } = action.payload;
      state.majorIds = allMajorIds;
      state.majors = allMajors;
    });
    builder.addCase(loadAllRandomCourses.fulfilled, (state, action) => {
      console.log("fullfiled")
      const { allCourses, allCourseIds } = action.payload;
      state.courses = allCourses;
      state.courseIds = allCourseIds;
    });
  },
});
//#endregion

export const { setPageLoading, setCourses, resetState } = coursesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default coursesSlice.reducer;
