import type { FC } from "react";
import type { DropResult } from "react-beautiful-dnd";
import type { Edge } from "react-flow-renderer";

import { memo, useState, useCallback } from "react";
import { Handle, Position } from "react-flow-renderer";
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
import {
  removeSelectedCourse,
  setModeEditCourseRelationship,
} from "src/redux/courses.slice";
import {
  removeCurriculumDetailCourse,
  moveCurriculumDetailCourse,
} from "src/redux/curriculums.slice";

const configCourseTile = style.courseTile;

interface CourseNodeProps {
  data: {
    yearId: string;
    semId: string;
    courseId: string;
    index: number;
  };
  onClickEditCourseRelationship?(courseId: string): void;
}

const CourseNode: FC<CourseNodeProps> = ({
  data,
  onClickEditCourseRelationship,
}) => {
  const { yearId, semId, courseId, index } = data;

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

  const handleSelect = () => {
    // this.props.onSelect();
  };

  const handleMoveUpCourse = () => {
    const payload: DropResult = {
      destination: {
        droppableId: `${yearId} ${semId}`,
        index: index - 1,
      },
      draggableId: id,
      mode: "FLUID",
      reason: "DROP",
      source: {
        droppableId: `${yearId} ${semId}`,
        index: index,
      },
      type: "move-semester-course",
    };
    handleClose();
    dispatch(moveCurriculumDetailCourse(payload));
  };

  const handleMoveDownCourse = () => {
    const payload: DropResult = {
      destination: {
        droppableId: `${yearId} ${semId}`,
        index: index + 1,
      },
      draggableId: id,
      mode: "FLUID",
      reason: "DROP",
      source: {
        droppableId: `${yearId} ${semId}`,
        index: index,
      },
      type: "move-semester-course",
    };
    handleClose();
    dispatch(moveCurriculumDetailCourse(payload));
  };

  const handleRemoveCourse = () => {
    dispatch(removeCurriculumDetailCourse({ yearId, semId, courseId }));
    dispatch(removeSelectedCourse(courseId));
  };

  const handleEditCourseRelationship = () => {
    dispatch(
      setModeEditCourseRelationship({ enabled: true, courseId: courseId })
    );
    highlightCourseRelationship();
    handleClose();

    if (onClickEditCourseRelationship) {
      onClickEditCourseRelationship(courseId);
    }
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

  return (
    <Box>
      <Handle
        id="relationshipSend"
        type="source"
        position={Position.Right}
        style={{
          // ...(modeEditCourseRelationship.enabled &&
          // modeEditCourseRelationship.courseId === courseId
          //   ? { visibility: "visible", width: "16px", height: "16px" }
          //   : { visibility: "hidden", width: "1px", height: "1px" }),
          visibility:
            modeEditCourseRelationship.enabled &&
            modeEditCourseRelationship.courseId === courseId
              ? "visible"
              : "hidden",
          width: "16px",
          height: "16px",
          left: "102px",
          // right: "0px",
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
          // marginY: theme.spacing(1),
          backgroundColor: "white",
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
            <MenuItem disabled onClick={handleClose}>
              Detail
            </MenuItem>
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
            })}
          >{`${credit.practice + credit.theory} CR`}</Typography>
        </Box>
      </Paper>

      <Handle
        type="target"
        position={Position.Left}
        id="relationshipReceive"
        style={{
          // ...(modeEditCourseRelationship.enabled &&
          // modeEditCourseRelationship.courseId !== courseId
          //   ? { visibility: "visible", width: "16px", height: "16px" }
          //   : { visibility: "hidden", width: "1px", height: "1px" }),
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
  );
};

export default memo(CourseNode);
