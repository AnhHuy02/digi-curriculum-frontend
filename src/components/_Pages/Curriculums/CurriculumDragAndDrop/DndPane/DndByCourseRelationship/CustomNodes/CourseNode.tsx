import { FC } from "react";
import type { Edge } from "react-flow-renderer";

import { memo, useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useReactFlow, useEdges } from "react-flow-renderer";
import _cloneDeep from "lodash/cloneDeep";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";
import { useAppSelector, useAppDispatch } from "src/hooks/useStore";
import { setModeEditCourseRelationship } from "src/redux/courses.slice";
import {
  setShowCourseRelationship,
  setModalCourseDetail,
} from "src/redux/curriculums.slice";
import { commitChangeToHistory } from "src/redux/curriculumChangeHistory.slice";
import { CurriculumCommandType } from "src/constants/curriculum.const";

const configCourseTile = style.courseTile;

interface CourseNodeProps {
  data: {
    yearId: string;
    yearIndex: number;
    semId: string;
    semIndex: number;
    courseId: string;
    index: number;
  };
  onClickEditCourseRelationship?(courseId: string): void;
}

const CourseNode: FC<CourseNodeProps> = ({
  data,
  onClickEditCourseRelationship,
}) => {
  const { yearId, yearIndex, semId, semIndex, courseId, index } = data;

  const reactFlowInstance = useReactFlow();
  const edges: Edge[] = useEdges();

  const dispatch = useAppDispatch();
  const courseDetail = useAppSelector(
    (store) => store.courses.courses[courseId]
  );
  const coursesPerSemesterLength = useAppSelector(
    (store) =>
      store.curriculums.curriculumDetail.allYears[yearId].semesters[semId]
        .courseIds.length
  );
  const modeEditCourseRelationship = useAppSelector(
    (store) => store.courses.mode.editCourseRelationship
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const { id, name, credit } = courseDetail;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMoveUpCourse = () => {
    handleClose();
    dispatch(
      commitChangeToHistory({
        type: CurriculumCommandType.CHANGE_COURSE_BETWEEN_TWO_SEMESTER,
        patch: {
          courseId: courseId,
          sourceYearId: yearId,
          sourceYearIndex: yearIndex,
          sourceSemId: semId,
          sourceSemIndex: semIndex,
          sourceTakeoutIndex: index,
          targetYearId: yearId,
          targetYearIndex: yearIndex,
          targetSemId: semId,
          targetSemIndex: semIndex,
          targetInsertIndex: index - 1,
        },
      })
    );
  };

  const handleMoveDownCourse = () => {
    handleClose();
    dispatch(
      commitChangeToHistory({
        type: CurriculumCommandType.CHANGE_COURSE_BETWEEN_TWO_SEMESTER,
        patch: {
          courseId: courseId,
          sourceYearId: yearId,
          sourceYearIndex: yearIndex,
          sourceSemId: semId,
          sourceSemIndex: semIndex,
          sourceTakeoutIndex: index,
          targetYearId: yearId,
          targetYearIndex: yearIndex,
          targetSemId: semId,
          targetSemIndex: semIndex,
          targetInsertIndex: index + 1,
        },
      })
    );
  };

  const handleRemoveCourse = () => {
    dispatch(
      commitChangeToHistory({
        type: CurriculumCommandType.REMOVE_COURSE_FROM_SEMESTER,
        patch: {
          yearId,
          yearIndex,
          semId,
          semIndex,
          courseId,
        },
      })
    );
  };

  const handleEditCourseRelationship = () => {
    dispatch(setShowCourseRelationship(true));
    dispatch(
      setModeEditCourseRelationship({ enabled: true, courseId: courseId })
    );
    highlightCourseRelationship();
    handleClose();

    if (onClickEditCourseRelationship) {
      onClickEditCourseRelationship(courseId);
    }
  };

  const handleViewCourseDetail = () => {
    dispatch(
      setModalCourseDetail({
        isOpen: true,
        courseId: courseId,
      })
    );
    handleClose();
  };

  const highlightCourseRelationship = () => {
    const newEdges = edges.map((edge) => {
      const edgeId = edge.id;

      const [courseSourceId, relationshipType, courseTargetId] = edgeId
        .replace(/edge[0-9]+-/, "") // it will be like "IT069->IT013"
        .split(/-(prerequisite|corequisite|previous)-/); // Some relations are -> or --,

      if ([courseSourceId, courseTargetId].includes(courseId)) {
        // Highlight all nearby edges
        return {
          ...edge,
          data: {
            ...edge.data,
            highlighted: true,
          },
        };
      } else {
        // Unhighlight all unrelated edges
        return {
          ...edge,
          data: {
            ...edge.data,
            highlighted: false,
          },
        };
      }
    });

    reactFlowInstance.setEdges(newEdges);
  };

  const handleClickAwayCourse = () => {
    if (
      modeEditCourseRelationship.courseId === courseId &&
      modeEditCourseRelationship.enabled
    ) {
      reactFlowInstance.setEdges(
        edges.map((edge) => ({
          ...edge,
          data: { ...edge.data, highlighted: false },
        }))
      );
      dispatch(
        setModeEditCourseRelationship({ enabled: false, courseId: null })
      );
    }
  };

  return (
    <ClickAwayListener
      mouseEvent="onClick"
      touchEvent="onTouchEnd"
      onClickAway={handleClickAwayCourse}
    >
      <Box>
        <Handle
          id="relationshipSend"
          type="source"
          position={Position.Right}
          style={{
            visibility:
              modeEditCourseRelationship.enabled &&
              modeEditCourseRelationship.courseId === courseId
                ? "visible"
                : "hidden",
            width: "16px",
            height: "16px",
            left: "102px",
            zIndex: 1000,
            border: "2px solid rgba(224, 67, 67, 1)",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronRightIcon
            style={{ pointerEvents: "none" }}
            fontSize="inherit"
          />
        </Handle>
        <Paper
          sx={(theme) => ({
            width: theme.spacing(configCourseTile.width),
            padding: theme.spacing(configCourseTile.padding),

            backgroundColor:
              modeEditCourseRelationship.courseId === courseId
                ? "rgba(25, 118, 210, 1)"
                : "white",
          })}
        >
          <Box
            display={`flex`}
            justifyContent={`flex-end`}
            alignItems={`flex-start`}
          >
            <IconButton
              size={`small`}
              onClick={handleClick}
              sx={(theme) => ({
                margin: theme.spacing(0),
                padding: theme.spacing(0),
                height: theme.spacing(2),
              })}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleViewCourseDetail}>Detail</MenuItem>
              <MenuItem onClick={handleMoveUpCourse} disabled={index === 0}>
                Move Up
              </MenuItem>
              <MenuItem
                onClick={handleMoveDownCourse}
                disabled={index === coursesPerSemesterLength - 1}
              >
                Move Down
              </MenuItem>
              <MenuItem onClick={handleEditCourseRelationship}>
                Edit Course Relationship
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleRemoveCourse()}>Remove</MenuItem>
            </Menu>
          </Box>
          <Box
            display={`flex`}
            justifyContent={`center`}
            alignItems={`center`}
            sx={(theme) => ({
              height: theme.spacing(6),
            })}
          >
            <Typography
              variant={`body2`}
              sx={(theme) => ({
                fontSize: "0.75rem",
                fontWeight: theme.typography.fontWeightBold,
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                lineHeight: "0.75rem",
                color:
                  modeEditCourseRelationship.courseId === courseId
                    ? "white"
                    : "initial",
              })}
            >
              {name}
            </Typography>
          </Box>
          <Box sx={(theme) => ({ padding: theme.spacing(0.25) })}>
            <Typography
              variant={`body2`}
              sx={(theme) => ({
                fontSize: "0.75rem",
                fontWeight: theme.typography.fontWeightBold,
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                lineHeight: "0.75rem",
                color:
                  modeEditCourseRelationship.courseId === courseId
                    ? "white"
                    : "initial",
              })}
            >{`${credit.practice + credit.theory} CR`}</Typography>
          </Box>
        </Paper>

        <Handle
          type="target"
          position={Position.Left}
          id="relationshipReceive"
          style={{
            visibility:
              modeEditCourseRelationship.enabled &&
              modeEditCourseRelationship.courseId !== courseId
                ? "visible"
                : "hidden",
            width: "16px",
            height: "16px",
            left: "-10px",
            zIndex: 1000,
            border: "2px solid rgba(224, 67, 67, 1)",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default memo(CourseNode);
