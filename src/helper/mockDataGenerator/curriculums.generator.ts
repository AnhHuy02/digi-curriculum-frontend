import type {
  ICourseItemSimple,
  ICourseTypeDistribution,
} from "src/types/Course.type";
import type { IRange } from "src/types/Others.type";
import type {
  ICurriculumItemYear,
  ICurriculumItemSimple,
  ICurriculumItemDetail,
  ICurriculumItemSemester,
  IRandomCurriculumDetailParam,
  IRandomCurriculumDetailItemReturn,
} from "src/types/Curriculum.type";

import faker from "@faker-js/faker";
import _sample from "lodash/sample";
import _sampleSize from "lodash/sampleSize";
import _pull from "lodash/pull";
import _pullAll from "lodash/pullAll";
import _includes from "lodash/includes";

import { CourseType } from "src/constants/course.const";
// // import sampleSize from 'lodash/sampleSize';
// import cloneDeep from 'lodash/cloneDeep';

export const generateRandomCurriculumDetail = ({
  allCourses,
  allCourseIds,
  randomYearCount = { min: 1, max: 4 },
  semesterPerYearCount = 3,
  courseCountPerSemester = { min: 0, max: 10 },
  randomCreditCountPerSemester = undefined,
  electiveGroups = {},
  electiveGroupIds = [],
}: IRandomCurriculumDetailParam): IRandomCurriculumDetailItemReturn => {
  const yearCount = faker.datatype.number(randomYearCount);
  let courseIdsCopy = [...allCourseIds];

  // #region Step 1: Initialize random years with empty semester
  let allYears: Record<string, ICurriculumItemYear> = {};
  let allYearIdsOrder: string[] = Array.from(
    { length: yearCount },
    (item, i) => {
      // #region Step 1.1: Initiallize semesters
      const yearId = `year-${i + 1}`;

      let allSemesters: Record<string, ICurriculumItemSemester> = {};
      let allSemestersOrder = Array.from(
        { length: semesterPerYearCount },
        (semItem, semIndex) => {
          // #region Step 1.2: Add credit limit for each semester (including summer semestger)
          const semId = `${yearId}-sem-${semIndex + 1}`;
          const creditLimit = Boolean(randomCreditCountPerSemester)
            ? faker.datatype.number(randomCreditCountPerSemester)
            : semIndex !== semesterPerYearCount - 1
            ? 24
            : 12;

          allSemesters[semId] = {
            id: semId,
            creditCount: 0,
            creditLimit: creditLimit,
            courseIds: [],
          };

          return semId;
          // #endregion
        }
      );
      // #endregion

      allYears[yearId] = {
        id: yearId,
        semesters: allSemesters,
        semestersOrder: allSemestersOrder,
      };

      return yearId;
    }
  );
  // #endregion

  // #region Step 2: Add courses to each semester, also check if credit count <= credit limit
  allYearIdsOrder.forEach((yearId) => {
    let { semesters, semestersOrder } = allYears[yearId];
    semestersOrder.forEach((semId, semIndex) => {
      let { courseIds } = semesters[semId];
      const creditLimit = Boolean(randomCreditCountPerSemester)
        ? faker.datatype.number(randomCreditCountPerSemester)
        : semIndex !== semesterPerYearCount - 1
        ? 24
        : 12;
      let creditCount = 0;

      if (allCourseIds.length > 0) {
        while (creditCount <= creditLimit) {
          // #region Step 2.1: Fill semester with random course ids and check if credit count <= credit limit
          // Pick a random course id from the list
          const randomCourseId = _sample(courseIdsCopy) as string;

          if (randomCourseId) {
            const { credit } = allCourses[randomCourseId];
            if (creditCount + credit.theory + credit.practice <= creditLimit) {
              // Step 2.5: If true, remove a course id from the list
              creditCount += credit.theory + credit.practice;
              courseIds.push(randomCourseId);
              semesters[semId].creditCount = creditCount;
              _pull(courseIdsCopy, randomCourseId);
            } else {
              // Stop the loop if greater than limit
              break;
            }
          } else {
            break;
          }
        }
        // #endregion
      }
    });
  });
  // #endregion

  // Step 3: Add elective group (optional)

  // Test duplicate courseIds
  // let asd: any[] = [];
  // allYearIdsOrder.forEach((yearId, yearIndex) => {
  //   const { semesters, semestersOrder } = allYears[yearId];
  //   semestersOrder.forEach((semesterId, semesterIndex) => {
  //     const { courseIds } = semesters[semesterId];

  //     courseIds.forEach((courseId, courseIndex) => {
  //       asd.push(courseId);
  //     });
  //   });
  // });

  // console.log(asd);
  return {
    allYears,
    allYearIdsOrder,
  };
};

export const getRandomCurriculums = (
  config: IRandomCurriculumDetailParam & {
    randomCurriculumCount: { min: number; max: number };
  }
) => {
  const promise = new Promise<IRandomCurriculumDetailItemReturn[]>(function (
    resolve,
    reject
  ) {
    const { randomCurriculumCount, ...curriculumConfig } = config;
    const curriculumCount = faker.datatype.number({
      min: randomCurriculumCount.min,
      max: randomCurriculumCount.max,
    });

    setTimeout(function () {
      const curriculums = Array.from({ length: curriculumCount }, () => {
        return generateRandomCurriculumDetail(config);
      });

      resolve(curriculums);
    }, 1);
  });

  return promise;
};

export const getRandomCurriculumItem = (
  config: IRandomCurriculumDetailParam
) => {
  const promise = new Promise<IRandomCurriculumDetailItemReturn>(function (
    resolve,
    reject
  ) {
    setTimeout(function () {
      resolve(generateRandomCurriculumDetail(config));
    }, 1);
  });
  return promise;
};
