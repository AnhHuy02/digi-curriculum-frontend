import type { IMajorSimple } from "src/types/department.type";
import type {
  ICourseItemSimple,
  IRandomCoursesParam,
} from "src/types/course.type";
import type { IRandomRange } from "src/types/others.type";

import faker from "@faker-js/faker";
import _sample from "lodash/sample";
import _sampleSize from "lodash/sampleSize";
import _pullAll from "lodash/pullAll";
import _includes from "lodash/includes";

interface IRandomMajorsReturn {
  allMajors: Record<string, IMajorSimple>;
  allMajorIds: string[];
}

interface IRandomCoursesReturn {
  allCourses: Record<string, ICourseItemSimple>;
  allCourseIds: string[];
}

export function generateRandomMajors({
  min,
  max,
}: IRandomRange): IRandomMajorsReturn {
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
}

////////////////////////////////////////////////////////////////////////
export const generateRandomCourses = ({
  allMajorIds,
  randomCourseCount = { min: 0, max: 150 },
  nameLength = { min: 1, max: 7 },
  creditCount = {
    theory: { min: 0, max: 10 },
    practice: { min: 0, max: 10 },
  },
  courseRelationship = {
    preRequisite: { min: 0, max: 4 },
    previous: { min: 0, max: 4 },
    coRequisite: { min: 0, max: 4 },
    placeholder: { min: 0, max: 4 },
  },
}: IRandomCoursesParam): IRandomCoursesReturn => {
  const courseCount = faker.datatype.number({
    min: randomCourseCount.min,
    max: randomCourseCount.max,
  });

  // Step 1: Initialize random courses
  let allCourses: Record<string, ICourseItemSimple> = {};
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
      disabled: false,
      selected: false,
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

    allCourses[courseId].relationship = {
      preRequisites: randomPreRequisiteIds,
      coRequisites: randomCoRequisiteIds,
      previous: randomPreviousIds,
      placeholders: randomPlaceHolderIds,
    };
  });

  return {
    allCourses,
    allCourseIds,
  };
};

export const getRandomMajors = (config: IRandomRange) => {
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
