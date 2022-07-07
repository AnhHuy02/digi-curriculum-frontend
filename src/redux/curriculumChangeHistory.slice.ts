import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./_store";
import type { ICourse } from "src/types/Course.type";
import type {
  CurriculumDetailHistoryAction,
  ICurriculumItemYear,
} from "src/types/Curriculum.type";
import type { ChangeHistory } from "src/types/ChangeHistory.type";
import type { ArrayNormalizer } from "src/types/Normalizer.type";

import _pull from "lodash/pull";
import moment from "moment";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { CurriculumCommandType } from "src/constants/curriculum.const";
import {
  addCourseRelationship,
  selectCourses,
  removeCourseRelationship,
  removeSelectedCourses,
  addCourses,
  removeSelectedCourse,
  selectCourse,
} from "./courses.slice";
import {
  addCurriculumDetailCourses,
  addCurriculumDetailYear,
  removeCurriculumDetailCourse,
  removeCurriculumDetailCourses,
  addCurriculumDetailCourse,
  moveCurriculumDetailCourse,
  moveCurriculumDetailYearsOrder,
  removeCurriculumDetailYear,
} from "./curriculums.slice";

const getCurrentDateTime = () => {
  return moment().toISOString();
};

//#region STATE

interface ICurriculumChangeTracker {
  coursesBefore: ArrayNormalizer<ICourse>;
  curriculumBefore: ArrayNormalizer<ICurriculumItemYear>;
  changeHistory: ChangeHistory<CurriculumDetailHistoryAction>;
}

const initialState: ICurriculumChangeTracker = {
  coursesBefore: {
    byId: {},
    allIds: [],
  },
  curriculumBefore: {
    byId: {},
    allIds: [],
  },
  changeHistory: {
    commandLogs: [],
    currentIndex: -1,
  },
};
//#endregion

//#region SLICE
export const CurriculumChangeHistorySlice = createSlice({
  name: "curriculumChangeHistory",
  initialState: initialState,
  reducers: {
    setCoursesBefore: (
      state,
      action: PayloadAction<ArrayNormalizer<ICourse>>
    ) => {
      state.coursesBefore = action.payload;
    },
    setCurriculumBefore: (
      state,
      action: PayloadAction<ArrayNormalizer<ICurriculumItemYear>>
    ) => {
      state.curriculumBefore = action.payload;
    },
    addChangeToHistory: (
      state,
      action: PayloadAction<CurriculumDetailHistoryAction>
    ) => {
      const { commandLogs, currentIndex } = state.changeHistory;

      // Step 1: Remove all redo changes based on current index
      state.changeHistory.commandLogs.splice(
        currentIndex + 1,
        commandLogs.length - currentIndex + 1
      );

      // Step 2: Add change to history
      state.changeHistory.commandLogs.push({
        ...action.payload,
        createdAt: getCurrentDateTime(),
      });
      state.changeHistory.currentIndex = commandLogs.length - 1;
    },
    undo: (state) => {
      --state.changeHistory.currentIndex;
    },
    redo: (state) => {
      ++state.changeHistory.currentIndex;
    },
    resetState: () => initialState,
  },
  extraReducers: {},
});
//#endregion

