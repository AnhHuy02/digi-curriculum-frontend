import { MouseEvent } from "react";

import { useState, useCallback, useMemo } from "react";
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
  ReactFlowProvider,
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
import {
  setModalAddCourseRelationship,
  setModeEditCourseRelationship,
} from "src/redux/courses.slice";
import TextNode from "./CustomNodes/TextNode";
import SemesterNode from "./CustomNodes/SemesterNode";
import AddCourseNode from "./CustomNodes/AddCourseNode";
import CourseNode from "./CustomNodes/CourseNode";
import CourseRelationshipEdge from "./CustomEdges/CourseRelationshipEdge";
import ModalAddCourseRelationship from "../../CustomModals/ModalAddCourseRelationship";
import ModalManageYears from "../../CustomModals/ModalManageYears";

const nodeTypes = {
  textNode: TextNode,
  semesterNode: SemesterNode,
  addCourseNode: AddCourseNode,
  courseNode: CourseNode,
};
const edgeTypes = {
  // smart: SmartEdge,
  courseRelationshipEdge: CourseRelationshipEdge,
};

const DndByCourseRelationship = () => {
  const dispatch = useAppDispatch();
  const years = useAppSelector(
    (store) => store.curriculums.curriculumDetail.years
  );
  const allCourses = useAppSelector((store) => store.courses.courses);
  const showCourseRelationship = useAppSelector(
    (store) => store.curriculums.showCourseRelationship
  );
  const modeEditCourseRelationship = useAppSelector(
    (store) => store.courses.mode.editCourseRelationship
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState([]);
  const [edgesTemp, setEdgesTemp] = useState(edges);

  useMemo(() => {
    const { nodes: initialNodes, edges: initialEdges } = getDndNodesAndEdges();
    setNodes(initialNodes);
    setEdgesTemp(initialEdges);
    setEdges(showCourseRelationship ? initialEdges : []);
  }, [years, allCourses]);

  useMemo(() => {
    setEdges(showCourseRelationship ? edgesTemp : []);
  }, [showCourseRelationship]);

  const handlePaneClick = () => {
    if (
      modeEditCourseRelationship.enabled &&
      modeEditCourseRelationship.courseId
    ) {
      setEdges(
        edges.map((edge) => ({
          ...edge,
          data: { ...edge.data, highlighted: false },
        }))
      );
      dispatch(
        setModeEditCourseRelationship({ enabled: false, courseId: null })
      );
    }
  };

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
      <ReactFlowProvider>
        <ReactFlow
          className="flow-dnd-by-course-relationship"
          nodes={nodes}
          edges={edges}
          onNodeMouseEnter={(
            event: MouseEvent<Element, globalThis.MouseEvent>,
            node: Node<any>
          ) => {
            handleNodeMouseEnter(event, node);
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgeChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnect={onConnect}
          onPaneClick={handlePaneClick}
          fitView
        >
          <MiniMap />
          <Controls showInteractive={false} />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
      {/* </SmartEdgeProvider> */}
      <ModalAddCourseRelationship />
      <ModalManageYears />
    </Box>
  );
};

export default DndByCourseRelationship;
