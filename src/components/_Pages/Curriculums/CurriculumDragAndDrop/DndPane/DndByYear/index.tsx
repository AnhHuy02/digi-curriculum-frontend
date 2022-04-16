import type { DropResult, ResponderProvided } from "react-beautiful-dnd";

import Box from "@mui/material/Box";
import { DragDropContext } from "react-beautiful-dnd";

import { useAppSelector, useAppDispatch } from "src/hooks/useStore";

import YearHeaderList from "./YearHeaderList";
import YearList from "./YearList";
import ModalAddCourse from "../../CustomModals/ModalAddCourse";
import {
  moveCurriculumDetailYearsOrder,
  moveCurriculumDetailCourse,
} from "src/redux/curriculums.slice";

const DndByYear = () => {
  const dispatch = useAppDispatch();

  const handleDragYear = (result: DropResult, provided: ResponderProvided) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    switch (result.type) {
      case "move-years-order": {
        dispatch(moveCurriculumDetailYearsOrder(result));
        return;
      }
      case "move-semester-course": {
        dispatch(moveCurriculumDetailCourse(result));
        return;
      }
      default: {
        return;
      }
    }
  };

  return (
    <Box
      sx={{
        overflowX: "auto",
        flexGrow: 1,
        bgColor: "rgba(0, 0, 0, 0)",
        height: "inherit",
      }}
    >
      <YearHeaderList />
      <DragDropContext onDragEnd={handleDragYear}>
        <YearList />
      </DragDropContext>
    </Box>
  );
};

export default DndByYear;
