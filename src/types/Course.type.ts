import type { IMajor } from "./Department.type";
import type { IRange } from "./Others.type";
import type { ArrayNormalizer } from "./Normalizer.type";

import { CourseType } from "src/constants/course.const";

export interface ICourseRelationship {
  preRequisites: string[];
  coRequisites: string[];
  previous: string[];
  placeholders: string[];
}

export interface ICourse {
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
  relationships: ICourseRelationship;
  difficulty: number;
  rating: number;
}

export interface ICourseItemDetail {
  id: string;
  name: string;
  credit: number;
  majorId: string;
}

export interface IRandomCoursesParam {
  majors: ArrayNormalizer<IMajor>;
  randomCourseCount?: IRange;
  nameLength?: IRange;
  creditCount?: {
    theory?: IRange;
    practice?: IRange;
  };
  relationships?: {
    preRequisite?: IRange;
    previous?: IRange;
    coRequisite?: IRange;
    placeholder?: IRange;
  };
  courseTypeDistribution?: ICourseTypeDistribution[];
}

export interface ICourseTypeDistribution {
  id: string;
  frequency: number;
}
