import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Split from "react-split";

import DndToolbar from "./DndToolbar";
import DndPane from "./DndPane";
import DiagramDot from "./DiagramPane/DiagramDot";
import DiagramBeautiful from "./DiagramPane/DiagramBeautiful";

import { useAppSelector } from "src/hooks/useStore";
import { CurriculumDiagramType as DiagramType } from "src/constants/curriculumDiagramType";
import style from "./index.module.scss";

interface DiagramPaneProps {
  viewMode: DiagramType;
}

const DiagramPane = (props: DiagramPaneProps) => {
  const { viewMode } = props;

  return viewMode === DiagramType.NONE ? null : (
    <Box sx={{ width: "inherit" }}>
      {viewMode === DiagramType.DEFAULT && <DiagramBeautiful />}
      {viewMode === DiagramType.DOT && <DiagramDot />}
    </Box>
  );
};

const CurriculumDragAndDrop = () => {
  const { diagramViewMode } = useAppSelector((store) => store.curriculums);
  
  return (
    <Box>
      <DndToolbar />
      <Box
        sx={{ height: "75vh", width: "100%" }}
        className={style["split-pane__container"]}
      >
        {diagramViewMode !== DiagramType.NONE ? (
          <Split minSize={250} className={style["split"]}>
            <DndPane />
            <DiagramPane viewMode={diagramViewMode} />
          </Split>
        ) : (
          <DndPane />
        )}
      </Box>
    </Box>
  );
};

export default CurriculumDragAndDrop;
