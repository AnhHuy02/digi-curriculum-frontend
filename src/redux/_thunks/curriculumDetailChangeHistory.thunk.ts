import type { RootState } from "../_store";
import type { CurriculumDetailHistoryAction } from "src/types/curriculum.type";

import _pull from "lodash/pull";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { CurriculumCommandType } from "src/constants/curriculum.const";
import {
  addCourseRelationship,
  selectCourses,
  removeCourseRelationship,
  removeSelectedCourses,
  addCourses,
  removeSelectedCourse,
  selectCourse,
} from "../courses.slice";
import {
  undo,
  redo,
  addChangeToHistory,
  addCurriculumDetailCourses,
  addCurriculumDetailYear,
  removeCurriculumDetailCourse,
  removeCurriculumDetailCourses,
  addCurriculumDetailCourse,
  moveCurriculumDetailCourse,
  moveCurriculumDetailYearsOrder,
  removeCurriculumDetailYear,
} from "../curriculums.slice";

export const addCurriculumChangeToHistory = createAsyncThunk(
  "curriculums/addChangeToHistory",
  (payload: CurriculumDetailHistoryAction, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;

    switch (payload.type) {
      case CurriculumCommandType.ADD_COURSE_RELATIONSHIP: {
        dispatch(addCourseRelationship({ ...payload.patch }));
        break;
      }
      case CurriculumCommandType.REMOVE_COURSE_RELATIONSHIP: {
        dispatch(removeCourseRelationship({ ...payload.patch }));
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
        const { semesters, semestersOrder } = yearDetail;
        let courseIds: string[] = [];

        semestersOrder.forEach((semId) => {
          courseIds.push(...semesters[semId].courseIds);
        });

        dispatch(removeSelectedCourses(courseIds));
        dispatch(removeCurriculumDetailYear(yearId));
      }
      default: {
        break;
      }
    }
    dispatch(addChangeToHistory(payload));
  }
);

export const undoChange = createAsyncThunk(
  "curriculumsChangeHistory/undoChange",
  (_payload: undefined, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { currentIndex, commandLogs } = (getState() as RootState).curriculums
      .curriculumDetail.changeHistory;

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
          const { allYearsOrder } = (getState() as RootState).curriculums
            .curriculumDetail;
          const yearId = allYearsOrder[allYearsOrder.length - 1];

          dispatch(removeCurriculumDetailYear(yearId));
          break;
        }
        case CurriculumCommandType.REMOVE_YEAR: {
          const { yearId, yearIndex, yearDetail } = undoCommand.patch;
          const { semesters, semestersOrder } = yearDetail;
          let courseIds: string[] = [];

          semestersOrder.forEach((semId) => {
            courseIds.push(...semesters[semId].courseIds);
          });

          dispatch(selectCourses(courseIds));
          dispatch(
            addCurriculumDetailYear({
              yearIndex,
              yearDetail: {
                id: yearId,
                semesters,
                semestersOrder,
              },
            })
          );
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
  "curriculumsChangeHistory/redoChange",
  (_payload: undefined, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { currentIndex, commandLogs } = (getState() as RootState).curriculums
      .curriculumDetail.changeHistory;

    if (commandLogs.length > 0) {
      const redoCommand = commandLogs[currentIndex + 1];

      switch (redoCommand.type) {
        case CurriculumCommandType.ADD_COURSE_RELATIONSHIP: {
          const { courseSourceId, courseTargetId, relationship } =
            redoCommand.patch;

          dispatch(
            addCourseRelationship({
              courseSourceId,
              courseTargetId,
              relationship,
            })
          );
          break;
        }
        case CurriculumCommandType.REMOVE_COURSE_RELATIONSHIP: {
          const { courseSourceId, courseTargetId } = redoCommand.patch;

          dispatch(
            removeCourseRelationship({
              courseSourceId,
              courseTargetId,
            })
          );
          break;
        }
        case CurriculumCommandType.ADD_COURSES_TO_SEMESTER: {
          const { courseIds } = redoCommand.patch;

          dispatch(selectCourses(courseIds));
          dispatch(addCurriculumDetailCourses({ ...redoCommand.patch }));
          dispatch(addCourses());
          break;
        }
        case CurriculumCommandType.REMOVE_COURSE_FROM_SEMESTER: {
          const { yearId, semId, courseId } = redoCommand.patch;

          dispatch(removeSelectedCourse(courseId));
          dispatch(removeCurriculumDetailCourse({ yearId, semId, courseId }));
          break;
        }
        case CurriculumCommandType.CHANGE_COURSE_BETWEEN_TWO_SEMESTER: {
          dispatch(moveCurriculumDetailCourse({ ...redoCommand.patch }));
          break;
        }
        case CurriculumCommandType.CHANGE_YEAR_ORDER: {
          dispatch(moveCurriculumDetailYearsOrder({ ...redoCommand.patch }));
          break;
        }
        case CurriculumCommandType.ADD_YEAR: {
          dispatch(addCurriculumDetailYear());
          break;
        }
        case CurriculumCommandType.REMOVE_YEAR: {
          const { yearId, yearDetail } = redoCommand.patch;
          const { semesters, semestersOrder } = yearDetail;
          let courseIds: string[] = [];

          semestersOrder.forEach((semId) => {
            courseIds.push(...semesters[semId].courseIds);
          });

          dispatch(removeSelectedCourses(courseIds));
          dispatch(removeCurriculumDetailYear(yearId));
        }
        default: {
          break;
        }
      }

      dispatch(redo());
    }
  }
);
