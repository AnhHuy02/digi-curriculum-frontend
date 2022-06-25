import type {
  IMajorSimple,
  IRandomMajorsReturn,
} from "src/types/Department.type";
import type {
  ICourseItemSimple,
  ICourseTypeDistribution,
  IRandomCoursesParam,
  IRandomCoursesReturn,
} from "src/types/Course.type";
import type { IRange } from "src/types/Others.type";

import faker from "@faker-js/faker";
import _sample from "lodash/sample";
import _sampleSize from "lodash/sampleSize";
import _pull from "lodash/pull";
import _pullAll from "lodash/pullAll";
import _includes from "lodash/includes";

import {
  getCumulativeFrequencies,
  pickRandomDistribution,
} from "src/helper/math";
import { CourseType } from "src/constants/course.const";

export const generateRandomMajors = ({
  min,
  max,
}: IRange): IRandomMajorsReturn => {
  const majorCount = faker.datatype.number({ min, max });

  let allMajors: Record<string, IMajorSimple> = {};
  let allMajorIds = Array.from({ length: majorCount }, (item, i) => {
    const majorId = "major" + i.toString() + "-" + faker.datatype.string();

    allMajors[majorId] = {
      id: majorId,
      name: faker.name.title(),
    };

    return majorId;
  });

  return {
    allMajors,
    allMajorIds,
  };
};

/**
 *
 * @param param0
 * @returns
 */
