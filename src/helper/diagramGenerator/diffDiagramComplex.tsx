import type { Node, Edge } from "react-flow-renderer";
import type { IRandomCurriculumDetailItemReturn } from "src/types/Curriculum.type";
import type { ICourseItemSimple } from "src/types/Course.type";
import type { RootState } from "src/redux/_store";

import _intersection from "lodash/intersection";
import _difference from "lodash/difference";
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
import { CSSProperties } from "react";

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

const basePosistion = {
  x: 0,
  y: -40,
};

const courseBeforeSourceX = courseCellContainerStyle.paddingX;
const courseBeforeTargetX =
  courseBeforeSourceX + courseNodeStyle.width + distanceBetweenTwoCourses;
const courseAfterSourceX =
  courseBeforeTargetX +
  courseNodeStyle.width +
  courseCellContainerStyle.paddingX * 2;
const courseAfterTargetX =
  courseAfterSourceX + courseNodeStyle.width + distanceBetweenTwoCourses;

const courseCellStyle = {
  width:
    courseCellContainerStyle.paddingX * 2 +
    courseNodeStyle.width * 2 +
    distanceBetweenTwoCourses,
  height: courseNodeStyle.height + courseCellContainerStyle.paddingY * 2,
};

const semesterStyle = {
  width: courseNodeStyle.width + 20,
  paddingX: 13,
  offsetX: 125,
};

