import type { DropResult, ResponderProvided } from "react-beautiful-dnd";

import Box from "@mui/material/Box";
import { DragDropContext } from "react-beautiful-dnd";

import { useAppDispatch } from "src/hooks/useStore";

import YearHeaderList from "./YearHeaderList";
import YearList from "./YearList";
import { CurriculumCommandType } from "src/constants/curriculum.const";
import { commitChangeToHistory } from "src/redux/curriculumChangeHistory.slice";

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
        if (result.destination !== undefined) {
          const yearId = result.draggableId;
          const sourceTakeoutIndex = result.source.index;
          const targetInsertIndex = result.destination.index;

          dispatch(
            commitChangeToHistory({
              type: CurriculumCommandType.CHANGE_YEAR_ORDER,
              patch: {
                yearId,
                sourceTakeoutIndex,
                targetInsertIndex,
              },
            })
          );
        }
        return;
      }
      case "move-semester-course": {
        if (result.destination !== undefined) {
          const [sourceYearId, sourceSemId] =
            result.source.droppableId.split(" ");
          const sourceTakeoutIndex = result.source.index;
          const [targetYearId, targetSemId] =
            result.destination.droppableId.split(" ");
          const targetInsertIndex = result.destination.index;

          dispatch(
            commitChangeToHistory({
              type: CurriculumCommandType.CHANGE_COURSE_BETWEEN_TWO_SEMESTER,
              patch: {
                courseId: result.draggableId,
                sourceYearId,
                sourceSemId,
                sourceTakeoutIndex,
                targetYearId,
                targetSemId,
                targetInsertIndex,
              },
            })
          );
        }
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
