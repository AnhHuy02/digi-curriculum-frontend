import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./_store";
import type {
  ICurriculumItemSimple,
  ICurriculumItemDetail,
  IRandomCurriculumDetailParam,
  ICurriculumItemYear,
} from "src/types/Curriculum.type";

import moment from "moment";
import _pull from "lodash/pull";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { Mode } from "src/constants/mode.const";
import {
  CurriculumDiagramType,
  CurriculumDndType,
} from "src/constants/curriculum.const";
import {
  getRandomCurriculumItem,
  getRandomCurriculums,
} from "src/helper/mockDataGenerator/curriculums.generator";

//#region STATE
interface ICurriculumState {
  curriculums: ICurriculumItemSimple[];
  curriculumDetail: ICurriculumItemDetail;
  dndViewMode: CurriculumDndType;
  diagramViewMode: CurriculumDiagramType;
  pageLoading: boolean;
  modalAddCourse: {
    isOpen: boolean;
    yearId: string | null;
    yearIndex: number | null;
    semId: string | null;
    semIndex: number | null;
  };
  modalCourseDetail: {
    isOpen: boolean;
    courseId: string | null;
  };
  modalPreviewCurriculumDetail: {
    isOpen: boolean;
  };
  showCourseRelationship: boolean;
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
  dndViewMode: CurriculumDndType.DND_BY_COURSE_RELATIONSHIP,
  diagramViewMode: CurriculumDiagramType.NONE,
  pageLoading: false,
  modalAddCourse: {
    isOpen: false,
    yearId: null,
    yearIndex: null,
    semId: null,
    semIndex: null,
  },
  modalCourseDetail: {
    isOpen: false,
    courseId: null,
  },
  modalPreviewCurriculumDetail: {
    isOpen: false,
  },
  showCourseRelationship: false,
};
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
    setDragAndDropViewMode: (
      state,
      action: PayloadAction<CurriculumDndType>
    ) => {
      state.dndViewMode = action.payload;
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
    setModalAddCourse: (
      state,
      action: PayloadAction<{
        isOpen?: boolean;
        yearId?: string | null;
        yearIndex?: number | null;
        semId?: string | null;
        semIndex?: number | null;
      }>
    ) => {
      state.modalAddCourse = { ...state.modalAddCourse, ...action.payload };
    },
    setModalCourseDetail: (
      state,
      action: PayloadAction<{
        isOpen?: boolean;
        courseId?: string | null;
      }>
    ) => {
      state.modalCourseDetail = {
        ...state.modalCourseDetail,
        ...action.payload,
      };
    },
    setModalPreviewCurriculumDetail: (
      state,
      action: PayloadAction<{
        isOpen?: boolean;
      }>
    ) => {
      state.modalPreviewCurriculumDetail = {
        ...state.modalPreviewCurriculumDetail,
        ...action.payload,
      };
    },
    setShowCourseRelationship: (state, action: PayloadAction<boolean>) => {
      state.showCourseRelationship = action.payload;
    },
    addCurriculumDetailYear: (
      state,
      action: PayloadAction<
        | {
            yearDetail?: ICurriculumItemYear;
            yearIndex?: number | undefined;
          }
        | undefined
      >
    ) => {
      const { semCountPerYear, allYearsOrder, allYears } =
        state.curriculumDetail;

      if (action.payload && action.payload.yearDetail) {
        const { id, semesters, semestersOrder } = action.payload.yearDetail;
        const yearIndex = action.payload.yearIndex;
        const newYearId = id;

        if (yearIndex !== undefined) {
          allYearsOrder.splice(yearIndex, 0, newYearId);
        } else {
          allYearsOrder.push(newYearId);
        }

        allYears[newYearId] = {
          id: newYearId,
          semesters,
          semestersOrder,
        };

        return;
      } else {
        const yearIndex = action.payload?.yearIndex;
        const newYearId = `year-${allYearsOrder.length + 1}`;

        if (yearIndex !== undefined) {
          allYearsOrder.splice(yearIndex, 0, newYearId);
        } else {
          allYearsOrder.push(newYearId);
        }

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
        return;
      }
    },
    moveCurriculumDetailYearsOrder: (
      state,
      action: PayloadAction<{
        yearId: string;
        sourceTakeoutIndex: number;
        targetInsertIndex: number;
      }>
    ) => {
      const { allYearsOrder } = state.curriculumDetail;
      const { yearId, sourceTakeoutIndex, targetInsertIndex } = action.payload;

      allYearsOrder.splice(sourceTakeoutIndex, 1);
      allYearsOrder.splice(targetInsertIndex, 0, yearId);
    },
    moveCurriculumDetailCourse: (
      state,
      action: PayloadAction<{
        courseId: string;
        sourceYearId: string;
        sourceSemId: string;
        sourceTakeoutIndex: number;
        targetYearId: string;
        targetSemId: string;
        targetInsertIndex: number;
      }>
    ) => {
      const {
        courseId,
        sourceYearId,
        sourceSemId,
        sourceTakeoutIndex,
        targetYearId,
        targetSemId,
        targetInsertIndex,
      } = action.payload;

      const { allYears } = state.curriculumDetail;

      // Step 1.1: Pop out course from old semester when dragged out
      allYears[sourceYearId].semesters[sourceSemId].courseIds.splice(
        sourceTakeoutIndex,
        1
      );

      // Step 1.2: Insert the dragged course to new semester
      allYears[targetYearId].semesters[targetSemId].courseIds.splice(
        targetInsertIndex,
        0,
        courseId
      );
    },
    addCurriculumDetailCourse: (
      state,
      action: PayloadAction<{
        yearId: string;
        semId: string;
        courseId: string;
      }>
    ) => {
      const { yearId, semId, courseId } = action.payload;
      state.curriculumDetail.allYears[yearId].semesters[semId].courseIds.push(
        courseId
      );
    },
    addCurriculumDetailCourses: (
      state,
      action: PayloadAction<{
        yearId: string;
        semId: string;
        courseIds: string[];
      }>
    ) => {
      const { yearId, semId, courseIds } = action.payload;
      if (courseIds.length > 0) {
        state.curriculumDetail.allYears[yearId].semesters[semId].courseIds.push(
          ...courseIds
        );
      }
    },
    removeCurriculumDetailCourse: (
      state,
      action: PayloadAction<{ yearId: string; semId: string; courseId: string }>
    ) => {
      const { yearId, semId, courseId } = action.payload;
      const semester = state.curriculumDetail.allYears[yearId].semesters[semId];

      state.curriculumDetail.allYears[yearId].semesters[semId].courseIds =
        _pull(semester.courseIds, courseId);
    },
    removeCurriculumDetailCourses: (
      state,
      action: PayloadAction<{
        yearId: string;
        semId: string;
        courseIds: string[];
      }>
    ) => {
      const { yearId, semId, courseIds } = action.payload;
      const semester = state.curriculumDetail.allYears[yearId].semesters[semId];

      state.curriculumDetail.allYears[yearId].semesters[semId].courseIds =
        _pull(semester.courseIds, ...courseIds);
    },
    removeCurriculumDetailYear: (state, action: PayloadAction<string>) => {
      const { allYears, allYearsOrder } = state.curriculumDetail;
      const yearId = action.payload;

      delete allYears[yearId];
      state.curriculumDetail.allYearsOrder = _pull(allYearsOrder, yearId);
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

    builder.addCase(loadRandomCurriculums.fulfilled, (state, action) => {
      const curriculums = action.payload;
      state.curriculums = curriculums.map((curriculum, index) => ({
        id: `curriculum-${index}`,
        year: 2022,
        semCountPerYear: 3,
        allYears: curriculum.allYears,
        allYearsOrder: curriculum.allYearIdsOrder,
      }));
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

//#region ASYNC_THUNK
export const loadRandomCurriculums = createAsyncThunk(
  "curriculums/loadRandomCurriculums",
  async (
    payload: IRandomCurriculumDetailParam & {
      randomCurriculumCount: { min: number; max: number };
    },
    thunkAPI
  ) => {
    const { dispatch } = thunkAPI;
    dispatch(setPageLoading(true));

    try {
      const res = await getRandomCurriculums(payload);
      return res;
      // return thunkAPI.fulfillWithValue(res);
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    } finally {
      dispatch(setPageLoading(false));
    }
  }
);

export const loadRandomCurriculumDetail = createAsyncThunk(
  "curriculums/loadRandomCurriculumDetail",
  async (payload: IRandomCurriculumDetailParam, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(setPageLoading(true));
    try {
      const res = await getRandomCurriculumItem(payload);
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

export const {
  setCurriculums,
  setCurriculumDetail,
  setDragAndDropViewMode,
  setDiagramViewMode,
  setPageLoading,
  setCurriculumDetailLoading,
  setModalAddCourse,
  setModalCourseDetail,
  setModalPreviewCurriculumDetail,
  setShowCourseRelationship,
  addCurriculumDetailYear,
  addCurriculumDetailCourse,
  addCurriculumDetailCourses,
  moveCurriculumDetailYearsOrder,
  moveCurriculumDetailCourse,
  removeCurriculumDetailYear,
  removeCurriculumDetailCourse,
  removeCurriculumDetailCourses,
  resetState,
} = curriculumSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const diagramViewMode = (state: RootState) =>
  state.curriculums.diagramViewMode;

export default curriculumSlice.reducer;
