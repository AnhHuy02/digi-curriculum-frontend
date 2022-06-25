import type { FC } from "react";

import { useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import Box from "@mui/material/Box";

import { useAppSelector } from "src/hooks/useStore";
import { getDndNodesAndEdges } from "src/helper/diagramGenerator/diffDiagramComplex";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node" },
    position: { x: 250, y: 25 },
  },

  {
    id: "2",
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node" },
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

interface CurriculumSideBySideDiffProps {
  width?: number;
  height?: number;
}

const CurriculumPreviewChange: FC<CurriculumSideBySideDiffProps> = ({
  width,
  height,
}) => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const currentIndex = useAppSelector(
    (store) => store.curriculumChangeHistory.changeHistory.currentIndex
  );

  useEffect(() => {
    const { nodes, edges } = getDndNodesAndEdges();
    setNodes(nodes);
    setEdges(edges);
  }, [currentIndex]);

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
          className="flow-curriculum-preview-change"
          nodes={nodes}
          edges={edges}
          draggable={false}
          // panOnDrag={false}
          panOnScroll={true}
          zoomOnScroll={false}
          // nodeTypes={nodeTypes}
          // edgeTypes={edgeTypes}
          // onConnect={onConnect}
        >
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </Box>
  );
};

export default CurriculumPreviewChange;
