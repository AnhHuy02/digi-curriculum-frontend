import type { IRange } from "./others.type";

import { CourseType } from "src/constants/course.const";

export interface ICourseRelationship {
  preRequisites: string[];
  coRequisites: string[];
  previous: string[];
  placeholders: string[];
}

export interface ICourseItemSimple {
  id: string;
  name: string;
  credit: {
    theory: number;
    practice: number;
  };
  majorId: string;
  type: CourseType | string;
  disabled: boolean;
  selected: boolean;
  selectedTemp: boolean;
  highlighted?: boolean;
  relationship: ICourseRelationship;
}

export interface ICourseItemDetail {
  id: string;
  name: string;
  credit: number;
  majorId: string;
}

export interface IRandomCoursesParam {
  allMajorIds: string[];
  randomCourseCount?: IRange;
  nameLength?: IRange;
  creditCount?: {
    theory?: IRange;
    practice?: IRange;
  };
  courseRelationship?: {
    preRequisite?: IRange;
    previous?: IRange;
    coRequisite?: IRange;
    placeholder?: IRange;
  };
  courseTypeDistribution?: ICourseTypeDistribution[];
}

export interface IRandomCoursesReturn {
  allCourses: Record<string, ICourseItemSimple>;
  allCourseIds: string[];
}

export interface ICourseTypeDistribution {
  id: string;
  frequency: number;
}
