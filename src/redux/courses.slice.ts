import type { PayloadAction } from "@reduxjs/toolkit";
import type { ArrayNormalizer } from "src/types/Normalizer.type";
import type { IMajor } from "src/types/Department.type";
import type {
  IRandomCoursesParam,
  ICourse,
  ICourseItemDetail,
} from "src/types/Course.type";
// import type { IRandomRange } from "src/types/others.type";
// import type { RootState } from '../store';

import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import _pick from "lodash/pick";
import _pull from "lodash/pull";

import {
  getRandomMajors,
  getRandomCourses,
} from "src/helper/mockDataGenerator/courses.generator";
import { CourseRelationship } from "src/constants/course.const";

//#region STATE
interface ICoursesState {
  // loading: boolean;
  // error: any;

  // Don't be confused with DEPARTMENT store which also has many majors
  // This is only used for add courses feature in Curriculum Dnd
  majors: ArrayNormalizer<IMajor>;
  courses: ArrayNormalizer<ICourse>;
  courseDetail: ICourseItemDetail | null;
  pageLoading: boolean;
  selectedCourseIdsPlaceholder: string[];
  modalAddCourseRelationship: {
    isOpen: boolean;
    courseSourceId: string | null;
    courseTargetId: string | null;
  };
  mode: {
    editCourseRelationship: {
      enabled: boolean;
      courseId: string | null;
    };
  };
}

const initialState: ICoursesState = {
  majors: {
    allIds: [],
    byId: {},
  },
  courses: {
    allIds: [],
    byId: {},
  },
  courseDetail: null,
  pageLoading: false,
  selectedCourseIdsPlaceholder: [],
  modalAddCourseRelationship: {
    isOpen: false,
    courseSourceId: null,
    courseTargetId: null,
  },
  mode: {
    editCourseRelationship: {
      enabled: false,
      courseId: null,
    },
  },
};
//#endregion

