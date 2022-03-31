import Box from "@mui/material/Box";

import DndByYear from "./DndByYear";
import DndByCourseRelationship from "./DndByCourseRelationship";
import { CurriculumDndType } from "src/constants/curriculum.const";
import { useAppSelector } from "src/hooks/useStore";

const DndPane = () => {
  const dndViewMode = useAppSelector((store) => store.curriculums.dndViewMode);

  return (
    <Box height="inherit">
      {dndViewMode === CurriculumDndType.DND_BY_YEAR && <DndByYear />}
      {dndViewMode === CurriculumDndType.DND_BY_COURSE_RELATIONSHIP && (
        <DndByCourseRelationship />
      )}
    </Box>
  );
};

export default DndPane;
