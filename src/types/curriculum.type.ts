import { Mode } from "src/constants/mode";

export interface ICurriculumItemSimple {
  id: string;
  year: number;
  programType?: string;
  major: string;
  subMajor?: string | null;
  englishLevel?: string | null;
}

export interface ICurriculumItemYear {
  id: string;
  semesters: {
    [semId: string]: ICurriculumItemSemester;
  };
  semestersOrder: string[];
}

export interface ICurriculumItemSemester {
  id: string;
  courseIds: string[];
}

export interface ICurriculumItemDetail extends ICurriculumItemSimple {
  mode: Mode.CREATE | Mode.EDIT;
  semCountPerYear: number;
  years: {
    [yearId: string]: ICurriculumItemYear;
  };
  yearsOrder: number[];
}
