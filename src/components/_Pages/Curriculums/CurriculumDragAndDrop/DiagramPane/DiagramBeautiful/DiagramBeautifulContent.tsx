import type { FC } from "react";

import { memo } from "react";

import ReactFlow, { MiniMap, Controls, Elements } from "react-flow-renderer";
import { SmartEdge, SmartEdgeProvider } from "@tisoap/react-flow-smart-edge";

interface IDiagramBeautifulContentProps {
  elements: Elements;
}

const DiagramBeautifulContent: FC<IDiagramBeautifulContentProps> = ({
  elements,
}) => {
  return (
    <SmartEdgeProvider
      options={{
        debounceTime: 50,
        nodePadding: 10,
        gridRatio: 5,

        lineType: "curve",
        lessCorners: false,
      }}
    >
      <ReactFlow
        elements={elements}
        snapToGrid={true}
        snapGrid={[1, 1]}
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
        <Controls draggable={false} />
        {/* <Background
          color="#aaa"
          gap={15}
          variant={BackgroundVariant.Dots}
          size={1}
        /> */}
      </ReactFlow>
    </SmartEdgeProvider>
  );
};

export default memo(DiagramBeautifulContent);
