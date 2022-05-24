import type { Node, Edge } from "react-flow-renderer";
import type { IRandomCurriculumDetailItemReturn } from "src/types/Curriculum.type";
import type { ICourseItemSimple } from "src/types/Course.type";

import { Position, MarkerType } from "react-flow-renderer";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";

import { store } from "src/redux/_store";
import { CurriculumCommandType } from "src/constants/curriculum.const";
import {
  addCourseRelationship,
  selectCourses,
  removeCourseRelationship,
  removeSelectedCourses,
  addCourses,
  removeSelectedCourse,
  selectCourse,
} from "src/redux/courses.slice";
import {
  // undo,
  // redo,
  // addChangeToHistory,
  addCurriculumDetailCourses,
  addCurriculumDetailYear,
  removeCurriculumDetailCourse,
  removeCurriculumDetailCourses,
  addCurriculumDetailCourse,
} from "src/redux/curriculums.slice";
import { addChangeToHistory } from "src/redux/curriculumChangeHistory.slice";

const courseNodeStyle = {
  width: 120,
  height: 80,
  offsetY: 20,
};

const addCourseBtnStyle = {
  width: courseNodeStyle.width,
  height: 40,
};

const semesterStyle = {
  width: courseNodeStyle.width + 20,
  paddingX: 13,
  offsetX: 125,
};

// interface IGetDndNodesAndEdges extends IRandomCurriculumDetailItemReturn {
//   allCourses: Record<string, ICourseItemSimple>;
// }

export const getDndNodesAndEdges = (): { nodes: Node[]; edges: Edge[] } => {
  let nodesTemp: Node[] = [];
  let edgesTemp: Edge[] = [];

  const allYears = store.getState().curriculums.curriculumDetail.allYears;
  const allYearIdsOrder =
    store.getState().curriculums.curriculumDetail.allYearsOrder;
  const allCourses = store.getState().courses.courses;

  if (allYearIdsOrder.length === 0) {
    return {
      nodes: nodesTemp,
      edges: edgesTemp,
    };
  }

  let semCount = 0;
  let summerCount = 0;
  let courseOrders: string[] = [];

  // #region Step 1: Generate data for comparison
  let curriculumBefore = {
    byYearId: {},
    allYearIds: [],
  };
  let curriculumAfter = {
    byYearId: {},
    allYearIds: [],
  };

  // #region Step 1.1: get current
  allYearIdsOrder.forEach((yearId, yearIndex) => {});
  // #endregion

  return {
    nodes: nodesTemp,
    edges: edgesTemp,
  };
};
