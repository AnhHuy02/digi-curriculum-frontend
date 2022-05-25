import type { Node, Edge } from "react-flow-renderer";
import type { IRandomCurriculumDetailItemReturn } from "src/types/Curriculum.type";
import type { ICourseItemSimple } from "src/types/Course.type";
import type { RootState } from "src/redux/_store";

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

const courseCellContainerStyle = {
  paddingX: 40,
  paddingY: 10,
};

const distanceBetweenTwoCourses = 160;

const courseBeforeSourceX = courseCellContainerStyle.paddingX;
const courseBeforeTargetX =
  courseBeforeSourceX + courseNodeStyle.width + distanceBetweenTwoCourses;
const courseAfterSourceX =
  courseBeforeTargetX +
  courseNodeStyle.width +
  courseCellContainerStyle.paddingX * 2;
const courseAfterTargetX =
  courseAfterSourceX + courseNodeStyle.width + distanceBetweenTwoCourses;

const semesterStyle = {
  width: courseNodeStyle.width + 20,
  paddingX: 13,
  offsetX: 125,
};

// interface IGetDndNodesAndEdges extends IRandomCurriculumDetailItemReturn {
//   allCourses: Record<string, ICourseItemSimple>;
// }

interface IMergedTwoCurriculums {
  byYearId: Record<
    number,
    {
      semesters: Record<number, { courseIds: string[] }>;
      semestersOrder: number[];
    }
  >;
  allYearIds: number[];
}

