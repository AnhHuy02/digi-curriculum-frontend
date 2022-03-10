import { useEffect, memo } from "react";
import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import Split from "react-split";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";

import DndToolbar from "./DndToolbar";
import DndPane from "./DndPane";
import DiagramDot from "./DiagramPane/DiagramDot";
import DiagramBeautiful from "./DiagramPane/DiagramBeautiful";
import DndContent from "./DndContent";

import { useAppSelector } from "src/hooks/useStore";
import { CurriculumDiagramType as DiagramType } from "src/constants/curriculum.const";
import style from "./index.module.scss";

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
      {viewMode === DiagramType.DEFAULT && <DiagramBeautiful />}
      {viewMode === DiagramType.DOT && <DiagramDot />}
    </Box>
  );
};

const CurriculumDragAndDrop = () => {
  const { diagramViewMode } = useAppSelector((store) => store.curriculums);

  return (
    <Box display="flex" flexDirection={"column"} height={"100%"}>
      <Box className="dnd__toolbar">
        <DndToolbar />
      </Box>
      <ReflexContainer orientation="vertical">
        <ReflexElement className="left-pane">
          <DndPane />
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
    // <Box display="flex" flexDirection={"column"} height={"100%"}>
    //   <Box className="dnd__toolbar">
    //     <DndToolbar />
    //   </Box>
    //   <Box
    //     className={`${style["split-pane__container"]} dnd__content`}
    //     flexGrow={1}
    //     flexShrink={1}
    //     flexBasis={"auto"}
    //     overflow={"auto"}
    //     m={5}
    //     p={5}
    //     // sx={{ height: "75vh", width: "100%" }}
    //     // sx={{ height: "fit-content" }}
    //   >
    //     <DndContent />
    //     {/* {diagramViewMode !== DiagramType.NONE ? (
    //       <Split minSize={250} className={style["split"]}>
    //         <DndPane />
    //         <DiagramPane viewMode={diagramViewMode} />
    //       </Split>
    //     ) : (
    //       <DndPane />
    //     )} */}
    //   </Box>
    // </Box>
  );
};

export default CurriculumDragAndDrop;
