import type { MouseEvent } from "react";

import { useCallback, useMemo } from "react";
// import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import ReactFlow, {
  // addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Node,
  OnConnect,
} from "react-flow-renderer";

// const SmartEdgeProvider = dynamic(
//   async () => {
//     const { SmartEdgeProvider } = await import("@tisoap/react-flow-smart-edge");
//     return SmartEdgeProvider;
//   },
//   { ssr: false }
// );
// const SmartEdge = dynamic(
//   async () => {
//     const { SmartEdge } = await import("@tisoap/react-flow-smart-edge");
//     return SmartEdge;
//   },
//   { ssr: false }
// );

import { getDndNodesAndEdges } from "./helper";
import { useAppSelector, useAppDispatch } from "src/hooks/useStore";
import { setModalAddCourseRelationship } from "src/redux/courses.slice";
import TextNode from "./CustomNodes/TextNode";
import SemesterNode from "./CustomNodes/SemesterNode";
import AddCourseNode from "./CustomNodes/AddCourseNode";
import CourseNode from "./CustomNodes/CourseNode";
import RemoveRelationshipEdge from "./CustomEdges/RemoveRelationshipEdge";
import ModalAddCourseRelationship from "../../CustomModals/ModalAddCourseRelationship";

const nodeTypes = {
  textNode: TextNode,
  semesterNode: SemesterNode,
  addCourseNode: AddCourseNode,
  courseNode: CourseNode,
};
const edgeTypes = {
  // smart: SmartEdge,
  removeRelationshipEdge: RemoveRelationshipEdge,
};

const DndByCourseRelationship = () => {
  const dispatch = useAppDispatch();
  const allYears = useAppSelector(
    (store) => store.curriculums.curriculumDetail.allYears
  );
  const allYearIdsOrder = useAppSelector(
    (store) => store.curriculums.curriculumDetail.allYearsOrder
  );
  const allCourses = useAppSelector((store) => store.courses.courses);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState([]);

  useMemo(() => {
    const { nodes: initialNodes, edges: initialEdges } = getDndNodesAndEdges();
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [allYears, allYearIdsOrder, allCourses]);

  const onConnect: OnConnect = useCallback((connection) => {
    const { source, target } = connection;
    if (source !== null && target !== null) {
      dispatch(
        setModalAddCourseRelationship({
          isOpen: true,
          courseSourceId: source,
          courseTargetId: target,
        })
      );
    }
    // setEdges((eds) => addEdge(connection, eds));
  }, []);

  const handleNodeMouseEnter = (
    event: MouseEvent<Element, globalThis.MouseEvent>,
    node: Node<any>
  ) => {
    // console.log("mouseenter", node);
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
      {/* <SmartEdgeProvider options={{ debounceTime: 300 }}> */}
      <ReactFlow
        className="react-flow-subflows-example"
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
        onEdgesChange={onEdgeChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      {/* </SmartEdgeProvider> */}
      <ModalAddCourseRelationship />
    </Box>
  );
};

export default DndByCourseRelationship;
