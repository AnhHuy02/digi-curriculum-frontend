import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DragDropContext } from "react-beautiful-dnd";
import { useAppSelector, useAppDispatch } from "src/hooks/useStore";

import YearHeaderList from "./YearHeaderList";

const DndByYear = () => {
  const { allYearsOrder } = useAppSelector((store) => store.curriculums.curriculumDetail);
  const handleDragYear = (result: any, provided: any) => {
    // const { source, destination } = result;
    // const { dragYear, dragCourse } = this.props;
    // if (!destination) return;
    // if (
    //   source.droppableId === destination.droppableId &&
    //   source.index === destination.index
    // )
    //   return;

    // switch (result.type) {
    //   case "all-years": {
    //     dragYear(result, provided);
    //     return;
    //   }
    //   case "all-courses": {
    //     dragCourse(result, provided);
    //     return;
    //   }
    //   default: {
    //     return;
    //   }
    // }
  };

  return (
    <Box
      sx={{
        overflowX: "auto",
        flexGrow: 1,
      }}
    >
      <YearHeaderList yearCount={4} />
      <DragDropContext onDragEnd={handleDragYear}>
        {/* <YearList /> */}
      </DragDropContext>
    </Box>
  );
};

export default DndByYear;
