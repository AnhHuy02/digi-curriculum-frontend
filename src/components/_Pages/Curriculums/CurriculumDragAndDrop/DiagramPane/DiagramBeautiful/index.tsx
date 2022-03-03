import Box from "@mui/material/Box";
import React, { useState } from "react";

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Elements,
  OnLoadFunc,
  Node,
  Edge,
  Connection,
} from "react-flow-renderer";
import { SmartEdge, SmartEdgeProvider } from "@tisoap/react-flow-smart-edge";

import {
  initialElements,
  initialElements2,
} from "src/helper/mockDataGenerator/reactFlowData";

const onLoad: OnLoadFunc = (reactFlowInstance) => {
  console.log("flow loaded:", reactFlowInstance);
  reactFlowInstance.fitView();
};

const DiagramBeautiful = () => {
  const [elements, setElements] = useState<Elements>(initialElements2);

  const onElementsRemove = (elementsToRemove: Elements<any>) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onConnect = (connection: Edge<any> | Connection) =>
    setElements((els) => addEdge(connection, els));

  // const getNodeStrokeColor = (node?: Node<any>): string | undefined => {
  //   if (node?.style?.background) return node?.style.background.toString();
  //   if (node?.type === "input") return "#0041d0";
  //   if (node?.type === "output") return "#ff0072";
  //   if (node?.type === "default") return "#1a192b";
  //   return "#eee";
  // };

  return (
    <Box sx={{ overflow: "hidden", width: 1000, height: 1000, p: 3 }}>
      <SmartEdgeProvider
        options={{
          debounceTime: 50,
          nodePadding: 10,
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
          snapToGrid={true}
          snapGrid={[15, 15]}
          edgeTypes={{
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
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </SmartEdgeProvider>
    </Box>
  );
};

export default DiagramBeautiful;
