import type { Moment } from "moment";
import type { RootState } from "./_store";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { CurriculumDiagramType } from "src/constants/curriculumDiagramType";

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
  subMajor?: string | null;
  englishLevel?: string | null;
}

interface ICurriculumItemYear {
  id: string;
  semesters: {
    [semId: string]: ICurriculumItemSemester;
  };
  semestersOrder: string[];
}

interface ICurriculumItemSemester {
  id: string;
  courseIds: string[];
}

interface ICurriculumItemDetail extends ICurriculumItemSimple {
  semCountPerYear: number;
  years: {
    [yearId: string]: ICurriculumItemYear;
  };
  yearsOrder: number[];
}

// export type DiagramViewMode = "none" | "default" | "dot";

interface ICurriculumState {
  curriculums: ICurriculumItemSimple[];
  curriculumDetail: ICurriculumItemDetail | null;
  diagramViewMode: CurriculumDiagramType;
}

const initialState: ICurriculumState = {
  curriculums: [],
  curriculumDetail: null,
  diagramViewMode: CurriculumDiagramType.DOT,
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

// export const requestGetBuildingsByAddress = createAsyncThunk(
//   "transactionSearchQuery/requestGetBuildingsByAddress",
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
//         const res = await getBuildingsByAddress({
//           searchValue,
//           dateFrom,
//           dateTo,
//         });
//         return thunkAPI.fulfillWithValue(res.data);
//       } else {
//         const res = await getBuildingsByAddress({ searchValue });
//         return thunkAPI.fulfillWithValue(res.data);
//       }
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }
// );

// export const requestGetBuildingsByPolygon = createAsyncThunk(
//   "transactionSearchQuery/requestGetBuildingsByPolygon",
//   async (
//     payload: {
//       polygon: GeoJSON.FeatureCollection<any>;
//       advancedSearchMode?: boolean;
//       dateFrom?: Moment | string | null | undefined;
//       dateTo?: Moment | string | null | undefined;
//     },
//     thunkAPI
//   ) => {
//     const { polygon, advancedSearchMode, dateFrom, dateTo } = payload;
//     const { dispatch } = thunkAPI;
//     dispatch(setLoading(true));
//     try {
//       if (advancedSearchMode) {
//         const res = await getBuildingsByPolygon({
//           geojson: polygon,
//           dateFrom,
//           dateTo,
//         });
//         return thunkAPI.fulfillWithValue(res.data);
//       } else {
//         const res = await getBuildingsByPolygon({
//           geojson: polygon,
//         });
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
    // setLoading: (state, action) => {
    //   state.loading = action.payload;
    // },
    // setError: (state, action) => {
    //   state.error = action.payload;
    // },
    // setBuildingColumns: (state, action) => {
    //   state.buildingColumns = action.payload;
    // },
    // setBuildings: (state, action) => {
    //   state.buildings = action.payload;
    // },
    setDiagramViewMode: (state, action) => {
      state.diagramViewMode = action.payload;
    },
    resetState: (state, action) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(requestGetBuildingsByProject.fulfilled, (state, action) => {
    //   const { columns, data } = action.payload.results;
    //   state.buildingColumns = columns;
    //   state.buildings = data;
    // });
    // builder.addCase(requestGetBuildingsByProject.rejected, (state, action) => {
    //   console.log(action.payload);
    // });
    // builder.addCase(requestGetBuildingsByAddress.fulfilled, (state, action) => {
    //   const { columns, data } = action.payload.results;
    //   state.buildingColumns = columns;
    //   state.buildings = data;
    // });
    // builder.addCase(requestGetBuildingsByAddress.rejected, (state, action) => {
    //   console.log(action.payload);
    // });
    // builder.addCase(requestGetBuildingsByPolygon.fulfilled, (state, action) => {
    //   const { columns, data } = action.payload.results;
    //   state.buildingColumns = columns;
    //   state.buildings = data;
    // });
    // builder.addCase(requestGetBuildingsByPolygon.rejected, (state, action) => {
    //   console.log(action.payload);
    // });
  },
});
//#endregion

export const { setDiagramViewMode, resetState } =
  transactionSearchQuerySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const diagramViewMode = (state: RootState) =>
  state.curriculums.diagramViewMode;

export default transactionSearchQuerySlice.reducer;
