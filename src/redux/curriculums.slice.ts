import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./_store";
import type { ArrayNormalizer } from "src/types/Normalizer.type";
import type {
  ICurriculum,
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
  curriculums: ArrayNormalizer<ICurriculum>;
  curriculumDetail: ICurriculumItemDetail;
  dndViewMode: CurriculumDndType;
  diagramViewMode: CurriculumDiagramType;
  pageLoading: boolean;
  mockDataMode: "SAMPLE" | "RANDOM";
  modalRandomCurriculums: {
    isOpen: boolean;
  };
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
  modalManageYears: {
    isOpen: boolean;
  };
  showCourseRelationship: boolean;
}

const initialState: ICurriculumState = {
  curriculums: {
    allIds: [],
    byId: {},
  },
  curriculumDetail: {
    id: "curriculum-new-id",
    mode: Mode.CREATE,
    loading: false,
    semCountPerYear: 3,
    year: moment().year(),
    years: {
      allIds: [],
      byId: {},
    },
  },
  dndViewMode: CurriculumDndType.DND_BY_COURSE_RELATIONSHIP,
  diagramViewMode: CurriculumDiagramType.NONE,
  pageLoading: false,
  mockDataMode: "SAMPLE",
  modalRandomCurriculums: {
    isOpen: false,
  },
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
  modalManageYears: {
    isOpen: false,
  },
  showCourseRelationship: false,
};
//#endregion

//#region SLICE
export const CurriculumSlice = createSlice({
  name: "curriculums",
  initialState: initialState,
  reducers: {
    setCurriculums: (
      state,
      action: PayloadAction<ArrayNormalizer<ICurriculum>>
    ) => {
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
    setMockDataMode: (state, action: PayloadAction<"SAMPLE" | "RANDOM">) => {
      state.mockDataMode = action.payload;
    },
    setCurriculumDetailLoading: (state, action: PayloadAction<boolean>) => {
      state.curriculumDetail.loading = action.payload;
    },
    setModalRandomCurriculums: (
      state,
      action: PayloadAction<{ isOpen?: boolean }>
    ) => {
      state.modalRandomCurriculums = {
        ...state.modalRandomCurriculums,
        ...action.payload,
      };
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
    setModalManageYears: (
      state,
      action: PayloadAction<{
        isOpen?: boolean;
      }>
    ) => {
      state.modalManageYears = {
        ...state.modalManageYears,
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
      const { semCountPerYear, years } = state.curriculumDetail;

      if (action.payload && action.payload.yearDetail) {
        const { id, semesters } = action.payload.yearDetail;
        const yearIndex = action.payload.yearIndex;
        const newYearId = id;

        if (yearIndex !== undefined) {
          (years.allIds as string[]).splice(yearIndex, 0, newYearId);
        } else {
          (years.allIds as string[]).push(newYearId);
        }

        years.byId[newYearId] = {
          id: newYearId,
          semesters,
        };

        return;
      } else {
        const yearIndex = action.payload?.yearIndex;
        const newYearId = `year-${years.allIds.length + 1}`;

        if (yearIndex !== undefined) {
          (years.allIds as string[]).splice(yearIndex, 0, newYearId);
        } else {
          (years.allIds as string[]).push(newYearId);
        }

        years.byId[newYearId] = {
          id: newYearId,
          semesters: {
            allIds: [],
            byId: {},
          },
        };

        const newYear = years.byId[newYearId];

        Array.from({ length: semCountPerYear }).forEach((_, index) => {
          const newSemId = `${newYearId}-sem-${index + 1}`;
          (newYear.semesters.allIds as string[]).push(newSemId);
          newYear.semesters.byId[newSemId] = {
            id: newSemId,
            courseIds: [],
            creditCount: 0,
            creditLimit: index < semCountPerYear - 1 ? 24 : 12,
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
      const { years } = state.curriculumDetail;
      const { yearId, sourceTakeoutIndex, targetInsertIndex } = action.payload;

      (years.allIds as string[]).splice(sourceTakeoutIndex, 1);
      (years.allIds as string[]).splice(targetInsertIndex, 0, yearId);
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

      const { years } = state.curriculumDetail;

      // Step 1.1: Pop out course from old semester when dragged out
      years.byId[sourceYearId].semesters.byId[sourceSemId].courseIds.splice(
        sourceTakeoutIndex,
        1
      );

      // Step 1.2: Insert the dragged course to new semester
      years.byId[targetYearId].semesters.byId[targetSemId].courseIds.splice(
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
      state.curriculumDetail.years.byId[yearId].semesters.byId[
        semId
      ].courseIds.push(courseId);
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
        state.curriculumDetail.years.byId[yearId].semesters.byId[
          semId
        ].courseIds.push(...courseIds);
      }
    },
    removeCurriculumDetailCourse: (
      state,
      action: PayloadAction<{ yearId: string; semId: string; courseId: string }>
    ) => {
      const { yearId, semId, courseId } = action.payload;
      const semester =
        state.curriculumDetail.years.byId[yearId].semesters.byId[semId];

      state.curriculumDetail.years.byId[yearId].semesters.byId[
        semId
      ].courseIds = _pull(semester.courseIds, courseId);
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
      const semester =
        state.curriculumDetail.years.byId[yearId].semesters.byId[semId];

      state.curriculumDetail.years.byId[yearId].semesters.byId[
        semId
      ].courseIds = _pull(semester.courseIds, ...courseIds);
    },
    removeCurriculumDetailYear: (state, action: PayloadAction<string>) => {
      const { years } = state.curriculumDetail;
      const yearId = action.payload;

      delete years.byId[yearId];
      state.curriculumDetail.years.allIds = _pull(
        years.allIds as string[],
        yearId
      );
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(loadRandomCurriculumDetail.fulfilled, (state, action) => {
      state.curriculumDetail = {
        ...action.payload,
        loading: false,
        mode: state.curriculumDetail.mode,
      };
    });

    builder.addCase(loadRandomCurriculums.fulfilled, (state, action) => {
      const curriculums = action.payload;
      state.curriculums = curriculums;
    });
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
  setMockDataMode,
  setCurriculumDetailLoading,

  setModalRandomCurriculums,
  setModalAddCourse,
  setModalCourseDetail,
  setModalPreviewCurriculumDetail,
  setModalManageYears,
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
} = CurriculumSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const diagramViewMode = (state: RootState) =>
  state.curriculums.diagramViewMode;

export default CurriculumSlice.reducer;
