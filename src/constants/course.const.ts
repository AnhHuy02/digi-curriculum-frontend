export enum CourseType {
  GENERAL = "General",
  SPECIALIZATION_REQUIRED = "Specialization (required)",
  SPECIALIZATION_ELECTIVE = "Specialization (elective)",
  FUNDAMENTAL = "Fundamental",
  PROJECT_INTERN_THESIS = "Project/Intership/Thesis",
  OTHERS = "Others",
}

export enum CourseRelationship {
  PREREQUISITE = "Prerequisite",
  COREQUISITE = "Corequisite",
  PREVIOUS = "Previous",
  PLACEHOLDER = "Placeholder",
}

export const CourseTypesWithName = {
  general: {
    name: CourseType.GENERAL.toString(),
    nameVN: "Chung",
  },
  specializationRequired: {
    // chuyên ngành - bắt buộc
    name: CourseType.SPECIALIZATION_REQUIRED.toString(),
    nameVN: "CN BB",
  },
  specializationElective: {
    // chuyên ngành - tự chọn
    name: CourseType.SPECIALIZATION_ELECTIVE.toString(),
    nameVN: "CN TC",
  },
  fundamental: {
    // cơ sở ngành
    name: CourseType.FUNDAMENTAL.toString(),
    nameVN: "CSN",
  },
  projectInternThesis: {
    // thực tập - luận văn
    name: CourseType.PROJECT_INTERN_THESIS.toString(),
    nameVN: "TT-LV",
  },
  others: {
    name: CourseType.OTHERS.toString(),
    nameVN: "Khác",
  },
};