//#region SLICE
export const CoursesSlice = createSlice({
  name: "curriculums",
  initialState: initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<ArrayNormalizer<ICourse>>) => {
      state.courses = action.payload;
    },
    setMajors: (state, action: PayloadAction<ArrayNormalizer<IMajor>>) => {
      state.majors = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    setModalAddCourseRelationship: (
      state,
      action: PayloadAction<{
        isOpen?: boolean;
        courseSourceId?: string | null;
        courseTargetId?: string | null;
      }>
    ) => {
      state.modalAddCourseRelationship = {
        ...state.modalAddCourseRelationship,
        ...action.payload,
      };
    },
    setModeEditCourseRelationship: (
      state,
      action: PayloadAction<{ enabled?: boolean; courseId?: string | null }>
    ) => {
      const { enabled, courseId } = action.payload;
      const editCourseRelationship = state.mode.editCourseRelationship;
      state.mode.editCourseRelationship = {
        ...editCourseRelationship,
        ...(enabled !== undefined ? { enabled } : undefined),
        ...(courseId !== undefined ? { courseId } : undefined),
      };
    },
    addCourses: (state) => {
      const { selectedCourseIdsPlaceholder } = state;

      state.selectedCourseIdsPlaceholder = [];

      selectedCourseIdsPlaceholder.forEach((courseId) => {
        state.courses.byId[courseId].selected = true;
        state.courses.byId[courseId].selectedTemp = false;
      });
    },
    selectCourse: (state, action: PayloadAction<string>) => {
      const { selectedCourseIdsPlaceholder } = state;
      const courseId = action.payload;

      const courseIndex = selectedCourseIdsPlaceholder.findIndex(
        (element) => element === courseId
      );

      if (courseIndex === -1) {
        state.selectedCourseIdsPlaceholder.push(courseId);
        state.courses.byId[courseId].selectedTemp = true;
      } else {
        state.selectedCourseIdsPlaceholder.splice(courseIndex, 1);
        state.courses.byId[courseId].selectedTemp = false;
      }
    },
    removeSelectedCourse: (state, action: PayloadAction<string>) => {
      const courseId = action.payload;

      state.courses.byId[courseId].selected = false;
      state.courses.byId[courseId].selectedTemp = false;
    },
    selectCourses: (state, action: PayloadAction<string[]>) => {
      const courseIds = action.payload;

      state.selectedCourseIdsPlaceholder.push(...courseIds);

      courseIds.forEach((courseId) => {
        state.courses.byId[courseId].selectedTemp = true;
      });
    },
    removeSelectedCourses: (state, action: PayloadAction<string[]>) => {
      const { courses } = state;
      const courseIds = action.payload;
      const getFilteredCoursesById = _pick(courses.byId, courseIds);

      courseIds.forEach((courseId, courseIndex) => {
        getFilteredCoursesById[courseId].selected = false;
        getFilteredCoursesById[courseId].selectedTemp = false;
      });

      state.courses = {
        ...courses,
        ...getFilteredCoursesById,
      };
    },
    addCourseRelationship: (
      state,
      action: PayloadAction<{
        courseSourceId: string;
        courseTargetId: string;
        relationship: CourseRelationship;
      }>
    ) => {
      const { courseSourceId, courseTargetId, relationship } = action.payload;
      switch (relationship) {
        case CourseRelationship.PREREQUISITE: {
          state.courses.byId[courseTargetId].relationships.preRequisites.push(
            courseSourceId
          );
          break;
        }
        case CourseRelationship.COREQUISITE: {
          state.courses.byId[courseSourceId].relationships.coRequisites.push(
            courseTargetId
          );
          break;
        }
        case CourseRelationship.PREVIOUS: {
          state.courses.byId[courseTargetId].relationships.previous.push(
            courseSourceId
          );
          break;
        }
        case CourseRelationship.PLACEHOLDER: {
          state.courses.byId[courseSourceId].relationships.placeholders.push(
            courseTargetId
          );
          break;
        }
        default:
          break;
      }
    },
    removeCourseRelationship: (
      state,
      action: PayloadAction<{ courseSourceId: string; courseTargetId: string }>
    ) => {
      const { courses } = current(state);
      const { courseSourceId, courseTargetId } = action.payload;

      const sourceRelationship = courses.byId[courseSourceId].relationships;
      const targetRelationship = courses.byId[courseTargetId].relationships;

      // Delete an element from array by using filter
      let courseIndex = -1;

      courseIndex = sourceRelationship.preRequisites.findIndex(
        (courseId) => courseId === courseTargetId
      );
      if (courseIndex > -1) {
        state.courses.byId[courseSourceId].relationships.preRequisites.splice(
          courseIndex,
          1
        );
      }

      courseIndex = sourceRelationship.coRequisites.findIndex(
        (courseId) => courseId === courseTargetId
      );
      if (courseIndex > -1) {
        state.courses.byId[courseSourceId].relationships.coRequisites.splice(
          courseIndex,
          1
        );
      }

      courseIndex = sourceRelationship.previous.findIndex(
        (courseId) => courseId === courseTargetId
      );
      if (courseIndex > -1) {
        state.courses.byId[courseSourceId].relationships.previous.splice(
          courseIndex,
          1
        );
      }

      courseIndex = sourceRelationship.placeholders.findIndex(
        (courseId) => courseId === courseTargetId
      );
      if (courseIndex > -1) {
        state.courses.byId[courseSourceId].relationships.placeholders.splice(
          courseIndex,
          1
        );
      }

      courseIndex = targetRelationship.preRequisites.findIndex(
        (courseId) => courseId === courseSourceId
      );
      if (courseIndex > -1) {
        state.courses.byId[courseTargetId].relationships.preRequisites.splice(
          courseIndex,
          1
        );
      }

      courseIndex = targetRelationship.coRequisites.findIndex(
        (courseId) => courseId === courseSourceId
      );
      if (courseIndex > -1) {
        state.courses.byId[courseTargetId].relationships.coRequisites.splice(
          courseIndex,
          1
        );
      }

      courseIndex = targetRelationship.previous.findIndex(
        (courseId) => courseId === courseSourceId
      );
      if (courseIndex > -1) {
        state.courses.byId[courseTargetId].relationships.previous.splice(
          courseIndex,
          1
        );
      }

      courseIndex = targetRelationship.placeholders.findIndex(
        (courseId) => courseId === courseSourceId
      );
      if (courseIndex > -1) {
        state.courses.byId[courseTargetId].relationships.placeholders.splice(
          courseIndex,
          1
        );
      }

      // state.courses[courseSourceId].relationship.preRequisites =
      //   sourceRelationship.preRequisites.filter(
      //     (courseId) => courseId !== courseTargetId
      //   );

      // state.courses[courseSourceId].relationship.coRequisites =
      //   sourceRelationship.coRequisites.filter(
      //     (courseId) => courseId !== courseTargetId
      //   );

      // state.courses[courseSourceId].relationship.previous =
      //   sourceRelationship.previous.filter(
      //     (courseId) => courseId !== courseTargetId
      //   );

      // state.courses[courseSourceId].relationship.placeholders =
      //   sourceRelationship.placeholders.filter(
      //     (courseId) => courseId !== courseTargetId
      //   );

      // state.courses[courseTargetId].relationship.preRequisites =
      //   targetRelationship.preRequisites.filter(
      //     (courseId) => courseId !== courseSourceId
      //   );

      // state.courses[courseTargetId].relationship.coRequisites =
      //   targetRelationship.coRequisites.filter(
      //     (courseId) => courseId !== courseSourceId
      //   );

      // state.courses[courseTargetId].relationship.previous =
      //   targetRelationship.previous.filter(
      //     (courseId) => courseId !== courseSourceId
      //   );

      // state.courses[courseTargetId].relationship.placeholders =
      //   targetRelationship.placeholders.filter(
      //     (courseId) => courseId !== courseSourceId
      //   );
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(loadAllRandomMajors.fulfilled, (state, action) => {
      const majors = action.payload;
      const { allIds, byId } = majors;

      state.majors = {
        allIds,
        byId,
      };
    });
    builder.addCase(loadAllRandomCourses.fulfilled, (state, action) => {
      const courses = action.payload;
      const { allIds, byId } = courses;

      state.courses = {
        allIds,
        byId,
      };
    });
  },
});
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
//#endregion

export const {
  setPageLoading,
  setMajors,
  setCourses,

  setModalAddCourseRelationship,
  setModeEditCourseRelationship,

  addCourses,
  addCourseRelationship,
  selectCourse,
  selectCourses,

  removeSelectedCourse,
  removeSelectedCourses,

  removeCourseRelationship,

  resetState,
} = CoursesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default CoursesSlice.reducer;
