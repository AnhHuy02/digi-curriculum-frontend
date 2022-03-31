// @ts-nocheck
import * as d3 from "d3";

export const getAllEdgeIdsfromDom = () => {
  let edges = [];
  d3.selectAll(`g[id*="edge"]`).each(function () {
    edges.push(this.id);
  });
  return edges;
};

export const getAllCourseIdsFromDom = () => {
  let courseIds = [];
  d3.selectAll('g[id*="course"]').each(function () {
    courseIds.push(this.id);
  });
  return courseIds;
};

export const getAllCoursesFromDom = () => {
  let allCourses = {};
  let allCourseIds = [];
  d3.selectAll('g[id*="course"]').each(function () {
    const courseId = (this.id + "").replace("course-", "");
    let str = "";
    d3.select(this)
      .selectAll("text")
      .each(function () {
        str = str.concat(d3.select(this).text() + " ");
      });
    allCourseIds.push(courseId);

    // The full string is "IT083 (0,3) Special Study of  the Field"

    // courseName will be "  Special Study of  the Field"
    const courseName = str.replace(/\w+\s\([0-9]+,[0-9]+\)/, "");

    // creditString1 will be "(0,3)"
    const creditString1 = str.match(/\([0-9]+,[0-9]+\)/)[0];

    // creditString2 will be "0,3"
    const creditString2 = creditString1.match(/[0-9]+,[0-9]/)[0];

    // credits will be ["0", "3"]
    const credits = creditString2.split(",");

    allCourses[courseId] = {
      id: courseId,
      name: courseName.trim(),
      credit: {
        theory: Number(credits[0]),
        practice: Number(credits[1]),
      },
    };
  });

  return {
    allCourses,
    allCourseIds,
  };
};
