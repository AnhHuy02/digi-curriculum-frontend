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

import { initialElements } from "src/helper/mockDataGenerator/reactFlowData";

const onLoad: OnLoadFunc = (reactFlowInstance) => {
  console.log("flow loaded:", reactFlowInstance);
  reactFlowInstance.fitView();
};

const DiagramBeautiful = () => {
  const [elements, setElements] = useState<Elements>(initialElements);

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
    <Box sx={{ overflow: "hidden", width: "inherit", height: 1000, p: 3 }}>
      asdasd
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
        snapToGrid={true}
        snapGrid={[15, 15]}
      
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
    </Box>
  );
};

export default DiagramBeautiful;
