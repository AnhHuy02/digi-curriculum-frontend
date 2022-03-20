import type { IRange } from "./others.type";
import type { ICourseItemSimple } from "./course.type";

import { Mode } from "src/constants/mode.const";

export interface ICurriculumItemSimple {
  id: string;
  year: number;
  programType?: string;
  major?: string;
  subMajor?: string | null;
  englishLevel?: string | null;
}

export interface ICurriculumItemYear {
  id: string;
  semesters: Record<string, ICurriculumItemSemester>;
  semestersOrder: string[];
}

export interface ICurriculumItemSemester {
  id: string;
  courseIds: string[];
  creditCount: number;
  creditLimit: number;
}

export interface IElectiveGroupItem {
  electiveGroupIds: string[];
  courseIds: string[];
}

export interface ICurriculumItemDetail extends ICurriculumItemSimple {
  mode: Mode.CREATE | Mode.EDIT;
  loading: boolean;
  semCountPerYear: number;
  allYears: Record<string, ICurriculumItemYear>;
  allYearsOrder: string[];
  allElectiveGroups?: Record<string, IElectiveGroupItem>;
  allElectiveGroupIds?: string[];
}

interface IElectiveGroup {
  electiveId: string[];
  courseIds: string[];
}

export interface IRandomCurriculumDetailParam {
  allCourses: Record<string, ICourseItemSimple>;
  allCourseIds: string[];
  // year?: number | string;
  randomYearCount?: IRange;
  semesterPerYearCount?: number;
  courseCountPerSemester?: IRange;
  // creditLimit?: {
  //   normalSemester?: IRandomRange;
  //   summerSemester?: IRandomRange;
  // };
  randomCreditCountPerSemester?: IRange;
  electiveGroups?: Record<string, IElectiveGroup>;
  electiveGroupIds?: string[];
}

export interface IRandomCurriculumDetailItemReturn {
  allYears: Record<string, ICurriculumItemYear>;
  allYearIdsOrder: string[];
}
