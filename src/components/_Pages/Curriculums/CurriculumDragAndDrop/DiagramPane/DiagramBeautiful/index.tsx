import Box from "@mui/material/Box";
import { useState, useEffect, useMemo, memo } from "react";

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Elements,
  OnLoadFunc,
  ConnectionMode,
  Node,
  Edge,
  EdgeTypesType,
  Connection,
  BackgroundVariant,
} from "react-flow-renderer";
import { SmartEdge, SmartEdgeProvider } from "@tisoap/react-flow-smart-edge";

import FloatingEdge from "src/components/_Shared/FloatingEdge";
// import DiagramBeautifulContent from "./DiagramBeautifulContent";
// import {
//   initialElements,
//   initialElements2,
//   initialElements3,
// } from "src/helper/mockDataGenerator/reactFlowData";
import { useAppSelector } from "src/hooks/useStore";
import { getReactFlowElements } from "src/helper/diagramGenerator/reactFlowDiagram";

const edgeTypes: EdgeTypesType = {
  floating: FloatingEdge,
};

const DiagramBeautiful = () => {
  const curriculumDetail = useAppSelector(
    (store) => store.curriculums.curriculumDetail
  );
  const courses = useAppSelector((store) => store.courses.courses);
  const [elements, setElements] = useState<Elements>([]);

  useEffect(() => {
    const { allYears, allYearsOrder } = curriculumDetail;
    const elements = getReactFlowElements({
      allCourses: courses,
      allYears,
      allYearIdsOrder: allYearsOrder,
    });
    setElements(elements);
    // setElements(initialElements3);
  }, [curriculumDetail]);

  const onLoad: OnLoadFunc = (reactFlowInstance) => {
    // console.log("flow loaded:", reactFlowInstance);
    reactFlowInstance.fitView();
  };

  const onElementsRemove = (elementsToRemove: Elements<any>) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onConnect = (connection: Edge<any> | Connection) =>
    setElements((els) => addEdge(connection, els));

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <SmartEdgeProvider
        options={{
          debounceTime: 200,
          nodePadding: 20,
          gridRatio: 10,
          lineType: "curve",
          lessCorners: false,
        }}
      >
        <ReactFlow
          elements={elements}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={onLoad}
          connectionMode={ConnectionMode.Loose}
          snapToGrid={true}
          snapGrid={[15, 15]}
          edgeTypes={{
            floating: FloatingEdge,
            smart: SmartEdge,
          }}
        >
          <MiniMap
            nodeStrokeColor={"#191b19"}
            nodeColor={(n) => {
              return "#ff0015";
            }}
            nodeBorderRadius={2}
          />
          <Controls />
          <Background
            color="#aaa"
            gap={15}
            variant={BackgroundVariant.Dots}
            size={1}
          />
        </ReactFlow>
      </SmartEdgeProvider>
    </Box>
  );
};

export default DiagramBeautiful;