const BG_BEFORE_STATUS_COLOR = {
  UNCHANGED: "rgb(255, 255, 255)",
  ADDED: "rgb(245, 245, 245)",
  REMOVED: "rgb(248, 206, 204)",
};
const BG_AFTER_STATUS_COLOR = {
  UNCHANGED: "rgb(255, 255, 255)",
  ADDED: "rgb(213, 232, 212)",
  REMOVED: "rgb(245, 245, 245)",
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
  let mergedCourseIds: string[] = [];
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

        mergedCourseIds.push(...Array.from(combineCourseIds));
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
  let beforePositionSource = {
    x: 0,
    y: 0,
  };
  let beforePositionTarget = {
    x: courseAfterSourceX,
    y: 0,
  };
  let afterPositionSource = {
    x: 0,
    y: 0,
  };
  let afterPositionTarget = {
    x: 0,
    y: 0,
  };
  mergedTwoCurriculums.allYearIds.forEach((yearId, yearIndex) => {
    const { semesters, semestersOrder } = mergedTwoCurriculums.byYearId[yearId];

    semestersOrder.forEach((semId, semIndex) => {
      const { courseIds: combinedCourseIds } = semesters[semId];

      const yearIdBefore = curriculumBefore?.allYearsOrder[yearIndex];
      const yearBefore = curriculumBefore?.allYears[yearIdBefore];
      const semIdBefore = yearBefore?.semestersOrder[semIndex];
      const semBefore = yearBefore?.semesters[semIdBefore];
      const courseIdsBefore = semBefore?.courseIds || [];

      const yearIdAfter = curriculumAfter?.allYearsOrder[yearIndex];
      const yearAfter = curriculumAfter?.allYears[yearIdAfter];
      const semIdAfter = yearAfter?.semestersOrder[semIndex];
      const semAfter = yearAfter?.semesters[semIdAfter];
      const courseIdsAfter = semAfter?.courseIds || [];

      const similarCourseIds = _intersection(courseIdsBefore, courseIdsAfter);
      const filteredCourseIdsBefore = _intersection(
        courseIdsBefore,
        combinedCourseIds
      );
      const filteredCourseIdsAfter = _intersection(
        courseIdsAfter,
        combinedCourseIds
      );

      console.table("similarCourseIds", similarCourseIds);
      console.table("filteredCourseIdsBefore", filteredCourseIdsBefore);
      console.table("filteredCourseIdsAfter", filteredCourseIdsAfter);
      console.log("................................................");

      // #region Step 2.1: Render year + semester text for seperation

      // #endregion

      // #region Step 2.2: Render all before + after courses
      combinedCourseIds.forEach((courseId, courseIndex) => {
        const foundSourceIdBefore = filteredCourseIdsBefore.includes(courseId);
        const foundSourceIdAfter = filteredCourseIdsAfter.includes(courseId);

        const courseBefore = coursesBefore.byId[courseId];
        const courseAfter = coursesAfter.courses[courseId];

        const parentCellBeforeId = `bg-before-${courseCount}`;
        const parentCellAfterId = `bg-after-${courseCount}`;
        const sourceBeforeId = `before-source-${courseCount}`;
        const sourceAfterId = `after-source-${courseCount}`;

        // Get only courses ids inside a merged curriculum, not outside
        const courseTargetIdsBefore = new Set(
          courseBefore
            ? [
                ...courseBefore.relationships.preRequisites,
                ...courseBefore.relationships.coRequisites,
                ...courseBefore.relationships.previous,
                ...courseBefore.relationships.placeholders,
              ].filter((courseId) => mergedCourseIds.includes(courseId))
            : []
        );
        const courseTargetIdsAfter = new Set(
          courseAfter
            ? [
                ...courseAfter.relationships.preRequisites,
                ...courseAfter.relationships.coRequisites,
                ...courseAfter.relationships.previous,
                ...courseAfter.relationships.placeholders,
              ].filter((courseId) => mergedCourseIds.includes(courseId))
            : []
        );
        const courseTargetIdsBoth = new Set(
          ...[courseTargetIdsBefore, courseTargetIdsAfter]
        );

        let mergedTargetCourseIdsBefore = Array.from(courseTargetIdsBefore);
        let mergedTargetCourseIdsAfter = Array.from(courseTargetIdsAfter);
        let mergedTargetBoth = Array.from(courseTargetIdsBoth);

        const courseCellY =
          (courseNodeStyle.height + courseCellContainerStyle.paddingY * 2) *
          courseCount;

        let courseCellBefore: Node = {
          id: parentCellBeforeId,
          type: "group",
          data: {},
          draggable: false,
          position: {
            x: 0,
            y: courseCellY,
          },
          style: {
            zIndex: -1,
            backgroundColor: BG_BEFORE_STATUS_COLOR.UNCHANGED,
            width: courseCellStyle.width,
            height: courseCellStyle.height,
          },
        };
        let courseCellAfter: Node = {
          id: parentCellAfterId,
          type: "group",
          data: {},
          draggable: false,
          position: {
            x: courseAfterTargetX,
            y: courseCellY,
          },
          style: {
            zIndex: -1,
            backgroundColor: BG_AFTER_STATUS_COLOR.UNCHANGED,
            width: courseCellStyle.width,
            height: courseCellStyle.height,
          },
        };
        let courseSourceBefore: Node = {
          id: sourceBeforeId,
          type: "input",
          data: {
            label: courseBefore.name,
          },
          draggable: false,
          position: {
            x: 0,
            y: courseCellY,
          },
          style: {
            zIndex: 1,
            width: courseNodeStyle.width,
            height: courseNodeStyle.height,
          },
          parentNode: parentCellBeforeId,
          extent: "parent",
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        };
        let courseSourceAfter: Node = {
          id: sourceAfterId,
          type: "input",
          data: {
            label: courseBefore.name,
          },
          draggable: false,
          position: {
            x: 0,
            y: courseCellY,
          },
          style: {
            zIndex: 1,
            width: courseNodeStyle.width,
            height: courseNodeStyle.height,
          },
          parentNode: parentCellBeforeId,
          extent: "parent",
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        };
        let courseTargetsBefore: Node[] = [];
        let courseTargetsAfter: Node[] = [];
        let edgesBefore: Node[] = [];
        let edgesAfter: Node[] = [];

        // #region Render cell color based on course
        if (foundSourceIdBefore || foundSourceIdAfter) {
          mergedTargetBoth.forEach((bothTargetId, bothTargetIndex) => {
            let courseTargetBefore: Node = {
              id: `before-target-${courseCount}-${bothTargetIndex}`,
              type: "output",
              data: {
                label: courseBefore.name,
              },
              draggable: false,
              position: {
                x: 0,
                y: courseCellY,
              },
              style: {
                zIndex: 1,
                width: courseNodeStyle.width,
                height: courseNodeStyle.height,
              },
              parentNode: parentCellBeforeId,
              extent: "parent",
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
            };
            let courseTargetAfter: Node = {
              id: `after-target-${courseCount}-${bothTargetIndex}`,
              type: "output",
              data: {
                label: courseBefore.name,
              },
              draggable: false,
              position: {
                x: 0,
                y: courseCellY,
              },
              style: {
                zIndex: 1,
                width: courseNodeStyle.width,
                height: courseNodeStyle.height,
              },
              parentNode: parentCellBeforeId,
              extent: "parent",
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
            };
            let relationshipEdgeBefore: Edge = {
              id: `before-relationship-${courseCount}-${bothTargetIndex}`,
              label: "",
              source: sourceBeforeId,
              target: bothTargetId,
              markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
              labelBgStyle: {
                backgroundColor: "none",
              },
            };
            let relationshipEdgeAfter: Edge = {
              id: `before-relationship-${courseCount}-${bothTargetIndex}`,
              label: "",
              source: sourceAfterId,
              target: bothTargetId,
              markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
              labelBgStyle: {
                backgroundColor: "none",
              },
            };

            // const foundTargetIdBefore =
            //   mergedTargetCourseIdsBefore.includes(bothTargetId);
            // const foundTargetIdAfter =
            //   mergedTargetCourseIdsAfter.includes(bothTargetId);

            if (
              courseBefore.relationships.preRequisites.includes(bothTargetId)
            ) {
              relationshipEdgeBefore.label = "prerequisite";
            } else if (
              courseBefore.relationships.coRequisites.includes(bothTargetId)
            ) {
              relationshipEdgeBefore.label = "corequisite";
            } else if (
              courseBefore.relationships.previous.includes(bothTargetId)
            ) {
              relationshipEdgeBefore.label = "previous";
            } else if (
              courseBefore.relationships.placeholders.includes(bothTargetId)
            ) {
              relationshipEdgeBefore.label = "placeholder";
            }

            if (
              courseAfter.relationships.preRequisites.includes(bothTargetId)
            ) {
              relationshipEdgeAfter.label = "prerequisite";
            } else if (
              courseAfter.relationships.coRequisites.includes(bothTargetId)
            ) {
              relationshipEdgeAfter.label = "corequisite";
            } else if (
              courseAfter.relationships.previous.includes(bothTargetId)
            ) {
              relationshipEdgeAfter.label = "previous";
            } else if (
              courseAfter.relationships.placeholders.includes(bothTargetId)
            ) {
              relationshipEdgeAfter.label = "placeholder";
            }
            
            if (relationshipEdgeBefore.label === relationshipEdgeAfter.label) {
              // UNCHANGED
              
            }
          });

          if (!foundSourceIdBefore && foundSourceIdAfter) {
            // ADD COURSE
            (courseCellBefore.style as CSSProperties).backgroundColor = "red";
            (courseCellAfter.style as CSSProperties).backgroundColor =
              BG_AFTER_STATUS_COLOR.ADDED;
          } else if (foundSourceIdBefore && !foundSourceIdAfter) {
            // REMOVE COURSE
            (courseCellBefore.style as CSSProperties).backgroundColor =
              BG_BEFORE_STATUS_COLOR.REMOVED;
            (courseCellAfter.style as CSSProperties).backgroundColor =
              BG_AFTER_STATUS_COLOR.REMOVED;
          }
        }
        // #endregion

        nodesTemp.push(
          courseCellBefore,
          courseCellAfter,
          ...(foundSourceIdBefore ? [courseSourceBefore] : []),
          ...(foundSourceIdAfter ? [courseSourceAfter] : [])
        );
        ++courseCount;
      });
      //#endregion
    });
  });
  // #endregion

  console.table(
    nodesTemp.map((node) => ({
      ...node,
      data: node.data.label,
      position: `${node.position.x}, ${node.position.y}`,
      style: node.style?.backgroundColor,
    })),
    ["id", "posistion", "style"]
  );

  return {
    nodes: nodesTemp,
    edges: edgesTemp,
  };
};
