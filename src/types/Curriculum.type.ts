import type { IRange } from "./Others.type";
import type { PayloadHistoryAction } from "./ChangeHistory.type";
import type { IMajor } from "./Department.type";
import type { ICourse } from "./Course.type";
import type { ArrayNormalizer } from "./Normalizer.type";

import { Mode } from "src/constants/mode.const";
import { CourseRelationship } from "src/constants/course.const";
import { CurriculumCommandType } from "src/constants/curriculum.const";

export interface ICurriculum {
  id: string;
  year: number;
  name?: string;
  programType?: string;
  major?: string;
  subMajor?: string | null;
  englishLevel?: string | null;
  semCountPerYear: number;

  years: ArrayNormalizer<ICurriculumItemYear>;
}

export interface ICurriculumItemYear {
  id: string;
  semesters: ArrayNormalizer<ICurriculumItemSemester>;
}

export interface ICurriculumItemSemester {
  id: string;
  courseIds: string[];
  creditCount: number;
  creditLimit: number;
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
        yearIndex: number;
        semId: string;
        semIndex: number;
        courseIds: string[];
      }
    >
  | PayloadHistoryAction<
      CurriculumCommandType.REMOVE_COURSE_FROM_SEMESTER,
      {
        yearId: string;
        yearIndex: number;
        semId: string;
        semIndex: number;
        courseId: string;
      }
    >
  | PayloadHistoryAction<
      CurriculumCommandType.CHANGE_COURSE_BETWEEN_TWO_SEMESTER,
      {
        courseId: string;
        sourceYearId: string;
        sourceYearIndex: number;
        sourceSemId: string;
        sourceSemIndex: number;
        sourceTakeoutIndex: number;
        targetYearId: string;
        targetYearIndex: number;
        targetSemId: string;
        targetSemIndex: number;
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
        yearDetail: ICurriculumItemYear;
      }
    >;

export interface ICurriculumItemDetail extends ICurriculum {
  mode: Mode.CREATE | Mode.EDIT;
  loading: boolean;
}

export interface IRandomCurriculumDetailParam {
  majors: ArrayNormalizer<IMajor>;
  courses: ArrayNormalizer<ICourse>;
  randomYearCount?: IRange;
  semesterPerYearCount?: number;
  randomCreditCountPerSemester?: IRange;
}
