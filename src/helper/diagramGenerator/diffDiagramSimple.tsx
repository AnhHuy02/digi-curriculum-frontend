import type { Node, Edge } from "react-flow-renderer";
import type { RootState } from "src/redux/_store";

import { Position } from "react-flow-renderer";
import _intersection from "lodash/intersection";

import { store } from "src/redux/_store";

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
  offsetX: 40,
};

const yearStyle = {
  offsetX: 100,
};

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

export const getDndNodesAndEdges = (
  curriculumA: {
    allYears: Record<
      string,
      {
        semesters: Record<string, { courseIds: string[] }>;
        semestersOrder: string[];
      }
    >;
    allYearsOrder: string[];
  },
  curriculumB: {
    allYears: Record<
      string,
      {
        semesters: Record<string, { courseIds: string[] }>;
        semestersOrder: string[];
      }
    >;
    allYearsOrder: string[];
  }
): { nodes: Node[]; edges: Edge[] } => {
  let nodesTemp: Node[] = [];
  let edgesTemp: Edge[] = [];

  const allCourses = store.getState().courses.courses;
  const curriculumBefore = curriculumA;
  const curriculumAfter = curriculumB;

  // const allYearIdsOrder =
  //   store.getState().curriculums.curriculumDetail.allYearsOrder;

  // const { curriculumBefore } = (store.getState() as RootState)
  //   .curriculumChangeHistory;
  // const { curriculumDetail: curriculumAfter } = (store.getState() as RootState)
  //   .curriculums;

  // if (allYearIdsOrder.length === 0) {
  //   return {
  //     nodes: nodesTemp,
  //     edges: edgesTemp,
  //   };
  // }

  let semCount = 0;
  let summerCount = 0;
  let courseOrders: string[] = [];

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

  // console.log("mergedTwoCurriculums", mergedTwoCurriculums);

  // #region Step 2: Render semester and course nodes
  mergedTwoCurriculums.allYearIds.forEach((yearId, yearIndex) => {
    const { semesters, semestersOrder } = mergedTwoCurriculums.byYearId[yearId];
    // const customYearId = `year-${yearIndex + 1}`;

    semestersOrder.forEach((semesterId, semesterIndex) => {
      // #region Step 2.1: Render semester nodes
      const courseCount = semesters[semesterId].courseIds.length;
      const newSemLabelId = `sem-label-${semCount + summerCount}`;
      const newSemId = `sem-${String(semCount + summerCount)}`;

      if (semesterIndex !== semestersOrder.length - 1) {
        ++semCount;

        // Semester Label
        nodesTemp.push({
          id: newSemLabelId,
          type: "textNode",
          data: {
            label: `Semester ${semCount}`,
            width: semesterStyle.width,
            height: "40px",
            textStyle: {
              fontSize: 20,
              fontWeight: 500,
            },
          },
          draggable: false,
          position: {
            x:
              yearIndex * yearStyle.offsetX +
              (semCount + summerCount) *
                (semesterStyle.width + semesterStyle.offsetX),
            y: -40,
          },
        });

        // Semester Course Container
        nodesTemp.push({
          id: newSemId,
          type: "semesterNode",
          data: {
            width: semesterStyle.width,
            height:
              courseCount * (courseNodeStyle.height + courseNodeStyle.offsetY) +
              40 +
              10,
          },
          draggable: false,
          position: {
            x:
              yearIndex * yearStyle.offsetX +
              (semCount + summerCount) *
                (semesterStyle.width + semesterStyle.offsetX),
            y: 0,
          },
        });
      } else {
        ++summerCount;

        // Semester Label
        nodesTemp.push({
          id: newSemLabelId,
          type: "textNode",
          data: {
            label: `Summer ${summerCount}`,
            width: semesterStyle.width,
            height: "40px",
            textStyle: {
              fontSize: 20,
              fontWeight: 500,
            },
          },
          draggable: false,
          position: {
            x:
              yearIndex * yearStyle.offsetX +
              (semCount + summerCount) *
                (semesterStyle.width + semesterStyle.offsetX),
            y: -40,
          },
        });

        // Semester Course Container
        nodesTemp.push({
          id: newSemId,
          type: "semesterNode",
          data: {
            width: semesterStyle.width,
            height:
              courseCount * (courseNodeStyle.height + courseNodeStyle.offsetY) +
              40 +
              10,
          },
          draggable: false,
          position: {
            x:
              yearIndex * yearStyle.offsetX +
              (semCount + summerCount) *
                (semesterStyle.width + semesterStyle.offsetX),
            y: 0,
          },
        });
      }
      // #endregion

      // #region Step 2.2: Render course nodes inside a semester node
      const { courseIds: combinedCourseIds } = semesters[semesterId];

      const yearIdBefore = curriculumBefore?.allYearsOrder[yearIndex];
      const yearBefore = curriculumBefore?.allYears[yearIdBefore];
      const semIdBefore = yearBefore?.semestersOrder[semesterIndex];
      const semBefore = yearBefore?.semesters[semIdBefore];
      const courseIdsBefore = semBefore?.courseIds || [];

      const yearIdAfter = curriculumAfter?.allYearsOrder[yearIndex];
      const yearAfter = curriculumAfter?.allYears[yearIdAfter];
      const semIdAfter = yearAfter?.semestersOrder[semesterIndex];
      const semAfter = yearAfter?.semesters[semIdAfter];
      const courseIdsAfter = semAfter?.courseIds || [];

      const unchangedCourseIds = _intersection(courseIdsBefore, courseIdsAfter);
      const filteredCourseIdsBefore = _intersection(
        courseIdsBefore,
        combinedCourseIds
      );
      const filteredCourseIdsAfter = _intersection(
        courseIdsAfter,
        combinedCourseIds
      );

      const getCourseType = (courseId: string) => {
        if (unchangedCourseIds.includes(courseId)) {
          return "UNCHANGED";
        }
        if (filteredCourseIdsBefore.includes(courseId)) {
          return "BEFORE";
        }
        if (filteredCourseIdsAfter.includes(courseId)) {
          return "AFTER";
        }
        return "UNCHANGED";
      };

      combinedCourseIds.forEach((courseId, courseIndex) => {
        const {
          id,
          credit,
          name,
          relationships: relationship,
          type,
        } = allCourses[courseId];

        courseOrders.push(courseId);
        nodesTemp.push({
          id: `${newSemId}-${courseId}`,
          type: "courseNode",
          data: {
            courseId,
            index: courseIndex,
            name,
            credit,
            type: getCourseType(courseId),
          },
          position: {
            x: semesterStyle.paddingX,
            y:
              16 +
              courseIndex * (courseNodeStyle.height + courseNodeStyle.offsetY),
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          parentNode: newSemId,
          extent: "parent",
          draggable: false,
        });
      });
      // #endregion
    });
  });
  // #endregion

  // console.log(edgesTemp);
  return {
    nodes: nodesTemp,
    edges: edgesTemp,
  };
};
