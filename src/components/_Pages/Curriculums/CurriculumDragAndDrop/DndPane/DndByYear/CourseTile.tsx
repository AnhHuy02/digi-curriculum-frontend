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
import { useAppSelector, useAppDispatch } from "src/hooks/useStore";
import { CurriculumCommandType } from "src/constants/curriculum.const";
import { commitChangeToHistory } from "src/redux/curriculumChangeHistory.slice";

const configCourseTile = style.courseTile;

interface ICourseTileProps {
  yearId: string;
  yearIndex: number;
  semId: string;
  semIndex: number;
  courseId: string;
  index: number;
}

const CourseTile: FC<ICourseTileProps> = ({
  yearId,
  yearIndex,
  semId,
  semIndex,
  courseId,
  index,
}) => {
  const dispatch = useAppDispatch();
  const courseDetail = useAppSelector(
    (store) => store.courses.courses[courseId]
  );

  const { id, name, credit } = courseDetail;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            >
              {`${credit.practice + credit.theory} CR`}
            </Typography>
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

export default memo(CourseTile);
