import type { FC } from "react";

import { useEffect } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  ReactFlowProvider,
} from "react-flow-renderer";
import Box from "@mui/material/Box";

import { useAppSelector } from "src/hooks/useStore";
import { getDndNodesAndEdges } from "src/helper/diagramGenerator/diffDiagramSimple";
import TextNode from "../../DndPane/DndByCourseRelationship/CustomNodes/TextNode";
import SemesterNodePreview from "../../DndPane/DndByCourseRelationship/CustomNodes/SemesterNodePreview";
import CourseNodePreview from "../../DndPane/DndByCourseRelationship/CustomNodes/CourseNodePreview";

const nodeTypes = {
  textNode: TextNode,
  semesterNode: SemesterNodePreview,
  courseNode: CourseNodePreview,
};

interface CurriculumSimpleDiffProps {
  width?: number;
  height?: number;
}

const CurriculumSimpleDiff: FC<CurriculumSimpleDiffProps> = ({
  width,
  height,
}) => {
  const allYears = useAppSelector(
    (store) => store.curriculums.curriculumDetail.allYears
  );
  const allYearIdsOrder = useAppSelector(
    (store) => store.curriculums.curriculumDetail.allYearsOrder
  );

  const [nodes, setNodes] = useNodesState([]);

  useEffect(() => {
    const { nodes: initialNodes } = getDndNodesAndEdges();
    setNodes(initialNodes);
  }, [allYears, allYearIdsOrder]);

  return (
    <Box
      sx={{
        overflowX: "auto",
        flexGrow: 1,
        bgColor: "rgba(0, 0, 0, 0)",
        width: width || "100%",
        height: height || 700,
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          className="flow-curriculum-simple-preview-change"
          nodes={nodes}
          edges={[]}
          draggable={false}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </Box>
  );
};

export default CurriculumSimpleDiff;