export const getDndNodesAndEdges = (): { nodes: Node[]; edges: Edge[] } => {
  let nodesTemp: Node[] = [];
  let edgesTemp: Edge[] = [];

  const { coursesBefore, curriculumBefore } = (store.getState() as RootState)
    .curriculumChangeHistory;
  const { currentIndex, commandLogs } = (store.getState() as RootState)
    .curriculumChangeHistory.changeHistory;
  const { courses: coursesAfter } = store.getState() as RootState;
  const { curriculumDetail: curriculumAfter } = (store.getState() as RootState)
    .curriculums;

  // #region Step 1: Merge before and after curriculums
  // (because of multiple levels of nested object)
  // No need for merging courses (1 level of nested object)
  let mergedTwoCurriculums: IMergedTwoCurriculums = {
    byYearId: {},
    allYearIds: [],
  };
  {
    // #region Step 1.1: Combine year ids by index
    let { byYearId, allYearIds } = mergedTwoCurriculums;
    const mapYearIdsBefore = curriculumBefore.allYearsOrder.map(
      (yearId, yearIndex) => yearIndex
    );
    const mapYearIdsAfter = curriculumAfter.allYearsOrder.map(
      (yearId, yearIndex) => yearIndex
    );
    const combineYearIds = new Set([...mapYearIdsBefore, ...mapYearIdsAfter]);

    allYearIds.push(...Array.from(combineYearIds));
    allYearIds.forEach((yearId, yearIndex) => {
      // #region Step 1.2: Combine semester ids by index
      const yearIdBefore = curriculumBefore.allYearsOrder[yearIndex];
      const mapSemIdsBefore =
        curriculumBefore.allYears[yearIdBefore]?.semestersOrder.map(
          (semId, semIndex) => semIndex
        ) || [];

      const yearIdAfter = curriculumAfter.allYearsOrder[yearIndex];
      const mapSemIdsAfter =
        curriculumAfter.allYears[yearIdAfter]?.semestersOrder.map(
          (semId, semIndex) => semIndex
        ) || [];

      const combineSemIds = new Set([...mapSemIdsBefore, ...mapSemIdsAfter]);

      byYearId[yearIndex] = {
        semesters: {},
        semestersOrder: [],
      };

      const currentYear = byYearId[yearIndex];
      currentYear.semestersOrder.push(...Array.from(combineSemIds));
      currentYear.semestersOrder.forEach((semId, semIndex) => {
        // #region Step 1.3: Combine course ids
        const semIdBefore =
          curriculumBefore.allYears[yearIdBefore]?.semestersOrder[semIndex] ||
          -1;
        const mapCourseIdsBefore =
          curriculumBefore.allYears[yearIdBefore]?.semesters[semIdBefore]
            ?.courseIds || [];

        const semIdAfter =
          curriculumAfter.allYears[yearIdAfter]?.semestersOrder[semIndex] || -1;
        const mapCourseIdsAfter =
          curriculumAfter.allYears[yearIdAfter]?.semesters[semIdAfter]
            ?.courseIds || [];

        const combineCourseIds = new Set([
          ...mapCourseIdsBefore,
          ...mapCourseIdsAfter,
        ]);

        currentYear.semesters[semIndex] = {
          courseIds: Array.from(combineCourseIds),
        };
        // #endregion
      });
      // #endregion
    });
    // #endregion
  }
  // #endregion

  console.log(mergedTwoCurriculums);

  // #region Step 2: Create nodes and edges
  let courseCount = 0;
  mergedTwoCurriculums.allYearIds.forEach((yearId, yearIndex) => {
    // #region Step 2.1: Render year nodes for text
    const { semesters, semestersOrder } = mergedTwoCurriculums.byYearId[yearId];

    semestersOrder.forEach((semId, semIndex) => {
      const { courseIds } = semesters[semId];

      courseIds.forEach((courseId) => {
        const courseBefore = coursesBefore.byId[courseId];
        const courseAfter = coursesAfter.courses[courseId];

        const courseTargetIdsBefore = courseBefore
          ? new Set([
              ...courseBefore.relationships.preRequisites,
              ...courseBefore.relationships.coRequisites,
              ...courseBefore.relationships.previous,
              ...courseBefore.relationships.placeholders,
            ])
          : [];
        let mergedTargetCourseIdsBefore = Array.from(courseTargetIdsBefore);

        if (courseBefore) {
          const relationshipsBefore = courseBefore.relationships;
          const relationshipsAfter = courseAfter.relationship;

          mergedTargetCourseIdsBefore.forEach((targetId, targetIndex) => {
            const parentCellId = `bg-before-${courseCount}`;

            // push one background behind for each target
            nodesTemp.push({
              id: parentCellId,
              type: "group",
              data: {},
              draggable: false,
              position: {
                x: 0,
                y:
                  (courseNodeStyle.height + courseCellContainerStyle.paddingY) *
                  courseCount,
              },
              style: {
                zIndex: -1,
              },
            });

            // push one source
            if (targetIndex === 0) {
              nodesTemp.push({
                id: `source-before-${courseCount}`,
                type: "node",
                parentNode: parentCellId,
                data: {
                  label: courseBefore.name,
                },
                draggable: false,
                position: {
                  x: courseBeforeSourceX,
                  y:
                    courseCellContainerStyle.paddingY +
                    (courseNodeStyle.height +
                      courseCellContainerStyle.paddingY) *
                      courseCount,
                },
                style: {
                  zIndex: 0,
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
              });
            }

            // push one target
            // case 1: add relationship (no id match on before, but match on after)
            let courseTargetNode: Node = {
              id: `target-before-${courseCount}-${targetIndex}`,
              type: "node",
              parentNode: parentCellId,
              data: {
                label: courseBefore.name,
              },
              draggable: false,
              position: {
                x: courseAfterSourceX,
                y:
                  courseCellContainerStyle.paddingY +
                  (courseNodeStyle.height + courseCellContainerStyle.paddingY) *
                    courseCount,
              },
              style: {
                zIndex: 0,
              },
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
            };
            if (
              [
                ...relationshipsBefore.preRequisites,
                ...relationshipsBefore.coRequisites,
                ...relationshipsBefore.previous,
                ...relationshipsBefore.placeholders,
              ].includes(targetId)
            ) {
              courseTargetNode.style = {
                fill: "rgba(213, 232, 212, 1.0)",
              };
              nodesTemp.push(courseTargetNode);
            } 
            // else if (
            //   [
            //     ...relationshipsAfter.preRequisites,
            //     ...relationshipsAfter.coRequisites,
            //     ...relationshipsAfter.previous,
            //     ...relationshipsAfter.placeholders,
            //   ].includes(courseId)
            // ) {
            //   courseTargetNode.style = {
            //     fill: "#ec827e",
            //   };
            //   nodesTemp.push(courseTargetNode);
            // }

            // push one edge
            // if (courseBefore.relationships.preRequisites)
          });
        }
        if (courseAfter) {
          nodesTemp.push({
            id: `after-source-${courseId}`,
            type: "node",
            data: {
              label: courseBefore.name,
            },
            draggable: false,
            position: {
              x: courseAfterSourceX,
              y: -40,
            },
          });
        }

        ++courseCount;
      });
    });
    // #endregion
  });
  // #endregion

  return {
    nodes: nodesTemp,
    edges: edgesTemp,
  };
};