export const generateRandomCourses = ({
  allMajorIds,
  randomCourseCount = { min: 0, max: 150 },
  nameLength = { min: 1, max: 7 },
  creditCount = {
    theory: { min: 0, max: 10 },
    practice: { min: 0, max: 10 },
  },
  relationships: courseRelationship = {
    preRequisite: { min: 0, max: 4 },
    previous: { min: 0, max: 4 },
    coRequisite: { min: 0, max: 4 },
    placeholder: { min: 0, max: 4 },
  },
  courseTypeDistribution = [
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
}: IRandomCoursesParam): IRandomCoursesReturn => {
  const courseCount = faker.datatype.number(randomCourseCount);

  // Step 1: Initialize random courses
  let allCourses: Record<string, ICourseItemSimple> = {};
  const courseTypesByCumulativeFrequencies = getCumulativeFrequencies(
    courseTypeDistribution
  );

  let allCourseIds = Array.from({ length: courseCount }, (item, i) => {
    const courseId = "course" + i.toString() + "-" + faker.datatype.uuid();
    const randomNameLength = faker.datatype.number(nameLength);
    const randomMajorId = _sample(allMajorIds) as string;

    allCourses[courseId] = {
      id: courseId,
      name: faker.random.words(randomNameLength),
      credit: {
        theory: faker.datatype.number(creditCount.theory),
        practice: faker.datatype.number(creditCount.practice),
      },
      majorId: randomMajorId,
      type:
        // Step 1.1: Select a random course type
        pickRandomDistribution(courseTypesByCumulativeFrequencies)?.id ||
        CourseType.GENERAL,
      disabled: false,
      selected: false,
      selectedTemp: false,
      relationships: {
        preRequisites: [],
        coRequisites: [],
        previous: [],
        placeholders: [],
      },
      difficulty: faker.datatype.number({ min: 1, max: 5, precision: 1 }),
      rating: faker.datatype.number({ min: 0, max: 5, precision: 0.1 }),
      // highlighted: false,
    };

    return courseId;
  });

  // Step 2: Add courses relationship
  allCourseIds.forEach((courseId) => {
    // Prevent duplicate relationship when selecting a course randomly
    let tempAllCourseIds = [...allCourseIds];

    //#region Random PreRequisite relationship
    const randomPreRequisiteCount = faker.datatype.number(
      courseRelationship.preRequisite
    );

    const randomPreRequisiteIds = _sampleSize(
      tempAllCourseIds,
      randomPreRequisiteCount
    );

    _pullAll(tempAllCourseIds, randomPreRequisiteIds);
    //#endregion

    //#region Random CoRequisite relationship
    const randomCoRequisiteCount = faker.datatype.number(
      courseRelationship.coRequisite
    );
    const randomCoRequisiteIds = _sampleSize(
      tempAllCourseIds,
      randomCoRequisiteCount
    );
    _pullAll(tempAllCourseIds, randomCoRequisiteIds);
    //#endregion

    //#region Random Previous relationship
    const randomPreviousCount = faker.datatype.number(
      courseRelationship.previous
    );
    const randomPreviousIds = _sampleSize(
      tempAllCourseIds,
      randomPreviousCount
    );
    _pullAll(tempAllCourseIds, randomPreviousIds);
    //#endregion

    //#region Random Placeholder relationship
    const randomPlaceHolderCount = faker.datatype.number(
      courseRelationship.placeholder
    );
    const randomPlaceHolderIds = _sampleSize(
      tempAllCourseIds,
      randomPlaceHolderCount
    );
    //#endregion

    allCourses[courseId].relationships = {
      preRequisites: randomPreRequisiteIds,
      coRequisites: randomCoRequisiteIds,
      previous: randomPreviousIds,
      placeholders: randomPlaceHolderIds,
    };
  });

  // Step 2.5: Remove duplicated relationship
  allCourseIds.forEach((courseId) => {
    // Prevent duplicate relationship when selecting a course randomly
    const { preRequisites, coRequisites, previous, placeholders } =
      allCourses[courseId].relationships;

    //#region Remove duplicated PreRequisite relationship
    preRequisites.forEach((preRequisiteId) => {
      const oppositeRelationships = allCourses[preRequisiteId].relationships;

      if (
        oppositeRelationships.preRequisites.some(
          (oppositePreRequisiteId) => oppositePreRequisiteId === preRequisiteId
        )
      ) {
        _pull(preRequisites, preRequisiteId);
      }
    });
    //#endregion

    //#region Remove duplicated CoRequisite relationship
    coRequisites.forEach((coRequisiteId) => {
      const oppositeRelationships = allCourses[coRequisiteId].relationships;

      if (
        oppositeRelationships.coRequisites.some(
          (oppositeCoRequisiteId) => oppositeCoRequisiteId === coRequisiteId
        )
      ) {
        _pull(coRequisites, coRequisiteId);
      }
    });
    //#endregion

    //#region Remove duplicated Previous relationship
    previous.forEach((previousId) => {
      const oppositeRelationships = allCourses[previousId].relationships;

      if (
        oppositeRelationships.previous.some(
          (oppositePreviousId) => oppositePreviousId === previousId
        )
      ) {
        _pull(previous, previousId);
      }
    });
    //#endregion

    //#region Remove duplicated Placeholder relationship
    placeholders.forEach((placeholderId) => {
      const oppositeRelationships = allCourses[placeholderId].relationships;

      if (
        oppositeRelationships.previous.some(
          (oppositePlaceholderId) => oppositePlaceholderId === placeholderId
        )
      ) {
        _pull(placeholders, placeholderId);
      }
    });
    //#endregion

    allCourses[courseId].relationships = {
      preRequisites: preRequisites,
      coRequisites: coRequisites,
      previous: previous,
      placeholders: placeholders,
    };
  });

  return {
    allCourses,
    allCourseIds,
  };
};

export const getRandomMajors = (config: IRange) => {
  let promise = new Promise<IRandomMajorsReturn>(function (resolve, reject) {
    setTimeout(function () {
      resolve(generateRandomMajors(config));
    }, 2000);
  });
  return promise;
};

export const getRandomCourses = (config: IRandomCoursesParam) => {
  let promise = new Promise<IRandomCoursesReturn>(function (resolve, reject) {
    setTimeout(function () {
      resolve(generateRandomCourses(config));
    }, 2000);
  });
  return promise;
};
