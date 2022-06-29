import type { Node, Edge } from "react-flow-renderer";

import { Position, MarkerType } from "react-flow-renderer";
import { CourseRelationship } from "src/constants/course.const";

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
  offsetX: 125,
};

export const getDndNodesAndEdges = (): { nodes: Node[]; edges: Edge[] } => {
  let nodesTemp: Node[] = [];
  let edgesTemp: Edge[] = [];

  const years = store.getState().curriculums.curriculumDetail.years;
  const courses = store.getState().courses.courses;

  if (years.allIds.length === 0) {
    return {
      nodes: nodesTemp,
      edges: edgesTemp,
    };
  }

  let semCount = 0;
  let summerCount = 0;
  let courseOrders: string[] = [];

  // #region Step 1: Render semester and course nodes
  years.allIds.forEach((yearId, yearIndex) => {
    const { semesters } = years.byId[yearId];
    const customYearId = `year-${yearIndex + 1}`;

    semesters.allIds.forEach((semId, semIndex) => {
      // console.log("generate", semesterId);
      // #region Step 1.1: Render semester nodes
      const courseCount = semesters.byId[semId].courseIds.length;
      const creditPerSemesterCount = semesters.byId[semId].courseIds.reduce(
        (sum, currentId) => {
          return (
            sum +
            courses.byId[currentId].credit.theory +
            courses.byId[currentId].credit.practice
          );
        },
        0 as number
      );
      const creditLimit = semesters.byId[semId].creditLimit;

      if (semIndex !== semesters.allIds.length - 1) {
        ++semCount;

        // Semester Label
        nodesTemp.push({
          id: `${semId}-label`,
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
              (semCount + summerCount) *
              (semesterStyle.width + semesterStyle.offsetX),
            y: -40,
          },
        });

        // Semester Course Container
        nodesTemp.push({
          id: `${semId}`,
          type: "semesterNode",
          data: {
            // label: `Semester ${semCount}`,
            width: semesterStyle.width,
            height:
              courseCount * (courseNodeStyle.height + courseNodeStyle.offsetY) +
              addCourseBtnStyle.height +
              40 +
              10,
            creditCount: creditPerSemesterCount,
            creditLimit: creditLimit,
          },
          draggable: false,
          position: {
            x:
              (semCount + summerCount) *
              (semesterStyle.width + semesterStyle.offsetX),
            y: 0,
          },
        });
      } else {
        ++summerCount;

        // Semester Label
        nodesTemp.push({
          id: `${semId}-label`,
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
              (semCount + summerCount) *
              (semesterStyle.width + semesterStyle.offsetX),
            y: -40,
          },
        });

        // Semester Course Container
        nodesTemp.push({
          id: `${semId}`,
          type: "semesterNode",
          data: {
            // label: `Summer ${summerCount}`,
            width: semesterStyle.width,
            height:
              courseCount * (courseNodeStyle.height + courseNodeStyle.offsetY) +
              addCourseBtnStyle.height +
              40 +
              10,
            creditCount: creditPerSemesterCount,
            creditLimit: creditLimit,
          },
          draggable: false,
          position: {
            x:
              (semCount + summerCount) *
              (semesterStyle.width + semesterStyle.offsetX),
            y: 0,
          },
        });
      }
      // #endregion

      // #region Step 1.2: Render course nodes inside a semester node
      const { courseIds } = semesters.byId[semId];
      courseIds.forEach((courseId, courseIndex) => {
        const {
          id,
          credit,
          name,
          relationships: relationship,
          type,
        } = courses.byId[courseId];

        courseOrders.push(courseId);
        nodesTemp.push({
          id: courseId,
          type: "courseNode",
          data: {
            yearId,
            yearIndex,
            semId,
            semIndex,
            courseId,
            index: courseIndex,
          },
          position: {
            x: semesterStyle.paddingX,
            y:
              16 +
              courseIndex * (courseNodeStyle.height + courseNodeStyle.offsetY),
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          parentNode: String(semId),
          extent: "parent",
          draggable: false,
        });
      });
      // #endregion

      // #region Step 1.3: Render add course button
      nodesTemp.push({
        id: `add-course-btn-${semId}`,
        type: "addCourseNode",
        data: {
          yearId,
          yearIndex,
          semId,
          semIndex,
        },
        position: {
          x: semesterStyle.paddingX,
          y:
            16 +
            courseCount * (courseNodeStyle.height + courseNodeStyle.offsetY),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        parentNode: String(semId),
        extent: "parent",
        draggable: false,
      });
      // #endregion
    });
  });
  // #endregion

  // #region Step 2: Render course relationship edges
  let edgeIndex = 0;
  years.allIds.forEach((yearId, yearIndex) => {
    const { semesters } = years.byId[yearId];

    semesters.allIds.forEach((semesterId, semesterIndex) => {
      const { courseIds } = semesters.byId[semesterId];

      courseIds.forEach((courseId, courseIndex) => {
        const {
          id,
          credit,
          name,
          relationships: relationship,
          type,
        } = courses.byId[courseId];

        // #region Step 2.1: Render PRE_REQUISITE relationships
        if (relationship.preRequisites.length > 0) {
          relationship.preRequisites.forEach((preRequisiteId) => {
            const sourceId = preRequisiteId;
            const targetId = courseId;

            const sourceIndex = courseOrders.indexOf(preRequisiteId);
            const targetIndex = courseOrders.indexOf(courseId);

            if (sourceIndex > -1 && targetIndex > -1) {
              // console.log(courseId, preRequisiteId);
              // console.log(`${sourceId} ${targetId}`);

              edgesTemp.push({
                id: `edge${edgeIndex}-${sourceId}-prerequisite-${targetId}`,
                // id: `edge-${sourceIndex}-prerequisite-${targetIndex}`,
                label: <>Prerequisite</>,
                type: "courseRelationshipEdge",
                data: {
                  label: "prerequisite",
                  highlighted: false,
                  courseSourceId: sourceId,
                  courseTargetId: targetId,
                  relationship: CourseRelationship.PREREQUISITE,
                },
                source: sourceId,
                target: targetId,
                // sourcePosition: Position.Right,
                // targetPosition: Position.Left,
                markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
                labelBgStyle: {
                  backgroundColor: "none",
                },
                // zIndex: 9000,
              });
            }
          });
        }
        // #endregion

        // #region Step 2.2: Render CO_REQUISITE relationships
        if (relationship.coRequisites.length > 0) {
          relationship.coRequisites.forEach((coRequisiteCourseId) => {
            const sourceId = courseId;
            const targetId = coRequisiteCourseId;

            const sourceIndex = courseOrders.indexOf(courseId);
            const targetIndex = courseOrders.indexOf(coRequisiteCourseId);

            if (sourceIndex > -1 && targetIndex > -1) {
              edgesTemp.push({
                id: `edge${edgeIndex}-${sourceId}-prerequisite-${targetId}`,
                // id: `edge-${sourceIndex}-prerequisite-${targetIndex}`,
                label: <>Corequisite</>,
                type: "courseRelationshipEdge",
                data: {
                  label: "corequisite",
                  highlighted: false,
                  courseSourceId: sourceId,
                  courseTargetId: targetId,
                  relationship: CourseRelationship.COREQUISITE,
                },
                source: sourceId,
                target: targetId,
                labelBgStyle: {
                  backgroundColor: "none",
                },
                // zIndex: 9000,
              });
            }
          });
        }
        // #endregion

        // #region Step 2.3: Render PREVIOUS relationships
        if (relationship.previous.length > 0) {
          relationship.previous.forEach((previousCourseId) => {
            const sourceId = previousCourseId;
            const targetId = courseId;

            const sourceIndex = courseOrders.indexOf(previousCourseId);
            const targetIndex = courseOrders.indexOf(courseId);

            if (sourceIndex > -1 && targetIndex > -1) {
              edgesTemp.push({
                id: `edge${edgeIndex}-${sourceId}-prerequisite-${targetId}`,
                // id: `edge-${sourceIndex}-prerequisite-${targetIndex}`,
                label: <>Previous</>,
                type: "courseRelationshipEdge",
                data: {
                  label: "previous",
                  highlighted: false,
                  courseSourceId: sourceId,
                  courseTargetId: targetId,
                  relationship: CourseRelationship.PREVIOUS,
                },
                source: sourceId,
                target: targetId,
                // sourcePosition: Position.Right,
                // targetPosition: Position.Left,
                markerEnd: { type: MarkerType.ArrowClosed, color: "#000000" },
                animated: true,
                labelBgStyle: {
                  backgroundColor: "none",
                },
                // zIndex: 9000,
              });
            }
          });
        }
        //
        ++edgeIndex;
      });
    });
  });
  // #endregion

  // console.log(edgesTemp);
  return {
    nodes: nodesTemp,
    edges: edgesTemp,
  };
};
