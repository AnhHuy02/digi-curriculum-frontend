import Box from "@mui/material/Box";

import { Droppable } from "react-beautiful-dnd";

import Year from "./Year";
import YearAddButton from "./YearAddButton";
import { useAppSelector } from "src/hooks/useStore";

const YearList = () => {
  const years = useAppSelector(
    (state) => state.curriculums.curriculumDetail.years
  );

  return (
    <Box display="inline-flex" flexDirection="column">
      <Droppable
        droppableId={"years-order"}
        type={`move-years-order`}
        direction="horizontal"
      >
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            display={`flex`}
            flexDirection={`row`}
            alignItems={`flex-start`}
          >
            {years.allIds.map((yearId, index) => {
              return (
                <Year key={yearId} yearId={yearId as string} index={index} />
              );
            })}
            {provided.placeholder}
            <YearAddButton />
          </Box>
        )}
      </Droppable>
    </Box>
  );
};

export default YearList;
