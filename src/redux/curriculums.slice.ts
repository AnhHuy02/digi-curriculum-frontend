import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./_store";
import type {
  ICurriculumItemSimple,
  ICurriculumItemDetail,
  IRandomCurriculumDetailParam,
} from "src/types/curriculum.type";

import moment from "moment";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { Mode } from "src/constants/mode.const";
import { CurriculumDiagramType } from "src/constants/curriculum.const";
import { getRandomCurriculumItemDetail } from "src/helper/mockDataGenerator/curriculums.generator";

//#region STATE
interface ICurriculumState {
  curriculums: ICurriculumItemSimple[];
  curriculumDetail: ICurriculumItemDetail;
  diagramViewMode: CurriculumDiagramType;
  pageLoading: boolean;
}

const initialState: ICurriculumState = {
  curriculums: [],
  curriculumDetail: {
    id: "curriculum-new-id",
    mode: Mode.CREATE,
    semCountPerYear: 3,
    year: moment().year(),
    allYears: {},
    allYearsOrder: [],
  },
  diagramViewMode: CurriculumDiagramType.NONE,
  pageLoading: false,
};
//#endregion

//#region ASYNC_THUNK
export const loadRandomCurriculumDetail = createAsyncThunk(
  "curriculums/loadRandomCurriculumDetail",
  async (payload: IRandomCurriculumDetailParam, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(setPageLoading(true));
    try {
      const res = await getRandomCurriculumItemDetail(payload);
      return res;
      // return thunkAPI.fulfillWithValue(res);
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    } finally {
      dispatch(setPageLoading(false));
    }
  }
);

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
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    resetState: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadRandomCurriculumDetail.fulfilled, (state, action) => {
      const { allYears, allYearIdsOrder } = action.payload;
      state.curriculumDetail.allYears = allYears;
      state.curriculumDetail.allYearsOrder = allYearIdsOrder;
    });
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

export const {
  setDiagramViewMode,
  setCurriculumDetail,
  setPageLoading,
  resetState,
} = curriculumSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const diagramViewMode = (state: RootState) =>
  state.curriculums.diagramViewMode;

export default curriculumSlice.reducer;
