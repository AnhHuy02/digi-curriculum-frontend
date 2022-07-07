import Box from "@mui/material/Box";
import { ReflexContainer, ReflexElement } from "react-reflex";

import DndToolbar from "./DndToolbar";
import DndPane from "./DndPane";
import ModalRandomCurriculums from "./CustomModals/ModalRandomCurriculums";
import ModalAddCourse from "./CustomModals/ModalAddCourse";
import ModalCourseDetail from "./CustomModals/ModalCourseDetail";
import ModalPreviewCurriculumDetail from "./CustomModals/ModalPreviewCurriculumDetail";
import { CurriculumDiagramType as DiagramType } from "src/constants/curriculum.const";

interface DiagramPaneProps {
  viewMode: DiagramType;
}

const CurriculumDragAndDrop = () => {
  return (
    <Box display="flex" flexDirection={"column"} height={"100%"}>
      <Box className="dnd__toolbar">
        <DndToolbar />
      </Box>
      <ReflexContainer orientation="vertical">
        <ReflexElement className="left-pane" minSize={300}>
          <DndPane />
          <ModalRandomCurriculums />
          <ModalAddCourse />
          <ModalCourseDetail />
          <ModalPreviewCurriculumDetail />
        </ReflexElement>
      </ReflexContainer>
    </Box>
  );
};

export default CurriculumDragAndDrop;
