import type { Node, Edge } from "react-flow-renderer";
import type { IRandomCurriculumDetailItemReturn } from "src/types/curriculum.type";
import type { ICourseItemSimple } from "src/types/course.type";

import { Position } from "react-flow-renderer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "src/hooks/useStore";
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
  paddingX: 10,
  offsetX: 75,
};

interface IGetDndNodesAndEdges extends IRandomCurriculumDetailItemReturn {
  allCourses: Record<string, ICourseItemSimple>;
}

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

  // #region Step 1: Render semester and course nodes
  allYearIdsOrder.forEach((yearId, yearIndex) => {
    const { semesters, semestersOrder } = allYears[yearId];

    semestersOrder.forEach((semesterId, semesterIndex) => {
      // #region Step 1.1: Render semester nodes
      const courseCount = semesters[semesterId].courseIds.length;
      let semId: string = "";

      if (semesterIndex !== semestersOrder.length - 1) {
        ++semCount;
        semId = `sem${semCount}`;

        nodesTemp.push({
          id: semId,
          // type: "group",
          data: {
            label: `Semester ${semCount}`,
          },
          position: {
            x:
              (semCount + summerCount) *
              (semesterStyle.width + semesterStyle.offsetX),
            y: 0,
          },
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            width: semesterStyle.width,
            height:
              courseCount * (courseNodeStyle.height + courseNodeStyle.offsetY) +
              addCourseBtnStyle.height +
              40 +
              20,
          },
        });
      } else {
        ++summerCount;
        semId = `summer${summerCount}`;

        nodesTemp.push({
          id: `summer${summerCount}`,
          // type: "group",
          data: {
            label: `Summer ${summerCount}`,
          },
          position: {
            x:
              (semCount + summerCount) *
              (semesterStyle.width + semesterStyle.offsetX),
            y: 0,
          },
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            width: semesterStyle.width,
            height:
              courseCount * (courseNodeStyle.height + courseNodeStyle.offsetY) +
              addCourseBtnStyle.height +
              40 +
              20,
          },
        });
      }
      // #endregion

      // #region Step 1.2: Render course nodes inside a semester node
      const { courseIds } = semesters[semesterId];
      courseIds.forEach((courseId, courseIndex) => {
        const { id, credit, name, relationship, type } = allCourses[courseId];

        courseOrders.push(courseId);
        nodesTemp.push({
          id: courseId,
          data: {
            label: (
              <Box key={courseId}>
                <Box>
                  <Typography fontWeight={500}>{name}</Typography>
                </Box>
                <Box>
                  <Typography>{`(${credit.theory}-${credit.practice})`}</Typography>
                </Box>
              </Box>
            ),
          },
          style: {
            width: courseNodeStyle.width,
            height: courseNodeStyle.height,
          },
          position: {
            x: semesterStyle.paddingX,
            y:
              40 +
              courseIndex * (courseNodeStyle.height + courseNodeStyle.offsetY),
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          parentNode: semId,
          extent: "parent",
        });
      });
      // #endregion

      // #region Step 1.3: Render add course button
      nodesTemp.push({
        id: `add-course-btn-${semId}`,
        data: {
          label: (
            <Box key={`add-course-btn-${semId}`}>
              <Typography>Add</Typography>
            </Box>
          ),
        },
        style: {
          width: addCourseBtnStyle.width,
          height: addCourseBtnStyle.height,
        },
        position: {
          x: semesterStyle.paddingX,
          y:
            40 +
            courseCount * (courseNodeStyle.height + courseNodeStyle.offsetY),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        parentNode: semId,
        extent: "parent",
      });
      // #endregion
    });
  });
  // #endregion

  // #region Step 2: Render course relationship edges
  allYearIdsOrder.forEach((yearId, yearIndex) => {
    const { semesters, semestersOrder } = allYears[yearId];

    semestersOrder.forEach((semesterId, semesterIndex) => {
      const { courseIds } = semesters[semesterId];

      courseIds.forEach((courseId, courseIndex) => {
        const { id, credit, name, relationship, type } = allCourses[courseId];

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
                id: `edge-${sourceIndex}-prerequisite-${targetIndex}}`,
                label: <>Prerequisite</>,
                type: "smart",
                // type: "floating",
                source: sourceId,
                target: targetId,
                // sourcePosition: Position.Right,
                // targetPosition: Position.Left,
                // arrowHeadType: ArrowHeadType.ArrowClosed,
                labelBgStyle: {
                  backgroundColor: "none",
                },
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
                id: `${sourceIndex}-corequisite-${targetIndex}`,
                label: <>Corequisite</>,
                type: "smart",
                // type: "floating",
                source: sourceId,
                target: targetId,
                labelBgStyle: {
                  backgroundColor: "none",
                },
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

            edgesTemp.push({
              id: `${sourceIndex}-previous-${targetIndex}`,
              label: <>Previous</>,
              type: "smart",
              source: sourceId,
              target: targetId,
              // sourcePosition: Position.Right,
              // targetPosition: Position.Left,
              // arrowHeadType: ArrowHeadType.ArrowClosed,
              animated: true,
              labelBgStyle: {
                backgroundColor: "none",
              },
            });
          });
        }
        //
      });
    });
  });
  // #endregion

  console.log(edgesTemp);
  return {
    nodes: nodesTemp,
    edges: edgesTemp,
  };
};