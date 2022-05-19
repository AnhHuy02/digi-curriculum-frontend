import type { RootState } from "../_store";
import type { CurriculumDetailHistoryAction } from "src/types/curriculum.type";

import _pull from "lodash/pull";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { UndoCommandType } from "src/constants/curriculum.const";

import {
  addCourseRelationship,
  removeCourseRelationship,
} from "../courses.slice";
import {
  undo,
  redo,
  addChangeToHistory,
  addCurriculumDetailCourses,
  addCurriculumDetailYear,
  removeCurriculumDetailCourse,
} from "../curriculums.slice";

export const addCurriculumChangeToHistory = createAsyncThunk(
  "curriculums/addChangeToHistory",
  (payload: CurriculumDetailHistoryAction, thunkAPI) => {
    const { dispatch } = thunkAPI;

    switch (payload.type) {
      case UndoCommandType.ADD_COURSE_RELATIONSHIP: {
        dispatch(addCourseRelationship({ ...payload.patch }));
        break;
      }
      case UndoCommandType.REMOVE_COURSE_RELATIONSHIP: {
        dispatch(removeCourseRelationship({ ...payload.patch }));
        break;
      }
      case UndoCommandType.CHANGE_COURSE_RELATIONSHIP: {
        const {
          courseSourceId,
          courseTargetId,
          newRelationship,
          oldRelationship,
        } = payload.patch;
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
      case UndoCommandType.ADD_COURSES_TO_SEMESTER: {
        dispatch(addCurriculumDetailCourses({ ...payload.patch }));
        break;
      }
      case UndoCommandType.REMOVE_COURSE_FROM_SEMESTER: {
        dispatch(removeCurriculumDetailCourse({ ...payload.patch }));
        break;
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

    // console.log("UNDO CHANGE", currentIndex);

    if (currentIndex > -1) {
      const undoCommand = commandLogs[currentIndex];

      // console.log(undoCommand);

      switch (undoCommand.type) {
        case UndoCommandType.ADD_COURSE_RELATIONSHIP: {
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
        case UndoCommandType.REMOVE_COURSE_RELATIONSHIP: {
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

    // console.log("REDO CHANGE", currentIndex);

    if (commandLogs.length > 0) {
      const redoCommand = commandLogs[currentIndex + 1];

      // console.log(redoCommand);

      switch (redoCommand.type) {
        case UndoCommandType.ADD_COURSE_RELATIONSHIP: {
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
        case UndoCommandType.REMOVE_COURSE_RELATIONSHIP: {
          const { courseSourceId, courseTargetId, relationship } =
            redoCommand.patch;
          dispatch(
            removeCourseRelationship({
              courseSourceId,
              courseTargetId,
            })
          );
          break;
        }
        default: {
          break;
        }
      }

      dispatch(redo());
    }
  }
);
