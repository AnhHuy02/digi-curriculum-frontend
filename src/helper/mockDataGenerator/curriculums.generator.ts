import type { ArrayNormalizer } from "src/types/Normalizer.type";
import type {
  ICurriculum,
  ICurriculumItemYear,
  ICurriculumItemSemester,
  IRandomCurriculumDetailParam,
} from "src/types/Curriculum.type";

import faker from "@faker-js/faker";
import _sample from "lodash/sample";
import _sampleSize from "lodash/sampleSize";
import _pull from "lodash/pull";
import _pullAll from "lodash/pullAll";
import _includes from "lodash/includes";

export const generateRandomCurriculumItem = ({
  courses,
  majors,
  randomYearCount = { min: 1, max: 4 },
  semesterPerYearCount = 3,
  randomCreditCountPerSemester = undefined,
}: IRandomCurriculumDetailParam): ICurriculum => {
  const randomCurriculumId = faker.datatype.uuid();

  const curriculumTemp: ICurriculum = {
    id: randomCurriculumId,
    year: 2020,
    name: faker.name.title(),
    programType: faker.name.title(),
    englishLevel: faker.name.title(),
    semCountPerYear: semesterPerYearCount,
    years: {
      allIds: [],
      byId: {},
    },
  };

  let courseIdsCopy = [...courses.allIds];

  // #region Step 1: Initialize random years with empty semester
  const yearCount = faker.datatype.number(randomYearCount);

  curriculumTemp.years.allIds = Array.from(
    { length: yearCount },
    (_, yearIndex) => {
      const yearId = `year-${yearIndex + 1}`;
      return yearId;
    }
  );
  // #endregion

  // #region Step 2: Initialize years and semesters inside a curriculum
  curriculumTemp.years.allIds.forEach((yearId, yearIndex) => {
    // #region Step 2.1: Initiallize years
    const yearTemp: ICurriculumItemYear = {
      id: yearId as string,
      semesters: {
        allIds: [],
        byId: {},
      },
    };

    yearTemp.semesters.allIds = Array.from(
      { length: semesterPerYearCount },
      (_, semIndex) => {
        const semId = `${yearId}-sem-${semIndex + 1}`;
        return semId;
      }
    );
    // #endregion

    // #region Step 2.2: Initialize semesters
    yearTemp.semesters.allIds.forEach((semesterId, semesterIndex) => {
      const creditLimit = Boolean(randomCreditCountPerSemester)
        ? faker.datatype.number(randomCreditCountPerSemester)
        : semesterIndex !== yearTemp.semesters.allIds.length - 1
        ? 24
        : 12;

      const semestersTemp: ICurriculumItemSemester = {
        id: semesterId as string,
        courseIds: [],
        creditCount: 0,
        creditLimit: creditLimit,
      };

      // #region Step 2.2.1: Add courses to each semester,
      // also check if credit count <= credit limit
      if (courses.allIds.length > 0) {
        while (semestersTemp.creditCount <= creditLimit) {
          // Pick a random course id from the list
          const randomCourseId = _sample(courseIdsCopy) as string;

          if (randomCourseId) {
            const { credit } = courses.byId[randomCourseId];

            if (
              semestersTemp.creditCount + credit.theory + credit.practice <=
              creditLimit
            ) {
              semestersTemp.creditCount += credit.theory + credit.practice;
              semestersTemp.courseIds.push(randomCourseId);

              // Step 2.2.1.1: If true, remove a course id from the list
              _pull(courseIdsCopy, randomCourseId);
            } else {
              // Stop the loop if greater than limit
              break;
            }
          } else {
            break;
          }
        }
      }
      // #endregion

      yearTemp.semesters.byId[semesterId] = { ...semestersTemp };
    });
    // #endregion

    curriculumTemp.years.byId[yearId] = yearTemp;
  });
  // #endregion

  return curriculumTemp;
};

export const getRandomCurriculums = (
  config: IRandomCurriculumDetailParam & {
    randomCurriculumCount: { min: number; max: number };
  }
) => {
  const promise = new Promise<ArrayNormalizer<ICurriculum>>(function (
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
        return generateRandomCurriculumItem(config);
      });

      // console.log("CURRICULUM YEARS", curriculumsYears);

      let curriculumsTemp: ArrayNormalizer<ICurriculum> = {
        allIds: [],
        byId: {},
      };

      curriculums.forEach((curriculum, curriculumIndex) => {
        const newCurriculumId = `curriculum${curriculumIndex + 1}`;

        curriculumsTemp.allIds.push(newCurriculumId);
        curriculumsTemp.byId[newCurriculumId] = {
          ...curriculum,
          id: newCurriculumId,
        };
      });

      resolve(curriculumsTemp);
    }, 1);
  });

  return promise;
};

export const getRandomCurriculumItem = (
  config: IRandomCurriculumDetailParam
) => {
  const promise = new Promise<ICurriculum>(function (resolve, reject) {
    setTimeout(function () {
      resolve(generateRandomCurriculumItem(config));
    }, 1);
  });
  return promise;
};
