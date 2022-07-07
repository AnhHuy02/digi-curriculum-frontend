import type { Node, Edge } from "react-flow-renderer";
import type { ArrayNormalizer } from "src/types/Normalizer.type";
import type { ICourse } from "src/types/Course.type";
import type { ICurriculumItemYear } from "src/types/Curriculum.type";

import { Position } from "react-flow-renderer";
import _intersection from "lodash/intersection";

import { store } from "src/redux/_store";

const courseNodeStyle = {
  width: 120,
  height: 80,
  offsetY: 20,
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
  curriculumA: ArrayNormalizer<ICurriculumItemYear>,
  curriculumB: ArrayNormalizer<ICurriculumItemYear>,
  courses: ArrayNormalizer<ICourse> = store.getState().courses.courses
): { nodes: Node[]; edges: Edge[] } => {
  let nodesTemp: Node[] = [];
  let edgesTemp: Edge[] = [];

  const curriculumBefore = curriculumA;
  const curriculumAfter = curriculumB;

  if (courses.allIds.length === 0) {
    return {
      nodes: nodesTemp,
      edges: edgesTemp,
    };
  }

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
    const mapYearIdsBefore = curriculumBefore.allIds.map(
      (_yearId, yearIndex) => yearIndex
    );
    const mapYearIdsAfter = curriculumAfter.allIds.map(
      (_yearId, yearIndex) => yearIndex
    );
    const combineYearIds = new Set([...mapYearIdsBefore, ...mapYearIdsAfter]);

    allYearIds.push(...Array.from(combineYearIds));
    allYearIds.forEach((_yearId, yearIndex) => {
      // #region Step 1.2: Combine semester ids by index
      const yearIdBefore = curriculumBefore.allIds[yearIndex] as number;
      const yearIdAfter = curriculumAfter.allIds[yearIndex] as number;

      const mapSemIdsBefore =
        curriculumBefore.byId[yearIdBefore]?.semesters.allIds.map(
          (_semId, semIndex) => semIndex
        ) || [];
      const mapSemIdsAfter =
        curriculumAfter.byId[yearIdAfter]?.semesters.allIds.map(
          (_semId, semIndex) => semIndex
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
        const semesterBefore = curriculumBefore.byId[yearIdBefore]?.semesters;
        const semesterAfter = curriculumAfter.byId[yearIdAfter]?.semesters;

        const semIdBefore = semesterBefore?.allIds[semIndex] || -1;
        const semIdAfter = semesterAfter?.allIds[semIndex] || -1;

        const mapCourseIdsBefore =
          semesterBefore?.byId[semIdBefore]?.courseIds || [];
        const mapCourseIdsAfter =
          semesterAfter?.byId[semIdAfter]?.courseIds || [];

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

      const yearIdBefore = curriculumBefore?.allIds[yearIndex];
      const yearBefore = curriculumBefore?.byId[yearIdBefore];
      const semIdBefore = yearBefore?.semesters.allIds[semesterIndex];
      const semBefore = yearBefore?.semesters.byId[semIdBefore];
      const courseIdsBefore = semBefore?.courseIds || [];

      const yearIdAfter = curriculumAfter?.allIds[yearIndex];
      const yearAfter = curriculumAfter?.byId[yearIdAfter];
      const semIdAfter = yearAfter?.semesters.allIds[semesterIndex];
      const semAfter = yearAfter?.semesters.byId[semIdAfter];
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
        } = courses.byId[courseId];

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
