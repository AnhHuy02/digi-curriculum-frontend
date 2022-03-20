import type { PayloadAction } from "@reduxjs/toolkit";
import type { DropResult, ResponderProvided } from "react-beautiful-dnd";
import type { RootState } from "./_store";
import type {
  ICurriculumItemSimple,
  ICurriculumItemDetail,
  IRandomCurriculumDetailParam,
} from "src/types/curriculum.type";

import moment from "moment";
import _pull from "lodash/pull";
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
    loading: false,
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
    setCurriculumDetailLoading: (state, action: PayloadAction<boolean>) => {
      state.curriculumDetail.loading = action.payload;
    },
    addCurriculumDetailYear: (state) => {
      const { semCountPerYear, allYearsOrder, allYears } =
        state.curriculumDetail;
      const newYearId = `year-${allYearsOrder.length + 1}`;

      allYearsOrder.push(newYearId);
      allYears[newYearId] = {
        id: newYearId,
        semesters: {},
        semestersOrder: [],
      };

      const newYear = allYears[newYearId];

      Array.from({ length: semCountPerYear }).forEach((_, index) => {
        const newSemId = `${newYearId}-sem-${index + 1}`;
        newYear.semestersOrder.push(newSemId);
        newYear.semesters[newSemId] = {
          id: newSemId,
          courseIds: [],
          creditCount: 0,
          creditLimit: 24,
        };
      });
    },
    moveCurriculumDetailYearsOrder: (
      state,
      action: PayloadAction<DropResult>
    ) => {
      const { allYearsOrder } = state.curriculumDetail;
      const { source, destination, draggableId } = action.payload;

      if (destination !== undefined) {
        allYearsOrder.splice(source.index, 1);
        allYearsOrder.splice(destination.index, 0, draggableId);
      }
    },
    moveCurriculumDetailCourse: (state, action: PayloadAction<DropResult>) => {
      const { allYears } = state.curriculumDetail;
      const { source, destination, draggableId } = action.payload;

      if (destination !== undefined) {
        const [startYearId, startSemId] = source.droppableId.split(" ");
        const [endYearId, endSemId] = destination.droppableId.split(" ");

        // Step 1.1: Pop out course from old semester when dragged out
        allYears[startYearId].semesters[startSemId].courseIds.splice(
          source.index,
          1
        );

        // Step 1.2: Insert the dragged course to new semester
        allYears[endYearId].semesters[endSemId].courseIds.splice(
          destination.index,
          0,
          draggableId
        );
      }
    },
    removeCurriculumDetailYear: (state, action: PayloadAction<string>) => {
      const { allYears, allYearsOrder } = state.curriculumDetail;
      const yearId = action.payload;

      delete allYears[yearId];
      _pull(allYearsOrder, yearId);
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
  setCurriculumDetailLoading,
  addCurriculumDetailYear,
  moveCurriculumDetailYearsOrder,
  moveCurriculumDetailCourse,
  removeCurriculumDetailYear,
  resetState,
} = curriculumSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const diagramViewMode = (state: RootState) =>
  state.curriculums.diagramViewMode;

export default curriculumSlice.reducer;
