import type { ICourseItemSimple } from "src/types/course.type";
import type { IRandomRange } from "src/types/others.type";

import faker from "@faker-js/faker";
// // import sampleSize from 'lodash/sampleSize';
// import cloneDeep from 'lodash/cloneDeep';

interface IRandomCurriculumDetailParam {
  allCourses: Record<string, ICourseItemSimple>;
  allCourseIds: string[];
  randomYearCount?: IRandomRange;
  semesterPerYearCount?: number;
  
}

export function generateRandomCurriculumDetail({
  allCourses,
  allCourseIds,

}: IRandomCurriculumDetailParam) {
  let allYears = {};
  // let allYearIdsOrder: string[] = Array.from({ });

  // const yearCount = faker.random.number({ min: 0, max: 4 });
  // const semCount = 3;

  // // generate empty year + sem
  // for (let i = 0; i < yearCount; ++i) {
  //   const yearId = 'year' + (i + 1).toString() + faker.random.uuid();
  //   allYearIdsOrder.push(yearId);
  //   allYears[yearId] = {
  //     id: yearId,
  //     allSems: {},
  //     allSemIdsOrder: [],
  //   };

  //   const currentYear = allYears[yearId];

  //   for (let j = 0; j < semCount; ++j) {
  //     const semId = 'sem' + (j + 1).toString();
  //     currentYear.allSemIdsOrder.push(semId);
  //     currentYear.allSems[semId] = {
  //       id: semId,
  //       courseIds: [],
  //       // creditCount: 0,
  //     };
  //   }
  // }

  // // let randomCourseCount = faker.random.number({ min: 0, max: allCourseIds.length });
  // // let randomSelectedCourseIds = sampleSize(allCourseIds, randomCourseCount);
  // let randomSelectedCourseIds = cloneDeep(allCourseIds);

  // // add courses
  // allYearIdsOrder.forEach((yearId) => {
  //   const currentYear = allYears[yearId];
  //   currentYear.allSemIdsOrder.forEach((semId) => {
  //     const currentSem = currentYear.allSems[semId];
  //     let creditCount = 0;

  //     // Add courses for each semester (maximum 24 credit)
  //     randomSelectedCourseIds.every((courseId) => {
  //       const randomCourseIndex = faker.random.number({ min: 0, max: randomSelectedCourseIds.length - 1 });
  //       const currentCourseId = randomSelectedCourseIds[randomCourseIndex];
  //       if (creditCount + allCourses[currentCourseId].credit > 24) {
  //         return false;
  //       } else {
  //         // Remove id from the list, add to semester
  //         creditCount += allCourses[currentCourseId].credit;
  //         currentSem.courseIds.push(currentCourseId);
  //         randomSelectedCourseIds.splice(randomCourseIndex, 1);
  //         return true;
  //       }
  //     });
  //   });
  // });

  // return {
  //   allYears,
  //   allYearIdsOrder,
  // };
}
