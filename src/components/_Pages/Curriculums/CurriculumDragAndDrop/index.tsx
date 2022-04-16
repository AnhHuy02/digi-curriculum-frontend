import Box from "@mui/material/Box";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";

import DndToolbar from "./DndToolbar";
import DndPane from "./DndPane";
import DiagramDot from "./DiagramPane/DiagramDot";
// import DiagramBeautiful from "./DiagramPane/DiagramBeautiful";
import ModalAddCourse from "./CustomModals/ModalAddCourse";
import { useAppSelector } from "src/hooks/useStore";
import { CurriculumDiagramType as DiagramType } from "src/constants/curriculum.const";

interface DiagramPaneProps {
  viewMode: DiagramType;
}

const DiagramPane = (props: DiagramPaneProps) => {
  const { viewMode } = props;

  // Create a stylee for individual scrolling
  return viewMode === DiagramType.NONE ? null : (
    <Box
      sx={{
        height: "100%",
        // overflowY: "none",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
      }}
    >
      {/* {viewMode === DiagramType.DEFAULT && <DiagramBeautiful />} */}
      {viewMode === DiagramType.DOT && <DiagramDot />}
    </Box>
  );
};

const CurriculumDragAndDrop = () => {
  const diagramViewMode = useAppSelector(
    (store) => store.curriculums.diagramViewMode
  );

  return (
    <Box display="flex" flexDirection={"column"} height={"100%"}>
      <Box className="dnd__toolbar">
        <DndToolbar />
      </Box>
      <ReflexContainer orientation="vertical">
        <ReflexElement className="left-pane" minSize={300}>
          <DndPane />
          <ModalAddCourse />
        </ReflexElement>

        {diagramViewMode !== DiagramType.NONE && (
          <ReflexSplitter style={{ width: "5px", height: "100%" }} />
        )}

        {diagramViewMode !== DiagramType.NONE && (
          <ReflexElement className="right-pane" minSize={300}>
            <DiagramPane viewMode={diagramViewMode} />
          </ReflexElement>
        )}
      </ReflexContainer>
    </Box>
  );
};

export default CurriculumDragAndDrop;
