import type { FC } from "react";

import { useState, memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { Draggable } from "react-beautiful-dnd";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";
import { useAppSelector } from "src/hooks/useStore";

const configCourseTile = style.courseTile;

interface ICourseTileProps {
  yearId: string;
  semId: string;
  courseId: string;
  index: number;
}

const CourseTile: FC<ICourseTileProps> = ({
  yearId,
  semId,
  courseId,
  index,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { id, name, credit } = useAppSelector(
    (store) => store.courses.courses[courseId]
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = () => {
    // this.props.onSelect();
  };

  const handleRemoveCourse = () => {
    // const { yearId, semId, courseId } = this.props;
    // const { removeCourseFromCurriculum, removeSelectedCourseFromCourseList } =
    //   this.props;

    const filteredSemId = semId;
    // const filteredSemId = semId.split(' ')[1];
    // removeCourseFromCurriculum({ yearId, semId: filteredSemId, courseId });
    // removeSelectedCourseFromCourseList(courseId);
  };

  // const { classes } = this.props;
  // const { courseId, index, name, credit } = this.props;
  // const { anchorEl } = this.state;

  return (
    <Draggable draggableId={courseId} index={index} key={courseId}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          sx={(theme) => ({
            width: theme.spacing(configCourseTile.width),
            padding: theme.spacing(configCourseTile.padding),
            margin: theme.spacing(1),
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
      )}
    </Draggable>
  );
};

export default memo(CourseTile);
