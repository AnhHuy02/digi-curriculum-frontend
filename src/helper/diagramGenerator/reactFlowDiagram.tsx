import type { Elements } from "react-flow-renderer";
import type {
  IRandomCoursesReturn,
  ICourseItemSimple,
} from "src/types/course.type";
import type { IRandomCurriculumDetailItemReturn } from "src/types/curriculum.type";

import { Position, ArrowHeadType } from "react-flow-renderer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CourseRelationship } from "src/constants/course.const";

interface IGetReactFlowElements extends IRandomCurriculumDetailItemReturn {
  allCourses: Record<string, ICourseItemSimple>;
}

export const getReactFlowElements = ({
  allCourses,
  allYears,
  allYearIdsOrder,
}: IGetReactFlowElements): Elements => {
  let reactFlowElements: Elements = [];

  if (allYearIdsOrder.length === 0) {
    return [];
  }

  console.log("getReactFlowElements");

  // Step 1: Render course node
  let courseOrders: string[] = [];
  allYearIdsOrder.forEach((yearId, yearIndex) => {
    const { semesters, semestersOrder } = allYears[yearId];
    semestersOrder.forEach((semesterId, semesterIndex) => {
      const { courseIds } = semesters[semesterId];

      // console.log(courseIds);

      courseIds.forEach((courseId, courseIndex) => {
        const { id, credit, name, relationship, type } = allCourses[courseId];

        courseOrders.push(courseId);
        console.log(courseOrders.length);

        reactFlowElements.push({
          // id: courseId,
          id: (courseOrders.length - 1).toString(),
          // id: (yearIndex * semestersOrder.length + semesterIndex).toString(),
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
            width: 150,
            height: 120,
          },
          position: {
            x: 10 + (yearIndex * semestersOrder.length + semesterIndex) * 300,
            y: 10 + courseIndex * 160,
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        });
      });
    });
  });

  console.log(courseOrders);

  // Step 2: Render edge for course relationship
  allYearIdsOrder.forEach((yearId, yearIndex) => {
    const { semesters, semestersOrder } = allYears[yearId];
    semestersOrder.forEach((semesterId, semesterIndex) => {
      const { courseIds } = semesters[semesterId];

      if (courseIds.length > 0) {
        courseIds.forEach((courseId, courseIndex) => {
          const { id, credit, name, relationship, type } = allCourses[courseId];

          // console.log("render prerequisite edge");
          if (relationship.preRequisites.length > 0) {
            relationship.preRequisites.forEach((preRequisiteId) => {
              const sourceId = courseOrders.indexOf(preRequisiteId);
              const targetId = courseOrders.indexOf(courseId);

              if (sourceId > -1 && targetId > -1) {
                // console.log(courseId, preRequisiteId);
                // console.log(`${sourceId} ${targetId}`);

                reactFlowElements.push({
                  id: `${sourceId}-prerequisite-${targetId}}`,
                  label: <>Prerequisite</>,
                  type: "smart",
                  // type: "floating",
                  source: sourceId.toString(),
                  target: targetId.toString(),
                  // sourcePosition: Position.Right,
                  // targetPosition: Position.Left,
                  arrowHeadType: ArrowHeadType.ArrowClosed,
                  labelBgStyle: {
                    backgroundColor: "none",
                  },
                });
              }
            });
          }

          if (relationship.coRequisites.length > 0) {
            relationship.coRequisites.forEach((coRequisiteCourseId) => {
              const sourceId = courseOrders.indexOf(courseId);
              const targetId = courseOrders.indexOf(coRequisiteCourseId);

              if (sourceId > -1 && targetId > -1) {
                reactFlowElements.push({
                  id: `${sourceId}-corequisite-${targetId}`,
                  label: <>Corequisite</>,
                  type: "smart",
                  // type: "floating",
                  source: sourceId.toString(),
                  target: targetId.toString(),
                  labelBgStyle: {
                    backgroundColor: "none",
                  },
                });
              }
            });
          }

          if (relationship.previous.length > 0) {
            relationship.previous.forEach((previousCourseId) => {
              const sourceId = courseOrders.indexOf(previousCourseId);
              const targetId = courseOrders.indexOf(courseId);

              reactFlowElements.push({
                id: `${sourceId}-previous-${targetId}`,
                label: <>Previous</>,
                type: "smart",
                source: sourceId.toString(),
                target: targetId.toString(),
                // sourcePosition: Position.Right,
                // targetPosition: Position.Left,
                arrowHeadType: ArrowHeadType.ArrowClosed,
                animated: true,
                labelBgStyle: {
                  backgroundColor: "none",
                },
              });
            });
          }

          // if (relationship.preRequisites.length > 0) {
          //   relationship.preRequisites.forEach((preRequisiteCourseId) => {
          //     console.log(courseId, preRequisiteCourseId);

          //     const sourceId = null;

          //     reactFlowElements.push({
          //       id: `e${courseId}-${preRequisiteCourseId}`,
          //       // label: <>Prerequisite</>,
          //       type: "smart",
          //       source: preRequisiteCourseId,
          //       target: courseId,
          //       // sourcePosition: Position.Right,
          //       // targetPosition: Position.Left,
          //       // arrowHeadType: ArrowHeadType.ArrowClosed,
          //       // labelBgStyle: {
          //       //   backgroundColor: "none",
          //       // },
          //     });
          //   });
          // }

          // if (relationship.coRequisites.length > 0) {
          //   relationship.coRequisites.forEach((coRequisiteCourseId) => {
          //     reactFlowElements.push({
          //       id: `${courseId}-corequisite-${coRequisiteCourseId}`,
          //       label: <>Corequisite</>,
          //       type: "smart",
          //       source: courseId,
          //       // sourcePosition: Position.Top,
          //       target: coRequisiteCourseId,
          //       labelBgStyle: {
          //         backgroundColor: "none",
          //       },
          //     });
          //   });
          // }

          // if (relationship.previous.length > 0) {
          //   relationship.previous.forEach((previousCourseId) => {
          //     reactFlowElements.push({
          //       id: `${courseId}-previous-${previousCourseId}`,
          //       label: <>Previous</>,
          //       type: "smart",
          //       source: previousCourseId,
          //       target: courseId,
          //       // sourcePosition: Position.Right,
          //       // targetPosition: Position.Left,
          //       arrowHeadType: ArrowHeadType.ArrowClosed,
          //       animated: true,
          //       labelBgStyle: {
          //         backgroundColor: "none",
          //       },
          //     });
          //   });
          // }

          // Placeholder (Elective) courses does not have any edges
          // if(relationship.placeholders.length > 0) {
          //   relationship.placeholders.forEach((placeholderCourseId) => {
          //     reactFlowElements.push({
          //       id: `${courseId}-placeholder-${placeholderCourseId}`,
          //       label: <>Placeholder</>,
          //       type: "smart",
          //       source: courseId,
          //       target: placeholderCourseId,
          //     });
          //   });
          // }
        });
      }
    });
  });

  console.log(reactFlowElements);

  return reactFlowElements;
};
