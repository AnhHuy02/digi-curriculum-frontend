import type { FC } from "react";

import { useState, memo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Draggable } from "react-beautiful-dnd";

import SemesterList from "./SemesterList";
import { style } from "src/constants/component-specs/curriculum-edit-by-years";
import { useAppSelector, useAppDispatch } from "src/hooks/useStore";
import { removeSelectedCourses } from "src/redux/courses.slice";
import { removeCurriculumDetailYear } from "src/redux/curriculums.slice";

const configYear = style.year;

interface YearProps {
  index: number;
  yearId: string;
}
const Year: FC<YearProps> = ({ index, yearId }) => {
  const dispatch = useAppDispatch();
  const allYears = useAppSelector(
    (state) => state.curriculums.curriculumDetail.allYears
  );
  const { semestersOrder } = allYears[yearId];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRemoveYear = () => {
    let courseIds: string[] = [];
    const { semesters, semestersOrder } = allYears[yearId];
    semestersOrder.forEach((semId) => {
      courseIds.push(...semesters[semId].courseIds);
    });

    dispatch(removeSelectedCourses(courseIds));
    dispatch(removeCurriculumDetailYear(yearId));
    handleCloseMenu();
  };

  return (
    <Draggable draggableId={yearId} index={index}>
      {(provided) => {
        return (
          <Paper
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            elevation={5}
            sx={(theme) => ({
              padding: theme.spacing(configYear.padding),
              marginLeft: theme.spacing(configYear.marginLeft),
              marginY: theme.spacing(configYear.margin),
              backgroundColor: "rgba(230, 230, 230, 0.6)",
            })}
          >
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-start"
            >
              <IconButton size={`small`} onClick={handleClickMenu}>
                <MoreHorizIcon />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => handleCloseMenu()}
              >
                <MenuItem onClick={() => handleRemoveYear()}>Remove</MenuItem>
              </Menu>
            </Box>
            <SemesterList semListId={yearId} allSemIdsOrder={semestersOrder} />
          </Paper>
        );
      }}
    </Draggable>
  );
};

export default memo(Year);
