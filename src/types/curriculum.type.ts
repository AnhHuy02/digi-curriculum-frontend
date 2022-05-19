import type { IRange } from "./others.type";
import type { ChangeHistory, PayloadHistoryAction } from "./changeHistory.type";
import type { ICourseItemSimple } from "./course.type";

import { Mode } from "src/constants/mode.const";
import { CourseRelationship } from "src/constants/course.const";
import { UndoCommandType } from "src/constants/curriculum.const";

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

export type CurriculumDetailHistoryAction =
  | PayloadHistoryAction<
      UndoCommandType.ADD_COURSE_RELATIONSHIP,
      {
        courseSourceId: string;
        courseTargetId: string;
        relationship: CourseRelationship;
      }
    >
  | PayloadHistoryAction<
      UndoCommandType.REMOVE_COURSE_RELATIONSHIP,
      {
        courseSourceId: string;
        courseTargetId: string;
        relationship: CourseRelationship;
      }
    >
  | PayloadHistoryAction<
      UndoCommandType.CHANGE_COURSE_RELATIONSHIP,
      {
        courseSourceId: string;
        courseTargetId: string;
        oldRelationship: CourseRelationship;
        newRelationship: CourseRelationship;
      }
    >
  | PayloadHistoryAction<
      UndoCommandType.ADD_COURSES_TO_SEMESTER,
      {
        yearId: string;
        semId: string;
        courseIds: string[];
      }
    >
  | PayloadHistoryAction<
      UndoCommandType.REMOVE_COURSE_FROM_SEMESTER,
      {
        yearId: string;
        semId: string;
        courseId: string;
      }
    >;

export interface ICurriculumItemDetail extends ICurriculumItemSimple {
  mode: Mode.CREATE | Mode.EDIT;
  loading: boolean;
  semCountPerYear: number;
  allYears: Record<string, ICurriculumItemYear>;
  allYearsOrder: string[];
  allElectiveGroups?: Record<string, IElectiveGroupItem>;
  allElectiveGroupIds?: string[];
  changeHistory: ChangeHistory<CurriculumDetailHistoryAction>;
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
