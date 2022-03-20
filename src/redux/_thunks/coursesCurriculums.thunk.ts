import type { IRandomMajorsReturn } from "src/types/department.type";
import type { IRandomCoursesReturn } from "src/types/course.type";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { CourseType } from "src/constants/course.const";
import {
  loadRandomCurriculumDetail,
  resetState as resetCurriculumsState,
} from "src/redux/curriculums.slice";
import {
  loadAllRandomMajors,
  loadAllRandomCourses,
  resetState as resetCoursesState,
} from "src/redux/courses.slice";

export const initRandomCurriculumDetailPageData = createAsyncThunk(
  "coursesCurriculums/initRandomCurriculumDetailPageData",
  async (_payload, thunkAPI) => {
    const { dispatch } = thunkAPI;

    dispatch(resetCurriculumsState());
    dispatch(resetCoursesState());

    try {
      const majorsResponse = await dispatch(
        loadAllRandomMajors({ min: 1, max: 15 })
      );
      const majorsPayload = majorsResponse.payload as IRandomMajorsReturn;

      const coursesResponse = await dispatch(
        loadAllRandomCourses({
          allMajorIds: majorsPayload.allMajorIds,
          randomCourseCount: { min: 15, max: 150 },
          nameLength: { min: 1, max: 6 },
          creditCount: {
            theory: { min: 0, max: 5 },
            practice: { min: 0, max: 5 },
          },
          courseRelationship: {
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
      // console.log(coursesPayload);

      const curriculumItemDetailResponse = await dispatch(
        loadRandomCurriculumDetail({
          allCourses: coursesPayload.allCourses,
          allCourseIds: coursesPayload.allCourseIds,
          randomYearCount: { min: 1, max: 4 },
          semesterPerYearCount: 3,
          courseCountPerSemester: { min: 0, max: 10 },
          randomCreditCountPerSemester: undefined,
          electiveGroups: {},
          electiveGroupIds: [],
        })
      );

      return curriculumItemDetailResponse;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