//#region ASYNC_THUNK
const executeCommand = createAsyncThunk(
  "curriculumChangeHistory/executeCommand",
  (payload: CurriculumDetailHistoryAction, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;

    switch (payload.type) {
      case CurriculumCommandType.ADD_COURSE_RELATIONSHIP: {
        dispatch(addCourseRelationship({ ...payload.patch }));
        break;
      }
      case CurriculumCommandType.REMOVE_COURSE_RELATIONSHIP: {
        const { courseSourceId, courseTargetId } = payload.patch;
        dispatch(removeCourseRelationship({ courseSourceId, courseTargetId }));
        break;
      }
      case CurriculumCommandType.CHANGE_COURSE_RELATIONSHIP: {
        const { courseSourceId, courseTargetId, newRelationship } =
          payload.patch;
        dispatch(removeCourseRelationship({ courseSourceId, courseTargetId }));
        dispatch(
          addCourseRelationship({
            courseSourceId,
            courseTargetId,
            relationship: newRelationship,
          })
        );
        break;
      }
      case CurriculumCommandType.ADD_COURSES_TO_SEMESTER: {
        const { courseIds } = payload.patch;

        dispatch(selectCourses(courseIds));
        dispatch(addCourses());
        dispatch(addCurriculumDetailCourses({ ...payload.patch }));
        break;
      }
      case CurriculumCommandType.REMOVE_COURSE_FROM_SEMESTER: {
        const { yearId, semId, courseId } = payload.patch;

        dispatch(removeCurriculumDetailCourse({ yearId, semId, courseId }));
        dispatch(removeSelectedCourse(courseId));
        break;
      }
      case CurriculumCommandType.CHANGE_COURSE_BETWEEN_TWO_SEMESTER: {
        dispatch(moveCurriculumDetailCourse({ ...payload.patch }));
        break;
      }
      case CurriculumCommandType.CHANGE_YEAR_ORDER: {
        dispatch(moveCurriculumDetailYearsOrder({ ...payload.patch }));
        break;
      }
      case CurriculumCommandType.ADD_YEAR: {
        dispatch(addCurriculumDetailYear());
        break;
      }
      case CurriculumCommandType.REMOVE_YEAR: {
        const { yearId, yearDetail } = payload.patch;

        const { semesters } = yearDetail;
        let courseIds: string[] = [];

        semesters.allIds.forEach((semId) => {
          courseIds.push(...semesters.byId[semId].courseIds);
        });

        dispatch(removeSelectedCourses(courseIds));
        dispatch(removeCurriculumDetailYear(yearId));
        break;
      }
      default: {
        break;
      }
    }
  }
);

export const commitChangeToHistory = createAsyncThunk(
  "curriculumChangeHistory/addChangeToHistory",
  (payload: CurriculumDetailHistoryAction, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const newCommand = payload;

    dispatch(executeCommand(newCommand));
    dispatch(addChangeToHistory(newCommand));
  }
);

