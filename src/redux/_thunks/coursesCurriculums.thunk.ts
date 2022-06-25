import type { IRandomMajorsReturn } from "src/types/Department.type";
import type { IRandomCoursesReturn } from "src/types/Course.type";
import type { RootState } from "src/redux/_store";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { CourseType } from "src/constants/course.const";
import {
  loadRandomCurriculums,
  loadRandomCurriculumDetail,
  resetState as resetCurriculumsState,
} from "src/redux/curriculums.slice";
import {
  loadAllRandomMajors,
  loadAllRandomCourses,
  selectCourses,
  addCourses,
  resetState as resetCoursesState,
} from "src/redux/courses.slice";
import {
  setupDefaultCourses,
  setupDefaultCurriculum,
  resetState as resetCurriculumChangeHistoryState,
} from "src/redux/curriculumChangeHistory.slice";

export const initRandomCurriculumDetailPageData = createAsyncThunk(
  "coursesCurriculums/initRandomCurriculumDetailPageData",
  async (_payload, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;

    // #region Step 1: clear all data to make sure if random data is clicked
    await dispatch(resetCurriculumChangeHistoryState());
    await dispatch(resetCurriculumsState());
    await dispatch(resetCoursesState());
    // #endregion

    try {
      // #region Step 2: random courses and curriculums
      const majorsResponse = await dispatch(
        loadAllRandomMajors({ min: 1, max: 15 })
      );
      const majorsPayload = majorsResponse.payload as IRandomMajorsReturn;

      const coursesResponse = await dispatch(
        loadAllRandomCourses({
          allMajorIds: majorsPayload.allMajorIds,
          randomCourseCount: { min: 15, max: 100 },
          nameLength: { min: 1, max: 3 },
          creditCount: {
            theory: { min: 0, max: 5 },
            practice: { min: 0, max: 5 },
          },
          relationships: {
            preRequisite: { min: 0, max: 1 },
            previous: { min: 0, max: 1 },
            coRequisite: { min: 0, max: 1 },
            placeholder: { min: 0, max: 1 },
          },
          courseTypeDistribution: [
            {
              id: CourseType.GENERAL,
              frequency: 30,
            },
            {
              id: CourseType.SPECIALIZATION_REQUIRED,
              frequency: 30,
            },
            {
              id: CourseType.SPECIALIZATION_ELECTIVE,
              frequency: 20,
            },
            {
              id: CourseType.FUNDAMENTAL,
              frequency: 15,
            },
            {
              id: CourseType.PROJECT_INTERN_THESIS,
              frequency: 5,
            },
            {
              id: CourseType.OTHERS,
              frequency: 10,
            },
          ],
        })
      );
      const coursesPayload = coursesResponse.payload as IRandomCoursesReturn;
      // console.log("GENERATE COURSES");
      // console.log(coursesResponse.payload);

      const curriculumItemDetailResponse = await dispatch(
        loadRandomCurriculumDetail({
          allCourses: coursesPayload.allCourses,
          allCourseIds: coursesPayload.allCourseIds,
          randomYearCount: { min: 2, max: 2 },
          semesterPerYearCount: 3,
          courseCountPerSemester: { min: 0, max: 6 },
          randomCreditCountPerSemester: undefined,
          electiveGroups: {},
          electiveGroupIds: [],
        })
      );
      // console.log("GENERATE A CURRICULUM");
      // console.log(curriculumItemDetailResponse.payload);
      // #endregion

      // #region Step 3: For Add Course feature, handle checkbox based on
      // courses from curriculum
      const { allYears, allYearsOrder } = (getState() as RootState).curriculums
        .curriculumDetail;
      let courseIdsPlaceholder: string[] = [];

      allYearsOrder.forEach((yearId) => {
        const year = allYears[yearId];
        const { semesters, semestersOrder } = year;

        semestersOrder.forEach((semId) => {
          const semester = semesters[semId];
          courseIdsPlaceholder.push(...semester.courseIds);
        });
      });
      await dispatch(selectCourses(courseIdsPlaceholder));
      await dispatch(addCourses());

      // #endregion

      // #region Step 4: Start detecting curriculums and courses changes
      dispatch(setupDefaultCurriculum());
      dispatch(setupDefaultCourses());
      // #endregion

      // #region Step 5:
      dispatch(
        loadRandomCurriculums({
          randomCurriculumCount: {
            min: 1,
            max: 9,
          },
          allCourses: coursesPayload.allCourses,
          allCourseIds: coursesPayload.allCourseIds,
          randomYearCount: { min: 1, max: 3 },
          semesterPerYearCount: 3,
          courseCountPerSemester: { min: 0, max: 6 },
          randomCreditCountPerSemester: undefined,
          electiveGroups: {},
          electiveGroupIds: [],
        })
      );
      // #endregion

      thunkAPI.fulfillWithValue("success");
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
