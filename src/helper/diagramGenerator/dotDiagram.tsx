import type { INode } from "ts-graphviz";
import type { ICourseItemSimple } from "src/types/Course.type";
import type { IRandomCurriculumDetailItemReturn } from "src/types/Curriculum.type";

import { Digraph, Node, Subgraph, toDot, attribute } from "ts-graphviz";

import { CourseType } from "src/constants/course.const";

class CustomDigraph extends Digraph {
  constructor(name: string) {
    super("G", {
      label: name,
      labelloc: "t",
      fontsize: 80,
      rankdir: "LR",
      bgcolor: "white",
    });
  }
}

interface IDotDiagramParams extends IRandomCurriculumDetailItemReturn {
  allCourses: Record<string, ICourseItemSimple>;
}

export const getDotDiagramString = ({
  allCourses,
  allYears,
  allYearIdsOrder,
}: IDotDiagramParams) => {
  const g = new CustomDigraph("Curriculum for IT");

  // #region Step 1: Add header label
  let semList: string[] = [];
  let semCount = 0;
  let summerCount = 0;
  const semesterHeaderNodesTemp: INode[] = [];

  {
    allYearIdsOrder.forEach((yearId, yearIndex) => {
      const { semesters, semestersOrder } = allYears[yearId];
      semestersOrder.forEach((semesterId, semesterIndex) => {
        let semHeaderNode: INode | null = null;

        if (semesterIndex !== semestersOrder.length - 1) {
          ++semCount;

          semHeaderNode = new Node(semesterId, {
            id: `sem${semCount}`,
            label: `Semester ${semCount}`,
            shape: "plaintext",
            fontsize: 40,
            fontname: "Times-Bold",
          });

          semList.push(`sem${semCount}`);
          semesterHeaderNodesTemp.push(semHeaderNode);
        } else {
          ++summerCount;

          semHeaderNode = new Node(semesterId, {
            id: `summer${summerCount}`,
            label: `Summer ${summerCount}`,
            shape: "plaintext",
            fontsize: 40,
            fontname: "Times-Bold",
          });

          semList.push(`summer${summerCount}`);
          semesterHeaderNodesTemp.push(semHeaderNode);
        }

        g.addNode(semHeaderNode);
      });
    });

    // Step 1a: Make the header render horizontally
    if (semesterHeaderNodesTemp.length >= 2) {
      const ids = semesterHeaderNodesTemp.map((sem) => sem.id);
      const [fromId, toId, ...restIds] = ids;

      g.createEdge([fromId, toId, ...restIds], {
        [attribute.style]: "invis",
      });
    }
  }
  // #endregion

  // #region Step 2: Add course node
  let courseOrders: string[] = [];
  {
    let semNodeCountTemp = 0;
    allYearIdsOrder.forEach((yearId, yearIndex) => {
      const { semesters, semestersOrder } = allYears[yearId];
      semestersOrder.forEach((semesterId, semesterIndex) => {
        const { courseIds } = semesters[semesterId];
        const semSubGraph = new Subgraph({
          rank: "same",
        });

        // Important: add semId to completely separate courses per semester
        semSubGraph.createNode(semesterHeaderNodesTemp[semNodeCountTemp].id);

        courseIds.forEach((courseId) => {
          const course = allCourses[courseId];
          const { credit } = course;

          courseOrders.push(courseId);

          let courseNodeTemp: INode | null = null;

          switch (course.type) {
            case CourseType.FUNDAMENTAL:
            case CourseType.GENERAL:
            case CourseType.OTHERS: {
              courseNodeTemp = new Node(courseId, {
                id: courseId,
                label:
                  course.name + "\n" + `(${credit.theory}, ${credit.practice})`,
                shape: "rectangle",
                width: 4,
                fontsize: 30,
                margin: 0.2,
                style: "filled",
                fillcolor: "#FFFFFF",
                color: "#000000",
              });

              semSubGraph.addNode(courseNodeTemp);
              break;
            }
            case CourseType.PROJECT_INTERN_THESIS:
            case CourseType.SPECIALIZATION_REQUIRED:
            case CourseType.SPECIALIZATION_ELECTIVE: {
              courseNodeTemp = new Node(courseId, {
                id: courseId,
                label:
                  course.name + "\n" + `(${credit.theory}, ${credit.practice})`,
                shape: "rectangle",
                width: 4,
                fontsize: 30,
                margin: 0.2,
                style: "filled",
                fillcolor: "#DAE8FC",
                color: "#6C8EBF",
              });

              semSubGraph.addNode(courseNodeTemp);
              break;
            }
            default:
              break;
          }
        });

        g.addSubgraph(semSubGraph);
        ++semNodeCountTemp;
      });
    });
  }
  // #endregion

  //#region Step 3: Add course relationship
  {
    allYearIdsOrder.forEach((yearId, yearIndex) => {
      const { semesters, semestersOrder } = allYears[yearId];
      semestersOrder.forEach((semesterId, semesterIndex) => {
        const { courseIds } = semesters[semesterId];

        courseIds.forEach((courseId, courseIndex) => {
          const {
            id,
            credit,
            name,
            relationships: relationship,
            type,
          } = allCourses[courseId];

          let sourceId: string = "";
          let targetId: string = "";
          let sourceIndex: number = -1;
          let targetIndex: number = -1;

          if (relationship.preRequisites.length > 0) {
            relationship.preRequisites.forEach((preRequisiteId) => {
              sourceId = preRequisiteId;
              targetId = courseId;
              sourceIndex = courseOrders.indexOf(preRequisiteId);
              targetIndex = courseOrders.indexOf(courseId);

              if (sourceIndex > -1 && targetIndex > -1) {
                g.createEdge([sourceId, targetId], {
                  label: "prerequisites",
                });
              }
            });
          }
          if (relationship.coRequisites.length > 0) {
            relationship.coRequisites.forEach((coRequisiteCourseId) => {
              sourceId = courseId;
              targetId = coRequisiteCourseId;
              sourceIndex = courseOrders.indexOf(courseId);
              targetIndex = courseOrders.indexOf(coRequisiteCourseId);

              if (sourceIndex > -1 && targetIndex > -1) {
                g.createEdge([sourceId, targetId], {
                  label: "corequisite",
                  constraint: false,
                  arrowhead: "none",
                });
              }
            });
          }
          if (relationship.previous.length > 0) {
            relationship.previous.forEach((previousCourseId) => {
              sourceId = previousCourseId;
              targetId = courseId;
              sourceIndex = courseOrders.indexOf(previousCourseId);
              targetIndex = courseOrders.indexOf(courseId);

              if (sourceIndex > -1 && targetIndex > -1) {
                g.createEdge([sourceId, targetId], {
                  label: "previous",
                  style: "dashed",
                });
              }
            });
          }
        });
      });
    });
  }
  //#endregion

  //#region Step 4: Make footer
  const subGraphLegend = new Subgraph("legend", {
    id: "legend",
    labeljust: "l",
    color: "black",
    fontsize: 30,
  });

  {
    const semesterFooterNodesTemp = semesterHeaderNodesTemp.map((semNode) => ({
      ...semNode,
      id: `${semNode.id}b`,
    }));

    semesterFooterNodesTemp.forEach((semHeaderNode, semHeaderNodeIndex) => {
      subGraphLegend.addNode(semHeaderNode);
    });

    // Step 1a: Make the header render horizontally
    if (semesterFooterNodesTemp.length >= 2) {
      const ids = semesterFooterNodesTemp.map((sem) => sem.id);
      const [fromId, toId, ...restIds] = ids;

      subGraphLegend.createEdge([fromId, toId, ...restIds], {
        [attribute.style]: "invis",
      });
    }
  }
  g.addSubgraph(subGraphLegend);
  //#endregion

  // console.log(toDot(g));
  return toDot(g);
};