export const undoChange = createAsyncThunk(
  "curriculumChangeHistory/undoChange",
  (_payload: undefined, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { currentIndex, commandLogs } = (getState() as RootState)
      .curriculumChangeHistory.changeHistory;

    if (currentIndex > -1) {
      const undoCommand = commandLogs[currentIndex];

      switch (undoCommand.type) {
        case CurriculumCommandType.ADD_COURSE_RELATIONSHIP: {
          const { courseSourceId, courseTargetId, relationship } =
            undoCommand.patch;

          dispatch(
            removeCourseRelationship({
              courseSourceId,
              courseTargetId,
            })
          );
          break;
        }
        case CurriculumCommandType.REMOVE_COURSE_RELATIONSHIP: {
          const { courseSourceId, courseTargetId, relationship } =
            undoCommand.patch;

          dispatch(
            addCourseRelationship({
              courseSourceId,
              courseTargetId,
              relationship,
            })
          );
          break;
        }
        case CurriculumCommandType.ADD_COURSES_TO_SEMESTER: {
          const { courseIds } = undoCommand.patch;

          dispatch(removeSelectedCourses(courseIds));
          dispatch(removeCurriculumDetailCourses({ ...undoCommand.patch }));
          break;
        }
        case CurriculumCommandType.REMOVE_COURSE_FROM_SEMESTER: {
          const { yearId, semId, courseId } = undoCommand.patch;

          dispatch(selectCourse(courseId));
          dispatch(addCurriculumDetailCourse({ yearId, semId, courseId }));
          dispatch(addCourses());
          break;
        }
        case CurriculumCommandType.CHANGE_COURSE_BETWEEN_TWO_SEMESTER: {
          const {
            courseId,
            sourceYearId,
            sourceSemId,
            sourceTakeoutIndex,
            targetYearId,
            targetSemId,
            targetInsertIndex,
          } = undoCommand.patch;

          dispatch(
            moveCurriculumDetailCourse({
              courseId,
              sourceYearId: targetYearId,
              sourceSemId: targetSemId,
              sourceTakeoutIndex: targetInsertIndex,
              targetYearId: sourceYearId,
              targetSemId: sourceSemId,
              targetInsertIndex: sourceTakeoutIndex,
            })
          );
          break;
        }
        case CurriculumCommandType.CHANGE_YEAR_ORDER: {
          const { yearId, sourceTakeoutIndex, targetInsertIndex } =
            undoCommand.patch;

          dispatch(
            moveCurriculumDetailYearsOrder({
              yearId,
              sourceTakeoutIndex: targetInsertIndex,
              targetInsertIndex: sourceTakeoutIndex,
            })
          );
          break;
        }
        case CurriculumCommandType.ADD_YEAR: {
          const { years } = (getState() as RootState).curriculums
            .curriculumDetail;
          const yearIds = years.allIds;
          const lastYearId = yearIds[yearIds.length - 1] as string;

          dispatch(removeCurriculumDetailYear(lastYearId));
          break;
        }
        case CurriculumCommandType.REMOVE_YEAR: {
          const { yearId, yearIndex, yearDetail } = undoCommand.patch;
          const { semesters } = yearDetail;
          let courseIds: string[] = [];

          semesters.allIds.forEach((semId) => {
            courseIds.push(...semesters.byId[semId].courseIds);
          });

          dispatch(selectCourses(courseIds));
          dispatch(addCourses());
          dispatch(
            addCurriculumDetailYear({
              yearIndex,
              yearDetail: {
                id: yearId,
                semesters,
              },
            })
          );
          break;
        }
        default: {
          break;
        }
      }

      dispatch(undo());
    }
  }
);

export const redoChange = createAsyncThunk(
  "curriculumChangeHistory/redoChange",
  (_payload: undefined, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { currentIndex, commandLogs } = (getState() as RootState)
      .curriculumChangeHistory.changeHistory;

    if (commandLogs.length > 0) {
      const redoCommand = commandLogs[currentIndex + 1];

      dispatch(executeCommand(redoCommand));
      dispatch(redo());
    }
  }
);

export const setupDefaultCourses = createAsyncThunk(
  "curriculumChangeHistory/setupDefaultCurriculum",
  (_payload: undefined, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;

    const { courses } = (getState() as RootState).courses;
    const { years } = (getState() as RootState).curriculums.curriculumDetail;

    // Get all course ids from curriculum to reduce memory size
    const filteredCourseIds = years.allIds
      .map((yearId) => {
        const { semesters } = years.byId[yearId];
        return semesters.allIds
          .map((semId) => semesters.byId[semId].courseIds.flat())
          .flat();
      })
      .flat();

    const coursesByIdTemp = Object.fromEntries(
      // Return object with [key]: value
      filteredCourseIds.map((courseId) => [courseId, courses.byId[courseId]])
    );

    dispatch(
      setCoursesBefore({
        byId: coursesByIdTemp,
        allIds: courses.allIds,
      })
    );
  }
);

export const setupDefaultCurriculum = createAsyncThunk(
  "curriculumChangeHistory/setupDefaultCurriculum",
  (_payload: undefined, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { years } = (getState() as RootState).curriculums.curriculumDetail;

    dispatch(setCurriculumBefore(years));
  }
);
//#endregion

// ALL REDUCER ACTIONS
const {
  addChangeToHistory,
  undo,
  redo,
  setCoursesBefore,
  setCurriculumBefore,
  resetState,
} = CurriculumChangeHistorySlice.actions;

// PUBLIC ACTIONS
export {
  addChangeToHistory,
  undo,
  redo,
  setCoursesBefore,
  setCurriculumBefore,
  resetState,
};

export default CurriculumChangeHistorySlice.reducer;
