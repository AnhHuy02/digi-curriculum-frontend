import type { CurriculumDetailHistoryAction } from "src/types/Curriculum.type";

import Box from "@mui/material/Box";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";

import moment from "moment";

import { useAppSelector } from "src/hooks/useStore";
import { CurriculumCommandType } from "src/constants/curriculum.const";

const CurriculumChangeLog = () => {
  const commandLogs = useAppSelector(
    (store) => store.curriculumChangeHistory.changeHistory.commandLogs
  );
  const currentIndex = useAppSelector(
    (store) => store.curriculumChangeHistory.changeHistory.currentIndex
  );
  const allCourses = useAppSelector((store) => store.courses.courses);

  const filteredCommandLogs = commandLogs.slice(
    commandLogs.length - 1 - currentIndex
  );

  const ChangeDescription = (commandLog: CurriculumDetailHistoryAction) => {
    switch (commandLog.type) {
      case CurriculumCommandType.ADD_COURSE_RELATIONSHIP: {
        const { courseSourceId, courseTargetId, relationship } =
          commandLog.patch;

        return (
          <Box>
            <Typography>
              Added <b>{relationship}</b> relationship for{" "}
              <b>{allCourses[courseSourceId].name}</b> {"-> "}
              <b>{allCourses[courseTargetId].name}</b>.
            </Typography>
          </Box>
        );
      }
      case CurriculumCommandType.REMOVE_COURSE_RELATIONSHIP: {
        const { courseSourceId, courseTargetId, relationship } =
          commandLog.patch;

        return (
          <Box>
            <Typography>
              Removed <b>{relationship}</b> relationship between{" "}
              <b>{allCourses[courseSourceId].name}</b> and{" "}
              <b>{allCourses[courseTargetId].name}</b>.
            </Typography>
          </Box>
        );
      }
      case CurriculumCommandType.CHANGE_COURSE_RELATIONSHIP: {
        const {
          courseSourceId,
          courseTargetId,
          oldRelationship,
          newRelationship,
        } = commandLog.patch;
        return (
          <Box>
            <Typography>
              Changed <b>{oldRelationship}</b> to <b>{newRelationship}</b>{" "}
              relationship for <b>{allCourses[courseSourceId].name}</b> with{" "}
              <b>{allCourses[courseTargetId].name}</b>.
            </Typography>
          </Box>
        );
      }
      case CurriculumCommandType.ADD_COURSES_TO_SEMESTER: {
        const { yearId, yearIndex, semId, semIndex, courseIds } =
          commandLog.patch;

        return (
          <Box>
            <Typography>
              Added the following course(s) at Year {yearIndex + 1} Semester{" "}
              {semIndex + 1}:
              <ul>
                {courseIds.map((courseId) => (
                  <li>{<b>{allCourses[courseId].name}</b>}</li>
                ))}
              </ul>
            </Typography>
          </Box>
        );
      }
      case CurriculumCommandType.REMOVE_COURSE_FROM_SEMESTER: {
        const { yearId, yearIndex, semId, semIndex, courseId } =
          commandLog.patch;

        return (
          <Box>
            <Typography>
              Removed <b>{allCourses[courseId].name}</b> from Year{" "}
              {yearIndex + 1} Semester {semIndex + 1}.
            </Typography>
          </Box>
        );
      }
      case CurriculumCommandType.CHANGE_COURSE_BETWEEN_TWO_SEMESTER: {
        const {
          courseId,
          sourceYearId,
          sourceYearIndex,
          sourceSemId,
          sourceSemIndex,
          sourceTakeoutIndex,
          targetYearId,
          targetYearIndex,
          targetSemId,
          targetSemIndex,
          targetInsertIndex,
        } = commandLog.patch;

        return (
          <Box>
            <Typography>
              Moved <b>{allCourses[courseId].name}</b> from{" "}
              <b>
                Year {sourceYearIndex + 1} Semester {sourceSemIndex + 1}
              </b>
              {" to "}
              <b>
                Year {targetYearIndex + 1} Semester {targetSemIndex + 1}
              </b>
              .
            </Typography>
          </Box>
        );
      }
      case CurriculumCommandType.CHANGE_YEAR_ORDER: {
        const { yearId, sourceTakeoutIndex, targetInsertIndex } =
          commandLog.patch;

        return (
          <Box>
            <Typography>
              Taken <b>Year {sourceTakeoutIndex + 1}</b> out and put in{" "}
              <b>Year {targetInsertIndex + 1}</b>.
            </Typography>
          </Box>
        );
      }
      case CurriculumCommandType.ADD_YEAR: {
        const {} = commandLog.patch;

        return (
          <Box>
            <Typography>Added new year.</Typography>
          </Box>
        );
      }
      case CurriculumCommandType.REMOVE_YEAR: {
        const { yearId, yearIndex, yearDetail } = commandLog.patch;
        return (
          <Box>
            <Typography>
              Removed <b>Year {yearIndex + 1}</b>
            </Typography>
          </Box>
        );
      }
      default: {
        return null;
      }
    }
  };

  // console.log(commandLogs);

  return (
    <Box>
      <Timeline position="right">
        {filteredCommandLogs.map((commandLog, commandIndex, commandLogs) => {
          const lastestCommand =
            commandLogs[commandLogs.length - 1 - commandIndex];

          return (
            <TimelineItem
              key={(lastestCommand.createdAt as string | number).toString()}
              sx={{ ":before": { content: "none" } }}
            >
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" component="span">
                  {moment(lastestCommand.createdAt).format("lll")}
                </Typography>
                {ChangeDescription(lastestCommand)}
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
};

export default CurriculumChangeLog;
