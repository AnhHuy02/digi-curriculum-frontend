import type { RootState } from "src/redux/_store";
import type { ArrayNormalizer } from "src/types/Normalizer.type";
import type { IMajor } from "src/types/Department.type";
import type { ICourse } from "src/types/Course.type";
import type {
  ICurriculum,
  ICurriculumItemYear,
  ICurriculumItemSemester,
} from "src/types/Curriculum.type";

import * as d3 from "d3";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { CourseType } from "src/constants/course.const";
import {
  loadRandomCurriculums,
  setCurriculums,
  setMockDataMode,
  resetState as resetCurriculumsState,
} from "src/redux/curriculums.slice";
import {
  loadAllRandomMajors,
  loadAllRandomCourses,
  setMajors,
  setCourses,
  resetState as resetCoursesState,
} from "src/redux/courses.slice";
import { resetState as resetCurriculumChangeHistoryState } from "src/redux/curriculumChangeHistory.slice";

export const loadRandomCoursesAndCurriculums = createAsyncThunk<
  {
    majors: ArrayNormalizer<IMajor>;
    courses: ArrayNormalizer<ICourse>;
    curriculums: ArrayNormalizer<ICurriculum>;
  },
  void
>("coursesCurriculums/loadRandomCoursesAndCurriculums", async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;

  // #region Step 1: clear all data to make sure if random data is clicked
  await dispatch(resetCurriculumChangeHistoryState());
  await dispatch(resetCurriculumsState());
  await dispatch(resetCoursesState());
  dispatch(setMockDataMode("RANDOM"));
  // #endregion

  try {
    // #region Step 2: load random Majors
    const majorsResponse = await dispatch(
      loadAllRandomMajors({ min: 1, max: 15 })
    );
    const majorsTemp = majorsResponse.payload as ArrayNormalizer<IMajor>;
    // #endregion

    // #region Step 3: load random Courses
    const coursesResponse = await dispatch(
      loadAllRandomCourses({
        majors: majorsTemp,
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
    const coursesTemp = coursesResponse.payload as ArrayNormalizer<ICourse>;
    // console.log("GENERATE COURSES");
    // console.log(coursesResponse.payload);
    // #endregion

    // #region Step 4: load random Curriculums
    const curriculumsRespons = await dispatch(
      loadRandomCurriculums({
        majors: majorsTemp,
        courses: coursesTemp,
        randomCurriculumCount: {
          min: 20,
          max: 200,
        },
        randomYearCount: { min: 1, max: 3 },
        semesterPerYearCount: 3,
        randomCreditCountPerSemester: undefined,
      })
    );

    const curriculumsTemp =
      curriculumsRespons.payload as ArrayNormalizer<ICurriculum>;
    // #endregion

    // #region Step 6: Combine all mapped results data to dispatch
    // console.log("RANDOM - MARJOS", majorsTemp);
    // console.log("RANDOM - COURSES", coursesTemp);
    // console.log("RANDOM - CURRICULUMS", curriculumsTemp);

    await dispatch(setMajors(majorsTemp));
    await dispatch(setCourses(coursesTemp));
    await dispatch(setCurriculums(curriculumsTemp));
    // #endregion

    const response = {
      majors: majorsTemp,
      courses: coursesTemp,
      curriculums: curriculumsTemp,
    };

    thunkAPI.fulfillWithValue(response);

    return response;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

export const loadSampleCoursesAndCurriculums = createAsyncThunk<
  {
    majors: ArrayNormalizer<IMajor>;
    courses: ArrayNormalizer<ICourse>;
    curriculums: ArrayNormalizer<ICurriculum>;
  },
  void
>("coursesCurriculums/loadSampleCoursesAndCurriculums", async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;

  // #region Step 1: clear all data to make sure if random data is clicked
  await dispatch(resetCurriculumChangeHistoryState());
  await dispatch(resetCurriculumsState());
  await dispatch(resetCoursesState());
  dispatch(setMockDataMode("SAMPLE"));
  // #endregion

  try {
    // #region Step 2: load CSV file
    const sampleCoursesAndCurriculumsData = await import(
      "public/assets/sampleData/curriculumn-v3-string"
    );
    const csvData = d3.csvParse(sampleCoursesAndCurriculumsData.default);
    const columnsSource = csvData.columns;
    const dataSource = csvData.map((item) => item);
    // #endregion

    // #region Step 3: map dataSource to Majors
    const uniqueMajorsIds = Array.from(
      new Set<string>([...dataSource.map((item) => item["major"] as string)])
    );

    const majorsTemp: ArrayNormalizer<IMajor> = {
      allIds: [...uniqueMajorsIds],
      byId: {},
    };

    (majorsTemp.allIds as string[]).forEach((majorId) => {
      majorsTemp.byId[majorId] = {
        id: majorId,
        name: majorId,
      };
    });
    // #endregion

    // #region Step 4: map dataSource to Courses
    const uniqueCourseIds = Array.from(
      new Set<string>([...dataSource.map((item) => item["id"] as string)])
    );

    const coursesTemp: ArrayNormalizer<ICourse> = {
      allIds: [...uniqueCourseIds],
      byId: {},
    };

    const coursesDataSource = dataSource.map((item) => {
      // All columns in CSV file
      const {
        year,
        semester,
        id,
        "Course Name": name,
        credit,
        Credit_full: creditFull,
        major,
        program,
        english_level,
        version,
        Program_fullname,
      } = item;

      return {
        id,
        name,
        major,
        credit,
        creditFull,
      };
    });

    (coursesTemp.allIds as string[]).forEach((courseId, courseIndex) => {
      const course = coursesDataSource.find((item) => item["id"] === courseId);

      if (course) {
        // Example: "32 (0, 32)asdasd"
        // 1st replace: "0, 32)asdasd"
        // 2nd replace: "0, 32"
        // split:       ["0", "32"]
        // map to number: [0, 32]
        const creditString: number[] = course.creditFull
          ?.replace(/[\S\s]*\(/, "")
          .replace(/\)[\S\s]*/, "")
          .split(", ")
          .map(Number) || [0, 0];

        coursesTemp.byId[courseId] = {
          id: course.id || `course${courseIndex}`,
          name: course.name || `Course ${courseIndex}`,
          credit: {
            theory: creditString[0],
            practice: creditString[1],
          },
          majorId: course.major || "EMPTY_MAJOR",
          type: CourseType.OTHERS,
          disabled: false,
          selected: false,
          selectedTemp: false,
          highlighted: false,
          // CSV file does not have any course relationship
          relationships: {
            preRequisites: [],
            coRequisites: [],
            previous: [],
            placeholders: [],
          },
          difficulty: 0.0,
          rating: 0.0,
        };
      }
    });
    // #endregion

    // #region Step 5: map dataSource to Curriculums
    const uniqueCurriculumIds = Array.from(
      new Set<string>([
        ...dataSource.map((item) => item["Program_fullname"] as string),
      ])
    );

    const curriculumsTemp: ArrayNormalizer<ICurriculum> = {
      allIds: [...uniqueCurriculumIds],
      byId: {},
    };

    (curriculumsTemp.allIds as string[]).map(
      // #region Step 5.1: Add data for each curriculum
      (curriculumId, curriculumIndex) => {
        const curriculumCourses = dataSource.filter(
          (item) => item["Program_fullname"] === curriculumId
        );

        const uniqueYearIds = Array.from(
          new Set<string>([
            ...curriculumCourses.map((item) => item["year"] as string),
          ])
        );

        const yearsTemp: ArrayNormalizer<ICurriculumItemYear> = {
          allIds: [
            ...uniqueYearIds.map((_, yearIndex) => `year-${yearIndex + 1}`),
          ],
          byId: {},
        };

        (yearsTemp.allIds as string[]).forEach((yearId, yearIndex) => {
          // #region Step 5.2: Add data for each year

          const uniqueSemesterIds = Array.from(
            new Set<string>([
              ...curriculumCourses.map((item) => item["semester"] as string),
            ])
          );

          if (uniqueSemesterIds.length === 2) {
            uniqueSemesterIds.push("_");
          }

          const semestersTemp: ArrayNormalizer<ICurriculumItemSemester> = {
            allIds: [
              ...uniqueSemesterIds.map(
                (_, semesterIndex) => `${yearId}-sem-${semesterIndex + 1}`
              ),
            ],
            byId: {},
          };

          (semestersTemp.allIds as string[]).forEach(
            // #region Step 5.3: Add data for each semester
            (semesterId, semesterIndex) => {
              const semesterCourseIds = Array.from(
                new Set<string>([
                  ...(curriculumCourses
                    .filter(
                      (item) =>
                        item["year"] === uniqueYearIds[yearIndex] &&
                        item["semester"] === uniqueSemesterIds[semesterIndex]
                    )
                    .map((item) => item["id"]) as string[]),
                ])
              );

              const creditLimit =
                semesterIndex !== uniqueSemesterIds.length - 1 ? 24 : 12;
              const creditCount = semesterCourseIds.reduce((sum, courseId) => {
                return (
                  sum +
                  coursesTemp.byId[courseId].credit.theory +
                  coursesTemp.byId[courseId].credit.practice
                );
              }, 0);

              const semesterTemp: ICurriculumItemSemester = {
                id: semesterId,
                courseIds: [...semesterCourseIds],
                creditCount: creditCount,
                creditLimit: creditLimit,
              };

              semestersTemp.byId[semesterId] = semesterTemp;
            }
            // #endregion
          );

          yearsTemp.byId[yearId] = {
            id: yearId,
            semesters: semestersTemp,
          };
          // #endregion
        });

        const getCurriculum = dataSource.find(
          (item) => item["Program_fullname"] === curriculumId
        );

        curriculumsTemp.byId[curriculumId] = {
          id: curriculumId,
          years: yearsTemp,
          semCountPerYear: 3,
          year:
            getCurriculum && getCurriculum["version"]
              ? Number(getCurriculum["version"])
              : 2020,
          name:
            getCurriculum && getCurriculum["Program_fullname"]
              ? String(getCurriculum["Program_fullname"])
              : "",
          programType:
            getCurriculum && getCurriculum["program"]
              ? String(getCurriculum["program"])
              : "",
          major:
            getCurriculum && getCurriculum["major"]
              ? String(getCurriculum["major"])
              : "",
          englishLevel:
            getCurriculum && getCurriculum["english_level"]
              ? String(getCurriculum["english_level"])
              : "",
        };
      }
      // #endregion
    );
    // #endregion

    // #region Step 6: Combine all mapped results data to dispatch
    // console.log("CSV FILE - MARJOS", majorsTemp);
    // console.log("CSV FILE - COURSES", coursesTemp);
    // console.log("CSV FILE - CURRICULUMS", curriculumsTemp);

    await dispatch(setMajors(majorsTemp));
    await dispatch(setCourses(coursesTemp));
    await dispatch(setCurriculums(curriculumsTemp));
    // #endregion

    const response = {
      majors: majorsTemp,
      courses: coursesTemp,
      curriculums: curriculumsTemp,
    };

    thunkAPI.fulfillWithValue(response);

    return response;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});
