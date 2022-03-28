import type { MouseEvent } from "react";

import { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Node,
} from "react-flow-renderer";

import { getDndNodesAndEdges } from "./helper";
import { useAppSelector } from "src/hooks/useStore";

const DndByCourseRelationship = () => {
  const allYears = useAppSelector(
    (store) => store.curriculums.curriculumDetail.allYears
  );
  const allYearIdsOrder = useAppSelector(
    (store) => store.curriculums.curriculumDetail.allYearsOrder
  );
  const allCourses = useAppSelector((store) => store.courses.courses);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useMemo(() => {
    const { nodes: initialNodes, edges: initialEdges } = getDndNodesAndEdges();
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [allYears, allYearIdsOrder, allCourses]);

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const handleNodeMouseEnter = (
    event: MouseEvent<Element, globalThis.MouseEvent>,
    node: Node<any>
  ) => {
    console.log("mouseenter", node);
  };

  return (
    <Box
      sx={{
        overflowX: "auto",
        flexGrow: 1,
        bgColor: "rgba(0, 0, 0, 0)",
        height: "inherit",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeMouseEnter={(
          event: MouseEvent<Element, globalThis.MouseEvent>,
          node: Node<any>
        ) => {
          handleNodeMouseEnter(event, node);
        }}
        // onNodeDragStop
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        className="react-flow-subflows-example"
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </Box>
  );
};

export default DndByCourseRelationship;
