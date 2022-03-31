import type { DropResult } from "react-beautiful-dnd";

import { memo, useState, useCallback } from "react";
import { Handle, Position } from "react-flow-renderer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import { makeStyles } from "@material-ui/core/styles";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";
import styles from "./AddCourseNode.module.scss";
import { useAppSelector, useAppDispatch } from "src/hooks/useStore";
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
}

const CourseNode = ({ data }: CourseNodeProps) => {
  const { yearId, semId, courseId, index } = data;

  const dispatch = useAppDispatch();
  const courseDetail = useAppSelector(
    (store) => store.courses.courses[courseId]
  );
  const coursesPerSemesterLength = useAppSelector(
    (store) =>
      store.curriculums.curriculumDetail.allYears[yearId].semesters[semId]
        .courseIds.length
  );
  const { id, name, credit } = courseDetail;

  const [anchorEl, setAnchorEl] = useState(null);

  // const onChange = useCallback((evt) => {
  //   console.log(evt.target.value);
  // }, []);

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
    console.log("aasdasdasd", yearId, semId, courseId);
    dispatch(removeCurriculumDetailCourse({ yearId, semId, courseId }));
  };

  return (
    <Box>
      <Handle type="source" position={Position.Left} id="a" />
      <Paper
        sx={(theme) => ({
          width: theme.spacing(configCourseTile.width),
          padding: theme.spacing(configCourseTile.padding),
          marginY: theme.spacing(1),
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
            <MenuItem
              onClick={() => handleMoveUpCourse()}
              disabled={index === 0}
            >
              Move Up
            </MenuItem>
            <MenuItem
              onClick={() => handleMoveDownCourse()}
              disabled={index === coursesPerSemesterLength - 1}
            >
              Move Down
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
      <Handle type="target" position={Position.Right} id="b" />
    </Box>
  );
};

export default memo(CourseNode);
