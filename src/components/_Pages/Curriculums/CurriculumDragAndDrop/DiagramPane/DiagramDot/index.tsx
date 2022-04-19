import type { BaseType } from "d3";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as d3 from "d3";
import Box from "@mui/material/Box";

const Graphviz = dynamic(() => import("graphviz-react"), { ssr: false });

import { dummyDotString } from "src/helper/mockDataGenerator/dotString";
import { getDotDiagramString } from "src/helper/diagramGenerator/dotDiagram";
import { getRectangleInfo } from "src/helper/shapeCalculator";
import { useAppSelector } from "src/hooks/useStore";
import {
  getAllCourseIdsFromDom,
  getAllEdgeIdsfromDom,
  getAllCoursesFromDom,
} from "./domDataProcessor";

const TooltipBtn = {
  width: 30,
  height: 30,
};

const DiagramDot = () => {
  const curriculumDetail = useAppSelector(
    (store) => store.curriculums.curriculumDetail
  );
  const courses = useAppSelector((store) => store.courses.courses);
  const [dot, setDot] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, [curriculumDetail, courses]);

  // useEffect(() => {
  //   // If dot data is fetched, initialize with d3
  //   if (dot) {
  //     initDot();
  //   }
  // }, [dot]);

  const loadData = async () => {
    const { allYears, allYearsOrder } = curriculumDetail;
    const dotString = getDotDiagramString({
      allCourses: courses,
      allYears,
      allYearIdsOrder: allYearsOrder,
    });
    setDot(dotString);
    // setDot(dummyDotString);
  };

  const initDot = () => {
    // Code
    const allEdgeIdsfromDom = getAllEdgeIdsfromDom();
    const { allCourses: allCoursesFromDom, allCourseIds: allCourseIdsFromDom } =
      getAllCoursesFromDom();

    console.log(getAllCoursesFromDom());

    // const allCourseIdsFromDom = getAllCourseIdsFromDom();
    // const { allStudents, allStudentIds, allCourses, allCourseIds } =
    //   getRandomDatafromCourseIds({
    //     studentCount: { min: 20, max: 200 },
    //     allCourseIds: allCourseIdsFromDom,
    //     allCourses: allCoursesFromDom,
    //   });

    function getAllNearbyCourses(courseId: string) {
      // use Set() to remove duplicate value in array
      let filteredCourseIds = new Set();
      let filteredEdgeIds = new Set();

      allEdgeIdsfromDom.forEach((edgeId) => {
        // process string like "edge-IT069->IT013"
        const [courseFrom, relation, courseTo] = (edgeId + "")
          .replace("edge-", "") // it will be like "IT069->IT013"
          .split(/(->|--)/); // Some relations are -> or --,
        // After process, it will be like ["IT069", "->", "IT013"]

        if ([courseFrom, courseTo].includes(courseId)) {
          // If a Set() element has the same value, it will not add
          filteredCourseIds.add(courseFrom);
          filteredCourseIds.add(courseTo);
          filteredEdgeIds.add(edgeId);
        }
      });

      // Delete course id of hovered course
      filteredCourseIds.delete(courseId);

      // Convert Set() to Array
      return {
        nearbyEdgeIds: Array.from(filteredEdgeIds),
        nearbyCourseIds: Array.from(filteredCourseIds),
      };
    }

    function highlightAllNearbyCourses(courseId: string) {
      const { nearbyCourseIds, nearbyEdgeIds } = getAllNearbyCourses(courseId);

      // select all courses to blur except highlighted nearby courses
      // g[id*="course"]:not([id="nearbyCourse-id"])
      const ignoredCourseIds = nearbyCourseIds.reduce(
        (previousValue, currentValue) => {
          return previousValue + "" + `:not([id="course-${currentValue}"])`;
        },
        `:not([id="course-${courseId}"])`
      );

      const ignoredEdgeIds = nearbyEdgeIds.reduce(
        (previousValue, currentValue) => {
          return previousValue + "" + `:not([id="${currentValue}"])`;
        },
        ``
      );

      // Match all courses except specific courseIds,
      // Highlight a hovered course with its nearby courses, blur others
      d3.selectAll('g[id*="course"]' + ignoredCourseIds)
        .transition()
        .duration(200)
        .style("opacity", "0.3");

      // Match all courses except specific edgeIds,
      // BLur all edges except connected edges
      d3.selectAll('g[id*="edge"]' + ignoredEdgeIds)
        .transition()
        .duration(200)
        .style("opacity", "0.3");
    }

    const diagram = d3.select("#graphviz1").select("svg").select("#graph0");

    // Add course detail popup
    const CourseDetailPopup = d3
      .select("body")
      .append("div")
      .classed("course-detail--popup", true)
      .classed("clicked", true)
      .style("position", "absolute")
      .style("width", `${300}px`)
      .style("height", `${550}px`)
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("visibility", "hidden");

    CourseDetailPopup.text("Course Detail");

    // Add events
    diagram
      .selectAll('g[id*="course"]')
      .on("mouseenter", function (event, d) {
        console.log("mouseover");
        const courseId = ((this as any).id + "").split("-")[1];

        highlightAllNearbyCourses(courseId);

        // Get polygon point attribute to calculate points
        // points="774.303,-2218   486.303,-2218    486.303,-2118    774.303,-2118  774.303,-2218"
        const points = d3
          .select(this)
          .select("polygon")
          .attr("points")
          .split(" ");

        // Get 2 opposite diagonal points, convert string to number
        const [x1, y1] = points[0].split(",").map((value) => +value);
        const [x2, y2] = points[2].split(",").map((value) => +value);

        const rectangleInfo = getRectangleInfo(x1, y1, x2, y2);
        const { width, height, midpoint } = rectangleInfo;

        // Create a button when hover a course
        d3.select(this)
          .append("rect")
          .classed("tooltip-btn__course-detail", true)
          .attr("fill", "green")
          .attr("x", midpoint.x + width / 2 - TooltipBtn.width)
          .attr("y", midpoint.y - height / 2)
          .attr("width", TooltipBtn.width)
          .attr("height", TooltipBtn.height)
          .on("click", function (event, d) {
            // Display a course detail popup if green button is clicked
            // Add toggle to handle multiple clicks
            const clicked = CourseDetailPopup.classed("clicked");

            CourseDetailPopup.style("left", `${event.pageX + 20}px`).style(
              "top",
              `${event.pageY - 200}px`
            );
            CourseDetailPopup.classed("clicked", !clicked);
            CourseDetailPopup.html(`
              <ul>
                <li>Name: ${courses[courseId].name}</li>
                <li>ID: ${courseId}</li>
                <li>Credit: ${
                  courses[courseId].credit.theory +
                  courses[courseId].credit.practice
                }</li>
              </ul>
            `);
            CourseDetailPopup.style(
              "visibility",
              clicked ? "visible" : "hidden"
            );
          });

        d3.select(this)
          .append("rect")
          .classed("tooltip-btn__toggle-highlight", true)
          .attr("fill", "red")
          .attr("x", midpoint.x + width / 2 - TooltipBtn.width * 2)
          .attr("y", midpoint.y - height / 2)
          .attr("width", TooltipBtn.width)
          .attr("height", TooltipBtn.height)
          .on("click", function (event, d) {});

        // Show course detail popup if hovered
        // CourseDetailPopup.style("visibility", "visible");
      })
      .on("mousemove", function (event, d) {
        // Change popup position based on cursor position
        // CourseDetailPopup.style("left", `${event.pageX + 20}px`).style(
        //   "top",
        //   `${event.pageY}px`
        // );
      })
      .on("mouseleave", function () {
        console.log("mouseout");
        // Revert highlight hovered course
        d3.selectAll(".node,.edge")
          .transition()
          .duration(200)
          .style("opacity", "1");

        d3.select(this)
          .selectAll("text")
          .transition()
          .duration(200)
          .style("fill", "black")
          .style("opacity", "1");

        d3.select(this)
          .selectAll("polygon")
          .transition()
          .duration(200)
          .style("stroke", "black")
          .style("opacity", "1");

        d3.select(this).select(".tooltip-btn__course-detail").remove();
        d3.select(this).select(".tooltip-btn__toggle-highlight").remove();

        CourseDetailPopup.style("visibility", "hidden");
      })
      .on("click", function (d, i) {
        const isHighlighted = d3.select(this).classed("highlighted");

        // Switch between true / false
        d3.select(this).classed("highlighted", !isHighlighted);
        d3.select(this)
          .selectAll("text")
          .style("fill", isHighlighted ? "black" : "red");
        d3.select(this)
          .selectAll("polygon")
          .style("stroke", isHighlighted ? "black" : "red");
      });
  };

  return (
    <Box sx={{ overflow: "hidden" }}>
      {dot && (
        <Graphviz
          options={{
            convertEqualSidedPolygons: true,
            height: 1500,
            width: 2500,
            zoom: true,
            // layout: {
            //   hierarchical: false,
            // },
            useWorker: true,
            useSharedWorker: true,
            fit: true,
            zoomScaleExtent: [0.5, 3],
            // zoomTranslateExtent: [
            //   [-5000, -5000],
            //   [+5000, +5000],
            // ],
          }}
          dot={dot}
        />
      )}
    </Box>
  );
};

// DiagramDot.

export default DiagramDot;
