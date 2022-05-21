import Box from "@mui/material/Box";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
} from "react-flow-renderer";

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

const CurriculumPreviewChange = () => {
  return (
    <Box
      sx={{
        overflowX: "auto",
        flexGrow: 1,
        bgColor: "rgba(0, 0, 0, 0)",
        width: "100%",
        height: 700,
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          className="flow-curriculum-preview-change"
          nodes={initialNodes}
          edges={initialEdges}
          draggable={false}
          panOnDrag={false}
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
