import { useState, useEffect, useLayoutEffect, forwardRef } from "react";
import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import Split from "react-split";

import DndToolbar from "./DndToolbar";
import DndPane from "./DndPane";
import DiagramDot from "./DiagramPane/DiagramDot";
import DiagramBeautiful from "./DiagramPane/DiagramBeautiful";

import { useAppSelector } from "src/hooks/useStore";
import { CurriculumDiagramType as DiagramType } from "src/constants/curriculum.const";
import { getElementAbsoluteHeight } from "src/helper/cssHelper";
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

interface DndContentProps {
  getToolbarRef: any;
}
const DndContent = () => {
  const { diagramViewMode } = useAppSelector((store) => store.curriculums);
  const [height, setHeight] = useState<number | string>("auto");

  useLayoutEffect(() => {
    setHeight(getElementAbsoluteHeight(".dnd__content"));
    // console.log(getElementAbsoluteHeight(".dnd__toolbar"));
    // console.log(getElementAbsoluteHeight(".dnd__content"));
  }, []);

  return (
    <Box overflow={"auto"} height={height} p={4}>
      <Box height={1500} sx={{ bgcolor: "lightblue" }}></Box>
      {diagramViewMode !== DiagramType.NONE ? (
        <Split minSize={250} className={style["split"]}>
          <DndPane />
          <DiagramPane viewMode={diagramViewMode} />
        </Split>
      ) : (
        <DndPane />
      )}
    </Box>
  );
};

export default DndContent;
