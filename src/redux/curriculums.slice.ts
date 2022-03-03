import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./_store";
import type {
  ICurriculumItemSimple,
  ICurriculumItemDetail,
} from "src/types/curriculum.type";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { CurriculumDiagramType } from "src/constants/curriculumDiagramType";

//#region STATE
interface ICurriculumState {
  curriculums: ICurriculumItemSimple[];
  curriculumDetail: ICurriculumItemDetail | null;
  diagramViewMode: CurriculumDiagramType;
}

const initialState: ICurriculumState = {
  curriculums: [],
  curriculumDetail: null,
  diagramViewMode: CurriculumDiagramType.NONE,
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
export const curriculumSlice = createSlice({
  name: "curriculums",
  initialState: initialState,
  reducers: {
    setCurriculums: (state, action: PayloadAction<ICurriculumItemSimple[]>) => {
      state.curriculums = action.payload;
    },
    setCurriculumDetail: (
      state,
      action: PayloadAction<ICurriculumItemDetail>
    ) => {
      state.curriculumDetail = action.payload;
    },
    setDiagramViewMode: (
      state,
      action: PayloadAction<CurriculumDiagramType>
    ) => {
      state.diagramViewMode = action.payload;
    },
    resetState: (state) => {
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

export const { setDiagramViewMode, resetState } = curriculumSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const diagramViewMode = (state: RootState) =>
  state.curriculums.diagramViewMode;

export default curriculumSlice.reducer;
