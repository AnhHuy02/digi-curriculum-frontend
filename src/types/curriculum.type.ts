import type { IRange } from "./Others.type";
import type { PayloadHistoryAction } from "./ChangeHistory.type";
import type { ICourseItemSimple } from "./Course.type";

import { Mode } from "src/constants/mode.const";
import { CourseRelationship } from "src/constants/course.const";
import { CurriculumCommandType } from "src/constants/curriculum.const";

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
      CurriculumCommandType.ADD_COURSE_RELATIONSHIP,
      {
        courseSourceId: string;
        courseTargetId: string;
        relationship: CourseRelationship;
      }
    >
  | PayloadHistoryAction<
      CurriculumCommandType.REMOVE_COURSE_RELATIONSHIP,
      {
        courseSourceId: string;
        courseTargetId: string;
        relationship: CourseRelationship;
      }
    >
  | PayloadHistoryAction<
      CurriculumCommandType.CHANGE_COURSE_RELATIONSHIP,
      {
        courseSourceId: string;
        courseTargetId: string;
        oldRelationship: CourseRelationship;
        newRelationship: CourseRelationship;
      }
    >
  | PayloadHistoryAction<
      CurriculumCommandType.ADD_COURSES_TO_SEMESTER,
      {
        yearId: string;
        semId: string;
        courseIds: string[];
      }
    >
  | PayloadHistoryAction<
      CurriculumCommandType.REMOVE_COURSE_FROM_SEMESTER,
      {
        yearId: string;
        semId: string;
        courseId: string;
      }
    >
  | PayloadHistoryAction<
      CurriculumCommandType.CHANGE_COURSE_BETWEEN_TWO_SEMESTER,
      {
        courseId: string;
        sourceYearId: string;
        sourceSemId: string;
        sourceTakeoutIndex: number;
        targetYearId: string;
        targetSemId: string;
        targetInsertIndex: number;
      }
    >
  | PayloadHistoryAction<
      CurriculumCommandType.CHANGE_YEAR_ORDER,
      {
        yearId: string;
        sourceTakeoutIndex: number;
        targetInsertIndex: number;
      }
    >
  | PayloadHistoryAction<CurriculumCommandType.ADD_YEAR, {}>
  | PayloadHistoryAction<
      CurriculumCommandType.REMOVE_YEAR,
      {
        yearId: string;
        yearIndex: number;
        yearDetail: {
          semesters: Record<string, ICurriculumItemSemester>;
          semestersOrder: string[];
        };
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
