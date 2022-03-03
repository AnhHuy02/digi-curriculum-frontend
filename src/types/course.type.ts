import { IRandomRange } from "./others.type";

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
  disabled: boolean;
  selected: boolean;
  // tempSelected: boolean;
  highlighted?: boolean;
  relationship?: ICourseRelationship;
}

export interface ICourseItemDetail {
  id: string;
  name: string;
  credit: number;
  majorId: string;
}

export interface IRandomCoursesParam {
  allMajorIds: string[];
  randomCourseCount?: IRandomRange;
  nameLength?: IRandomRange;
  creditCount?: {
    theory?: IRandomRange;
    practice?: IRandomRange;
  };
  courseRelationship?: {
    preRequisite?: IRandomRange;
    previous?: IRandomRange;
    coRequisite?: IRandomRange;
    placeholder?: IRandomRange;
  };
}
